import uuid

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import delete

from app.models.action_log import ActionLog
from app.models.journal_entry import JournalEntry
from app.models.user import User
from app.models.waitlist import Waitlist


async def burn_user_data(session: AsyncSession, user_id: uuid.UUID) -> None:
    await session.exec(delete(ActionLog).where(ActionLog.user_id == user_id))
    await session.exec(delete(JournalEntry).where(JournalEntry.user_id == user_id))
    await session.exec(delete(Waitlist).where(Waitlist.user_id == user_id))
    await session.exec(delete(User).where(User.id == user_id))
    await session.commit()
