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
from app.services.memory_service import extract_and_save_memories
from app.services.rag_engine import stream_chat_response
from app.utils.encryption import decrypt_text, encrypt_text

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
        try:
            content: str = decrypt_text(msg.encrypted_content, settings.ENCRYPTION_KEY)
        except Exception:
            content = ""
        chat_history.append({"role": msg.role, "content": content})

    memories_result = await session.exec(
        select(AiMemory).where(AiMemory.user_id == request.user_id).order_by(AiMemory.created_at)
    )
    ai_memories: list[str] = [m.memory_text for m in memories_result.all()]

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
                            async with AsyncSession(get_engine()) as save_session:
                                save_session.add(ai_msg_record)
                                await save_session.commit()

                            background_tasks.add_task(
                                extract_and_save_memories,
                                session=AsyncSession(get_engine()),
                                user_id=request.user_id,
                                ai_response=full_response,
                                settings=settings,
                            )
                        yield "data: [DONE]\r\n\r\n"
                        continue
                except (json.JSONDecodeError, KeyError):
                    pass
            yield chunk

    return StreamingResponse(_streaming_wrapper(), media_type="text/event-stream")


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
        try:
            content: str = decrypt_text(msg.encrypted_content, settings.ENCRYPTION_KEY)
        except Exception:
            content = ""
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
    result = await session.exec(
        select(AiMemory).where(AiMemory.user_id == user_id).order_by(AiMemory.created_at.desc())
    )
    memories: list[AiMemory] = list(result.all())
    return [
        MemoryItem(
            id=str(m.id),
            memory_text=m.memory_text,
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
