from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import delete

from app.models.action_log import ActionLog
from app.models.ai_memory import AiMemory
from app.models.chat_message import ChatMessage
from app.models.journal_entry import JournalEntry
from app.models.user import User
from app.models.waitlist import Waitlist
from app.models.mission_log import MissionLog


async def burn_user_data(session: AsyncSession, user_id: str) -> None:
    await session.exec(delete(ActionLog).where(ActionLog.user_id == user_id))
    await session.exec(delete(JournalEntry).where(JournalEntry.user_id == user_id))
    await session.exec(delete(ChatMessage).where(ChatMessage.user_id == user_id))
    await session.exec(delete(AiMemory).where(AiMemory.user_id == user_id))
    await session.exec(delete(Waitlist).where(Waitlist.user_id == user_id))
    await session.exec(delete(MissionLog).where(MissionLog.user_id == user_id))
    await session.exec(delete(User).where(User.id == user_id))
    await session.commit()
