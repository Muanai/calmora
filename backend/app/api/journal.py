import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.models.action_log import ActionLog
from app.models.journal_entry import JournalEntry
from app.services.shadow_point import process_action

router = APIRouter(prefix="/api/v1/journal", tags=["journal"])


class JournalRequest(BaseModel):
    user_id: uuid.UUID
    encrypted_content: str
    mood_tag: str | None = None


async def _award_journal_points(user_id: uuid.UUID) -> None:
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


@router.post("/entry", status_code=status.HTTP_201_CREATED)
async def create_journal_entry(
    request: JournalRequest,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session),
) -> dict:
    entry = JournalEntry(
        user_id=request.user_id,
        encrypted_content=request.encrypted_content,
        mood_tag=request.mood_tag,
    )
    session.add(entry)
    await session.commit()
    await session.refresh(entry)

    background_tasks.add_task(_award_journal_points, user_id=request.user_id)

    return {
        "status": "success",
        "journal_id": str(entry.id),
    }
