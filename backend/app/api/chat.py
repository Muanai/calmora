import uuid

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from app.core.config import Settings
from app.services.rag_engine import stream_chat_response

router = APIRouter(prefix="/api/v1/chat", tags=["chat"])


class ChatRequest(BaseModel):
    user_id: str
    message: str = Field(max_length=1000)
    intensity_level: str


@router.post("/stream")
async def chat_stream(request: ChatRequest) -> StreamingResponse:
    settings = Settings()
    return StreamingResponse(
        stream_chat_response(
            user_message=request.message,
            intensity_level=request.intensity_level,
            settings=settings,
        ),
        media_type="text/event-stream",
    )
