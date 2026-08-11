import uuid
from datetime import date, datetime

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import and_, func, select

from app.models.action_log import ActionLog
from app.models.user import User

POINT_MAP: dict[str, int] = {
    "quick_calm": 10,
    "journal": 20,
    "micro_step_lv1": 30,
    "micro_step_lv2": 40,
    "micro_step_lv3": 50,
}

DAILY_LIMIT: dict[str, int] = {
    "quick_calm": 3,
    "journal": 2,
    "micro_step_lv1": 1,
    "micro_step_lv2": 1,
    "micro_step_lv3": 1,
}

ELIGIBILITY_THRESHOLD: int = 150


async def _get_daily_count(session: AsyncSession, user_id: uuid.UUID, action_type: str) -> int:
    today_start = datetime.combine(date.today(), datetime.min.time())
    statement = select(func.count()).where(
        and_(
            ActionLog.user_id == user_id,
            ActionLog.action_type == action_type,
            ActionLog.completed == True,
            ActionLog.logged_at >= today_start,
        )
    )
    result = await session.exec(statement)
    return result.one()


async def process_action(session: AsyncSession, action_log: ActionLog) -> None:
    if not action_log.completed:
        return

    points: int = POINT_MAP.get(action_log.action_type, 0)
    if points == 0:
        return

    daily_limit: int = DAILY_LIMIT.get(action_log.action_type, 0)
    daily_count: int = await _get_daily_count(session, action_log.user_id, action_log.action_type)

    if daily_count > daily_limit:
        return

    statement = select(User).where(User.id == action_log.user_id)
    result = await session.exec(statement)
    user: User | None = result.first()

    if user is None or user.account_type != "free":
        return

    user.shadow_points += points

    if user.shadow_points >= ELIGIBILITY_THRESHOLD and not user.eligible_for_optin:
        user.eligible_for_optin = True

    session.add(user)
    await session.commit()
