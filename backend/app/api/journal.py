import uuid
from datetime import date, datetime

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.core.database import get_session
from app.models.action_log import ActionLog
from app.models.journal_entry import JournalEntry
from app.services.shadow_point import process_action

router = APIRouter(prefix="/api/v1/journal", tags=["journal"])


class JournalRequest(BaseModel):
    user_id: str
    encrypted_content: str
    mood_tag: str | None = None
    title: str | None = None


class JournalEntryResponse(BaseModel):
    id: str
    user_id: str
    encrypted_content: str
    mood_tag: str | None
    title: str | None
    created_at: datetime


async def _award_journal_points(user_id: str) -> None:
    from app.core.database import get_session

    async for session in get_session():
        action_log = ActionLog(
            user_id=user_id,
            action_type="journal",
            duration_seconds=0,
            completed=True,
        )
        session.add(action_log)
        await session.commit()
        await process_action(session, action_log)


from app.utils.encryption import encrypt_text, decrypt_text
from app.core.config import Settings

settings = Settings()

@router.post("/entry", status_code=status.HTTP_201_CREATED)
async def create_journal_entry(
    request: JournalRequest,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session),
) -> dict:
    # Encrypt the content before saving it to the database
    safe_content = encrypt_text(request.encrypted_content, settings.ENCRYPTION_KEY)
    
    entry = JournalEntry(
        user_id=request.user_id,
        encrypted_content=safe_content,
        mood_tag=request.mood_tag,
        title=request.title,
    )
    session.add(entry)
    await session.commit()
    await session.refresh(entry)

    background_tasks.add_task(_award_journal_points, user_id=request.user_id)

    return {
        "status": "success",
        "journal_id": str(entry.id),
    }


@router.get("/entries")
async def list_journal_entries(
    user_id: str = Query(...),
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    session: AsyncSession = Depends(get_session),
) -> list[JournalEntryResponse]:
    statement = select(JournalEntry).where(JournalEntry.user_id == user_id)

    if start_date is not None:
        statement = statement.where(
            JournalEntry.created_at >= datetime.combine(start_date, datetime.min.time())
        )
    if end_date is not None:
        statement = statement.where(
            JournalEntry.created_at <= datetime.combine(end_date, datetime.max.time())
        )

    statement = statement.order_by(JournalEntry.created_at.desc())
    result = await session.exec(statement)
    entries = result.all()

    def _safe_decrypt(content: str) -> str:
        try:
            return decrypt_text(content, settings.ENCRYPTION_KEY)
        except Exception:
            return content

    return [
        JournalEntryResponse(
            id=str(e.id),
            user_id=str(e.user_id),
            encrypted_content=_safe_decrypt(e.encrypted_content),
            mood_tag=e.mood_tag,
            title=e.title,
            created_at=e.created_at,
        )
        for e in entries
    ]


@router.get("/entry/{journal_id}")
async def get_journal_entry(
    journal_id: uuid.UUID,
    user_id: str = Query(...),
    session: AsyncSession = Depends(get_session),
) -> JournalEntryResponse:
    statement = select(JournalEntry).where(
        JournalEntry.id == journal_id,
        JournalEntry.user_id == user_id,
    )
    result = await session.exec(statement)
    entry: JournalEntry | None = result.first()

    if entry is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Journal entry not found")

    def _safe_decrypt(content: str) -> str:
        try:
            return decrypt_text(content, settings.ENCRYPTION_KEY)
        except Exception:
            return content

    return JournalEntryResponse(
        id=str(entry.id),
        user_id=str(entry.user_id),
        encrypted_content=_safe_decrypt(entry.encrypted_content),
        mood_tag=entry.mood_tag,
        title=entry.title,
        created_at=entry.created_at,
    )
