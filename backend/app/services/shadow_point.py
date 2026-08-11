import uuid

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.action_log import ActionLog
from app.models.user import User
from app.models.waitlist import Waitlist

POINT_MAP: dict[str, int] = {
    "54321_grounding": 20,
    "box_breathing": 10,
    "micro_step": 50,
}

ELIGIBILITY_THRESHOLD: int = 100


async def process_action(session: AsyncSession, action_log: ActionLog) -> None:
    if not action_log.completed:
        return

    points: int = POINT_MAP.get(action_log.action_type, 0)
    if points == 0:
        return

    statement = select(User).where(User.id == action_log.user_id)
    result = await session.exec(statement)
    user: User | None = result.first()

    if user is None:
        return

    user.shadow_points += points
    session.add(user)

    if user.shadow_points >= ELIGIBILITY_THRESHOLD:
        waitlist_statement = select(Waitlist).where(Waitlist.user_id == user.id)
        waitlist_result = await session.exec(waitlist_statement)
        existing: Waitlist | None = waitlist_result.first()

        if existing is None:
            entry = Waitlist(user_id=user.id, shadow_points=user.shadow_points)
            session.add(entry)
        else:
            existing.shadow_points = user.shadow_points
            session.add(existing)

    await session.commit()
