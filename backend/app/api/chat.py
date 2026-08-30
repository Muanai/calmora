import uuid
from collections.abc import AsyncGenerator

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import delete, select

from app.core.config import Settings
from app.core.database import get_engine, get_session
from app.models.ai_memory import AiMemory
from app.models.chat_message import ChatMessage
from app.models.user import User
from app.services.memory_service import extract_and_save_memories
from app.services.rag_engine import stream_chat_response
from app.utils.encryption import decrypt_text, encrypt_text, safe_decrypt_text
from sqlmodel.ext.asyncio.session import AsyncSession as SQLModelAsyncSession
import asyncio

router = APIRouter(prefix="/api/v1/chat", tags=["chat"])


class ChatRequest(BaseModel):
    user_id: str
    message: str = Field(max_length=1000)
    intensity_level: str


class ChatHistoryItem(BaseModel):
    id: str
    role: str
    content: str
    created_at: str


class MemoryItem(BaseModel):
    id: str
    memory_text: str
    source: str
    created_at: str


class UserBioRequest(BaseModel):
    user_id: str
    bio: str = Field(max_length=2000)


@router.post("/stream")
async def chat_stream(
    request: ChatRequest,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session),
) -> StreamingResponse:
    settings: Settings = Settings()

    result = await session.exec(
        select(ChatMessage)
        .where(ChatMessage.user_id == request.user_id)
        .order_by(ChatMessage.created_at.desc())
        .limit(20)
    )
    raw_history: list[ChatMessage] = list(reversed(result.all()))

    chat_history: list[dict] = []
    for msg in raw_history:
        content: str = safe_decrypt_text(msg.encrypted_content, settings.ENCRYPTION_KEY)
        chat_history.append({"role": msg.role, "content": content})

    memories_result = await session.exec(
        select(AiMemory).where(AiMemory.user_id == request.user_id).order_by(AiMemory.created_at)
    )
    ai_memories: list[str] = [safe_decrypt_text(m.memory_text, settings.ENCRYPTION_KEY) for m in memories_result.all()]

    user_result = await session.exec(
        select(User).where(User.id == request.user_id)
    )
    user_record: User | None = user_result.first()
    user_bio: str | None = safe_decrypt_text(user_record.user_bio, settings.ENCRYPTION_KEY) if user_record and user_record.user_bio else None

    encrypted_user_msg: str = encrypt_text(request.message, settings.ENCRYPTION_KEY)
    user_msg_record: ChatMessage = ChatMessage(
        user_id=request.user_id,
        role="user",
        encrypted_content=encrypted_user_msg,
    )
    session.add(user_msg_record)
    await session.commit()

    async def _streaming_wrapper() -> AsyncGenerator[str, None]:
        full_response: str = ""
        async for chunk in stream_chat_response(
            user_message=request.message,
            intensity_level=request.intensity_level,
            settings=settings,
            chat_history=chat_history,
            ai_memories=ai_memories,
            user_bio=user_bio,
        ):
            if chunk.startswith("data: ") and '"full_response"' in chunk:
                import json
                try:
                    data: dict = json.loads(chunk[6:])
                    full_response = data.get("full_response", "")
                    if data.get("text") == "[DONE]":
                        if full_response:
                            encrypted_ai_msg: str = encrypt_text(full_response, settings.ENCRYPTION_KEY)
                            ai_msg_record: ChatMessage = ChatMessage(
                                user_id=request.user_id,
                                role="model",
                                encrypted_content=encrypted_ai_msg,
                            )
                            async with SQLModelAsyncSession(get_engine()) as save_session:
                                save_session.add(ai_msg_record)
                                await save_session.commit()

                            asyncio.create_task(
                                extract_and_save_memories(
                                    session=SQLModelAsyncSession(get_engine()),
                                    user_id=request.user_id,
                                    ai_response=full_response,
                                    settings=settings,
                                )
                            )
                        yield "data: [DONE]\r\n\r\n"
                        continue
                except Exception as e:
                    print(f"Error saving AI message: {e}")
                    pass
            yield chunk

    return StreamingResponse(
        _streaming_wrapper(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


@router.get("/history")
async def get_chat_history(
    user_id: str,
    session: AsyncSession = Depends(get_session),
) -> list[ChatHistoryItem]:
    settings: Settings = Settings()
    result = await session.exec(
        select(ChatMessage)
        .where(ChatMessage.user_id == user_id)
        .order_by(ChatMessage.created_at)
    )
    messages: list[ChatMessage] = list(result.all())

    items: list[ChatHistoryItem] = []
    for msg in messages:
        content: str = safe_decrypt_text(msg.encrypted_content, settings.ENCRYPTION_KEY)
        items.append(
            ChatHistoryItem(
                id=str(msg.id),
                role=msg.role,
                content=content,
                created_at=msg.created_at.isoformat(),
            )
        )
    return items


@router.get("/memories")
async def get_memories(
    user_id: str,
    session: AsyncSession = Depends(get_session),
) -> list[MemoryItem]:
    settings: Settings = Settings()
    result = await session.exec(
        select(AiMemory).where(AiMemory.user_id == user_id).order_by(AiMemory.created_at.desc())
    )
    memories: list[AiMemory] = list(result.all())
    return [
        MemoryItem(
            id=str(m.id),
            memory_text=safe_decrypt_text(m.memory_text, settings.ENCRYPTION_KEY),
            source=m.source,
            created_at=m.created_at.isoformat(),
        )
        for m in memories
    ]


@router.delete("/memories/{memory_id}")
async def delete_memory(
    memory_id: uuid.UUID,
    user_id: str,
    session: AsyncSession = Depends(get_session),
) -> dict[str, str]:
    result = await session.exec(
        select(AiMemory).where(AiMemory.id == memory_id, AiMemory.user_id == user_id)
    )
    memory: AiMemory | None = result.first()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found.")
    await session.delete(memory)
    await session.commit()
    return {"status": "deleted"}


@router.delete("/memories")
async def clear_all_memories(
    user_id: str,
    session: AsyncSession = Depends(get_session),
) -> dict[str, str]:
    await session.exec(delete(AiMemory).where(AiMemory.user_id == user_id))
    await session.commit()
    return {"status": "cleared"}


@router.get("/bio")
async def get_user_bio(
    user_id: str,
    session: AsyncSession = Depends(get_session),
) -> dict[str, str | None]:
    settings: Settings = Settings()
    result = await session.exec(select(User).where(User.id == user_id))
    record: User | None = result.first()
    bio: str | None = None
    if record and record.user_bio:
        bio = safe_decrypt_text(record.user_bio, settings.ENCRYPTION_KEY)
    return {"bio": bio}


@router.put("/bio")
async def save_user_bio(
    request: UserBioRequest,
    session: AsyncSession = Depends(get_session),
) -> dict[str, str]:
    settings: Settings = Settings()
    encrypted_bio = encrypt_text(request.bio, settings.ENCRYPTION_KEY)
    
    result = await session.exec(select(User).where(User.id == request.user_id))
    record: User | None = result.first()
    if not record:
        record = User(id=request.user_id, email="", user_bio=encrypted_bio)
        session.add(record)
    else:
        record.user_bio = encrypted_bio
        session.add(record)
    await session.commit()
    return {"status": "saved"}
