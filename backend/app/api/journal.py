import uuid

from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.models.journal_entry import JournalEntry

router = APIRouter(prefix="/api/v1/journal", tags=["journal"])


class JournalRequest(BaseModel):
    user_id: uuid.UUID
    encrypted_content: str
    mood_tag: str | None = None


@router.post("/entry", status_code=status.HTTP_201_CREATED)
async def create_journal_entry(request: JournalRequest, session: AsyncSession = Depends(get_session)) -> dict:
    entry = JournalEntry(
        user_id=request.user_id,
        encrypted_content=request.encrypted_content,
        mood_tag=request.mood_tag,
    )
    session.add(entry)
    await session.commit()
    await session.refresh(entry)

    return {
        "status": "success",
        "journal_id": str(entry.id),
    }
