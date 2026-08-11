import uuid

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.user import User
from app.models.waitlist import Waitlist


async def distribute_premium(session: AsyncSession, donor_id: uuid.UUID, amount: int, premium_months_granted: int) -> uuid.UUID | None:
    statement = (
        select(Waitlist)
        .order_by(Waitlist.shadow_points.desc())
        .with_for_update(skip_locked=True)
        .limit(1)
    )
    result = await session.exec(statement)
    top_entry: Waitlist | None = result.first()

    if top_entry is None:
        return None

    user_statement = select(User).where(User.id == top_entry.user_id)
    user_result = await session.exec(user_statement)
    user: User | None = user_result.first()

    if user is None:
        return None

    user.account_type = "premium"
    user.shadow_points = 0
    user.sponsored_by = "anonymous"
    session.add(user)

    await session.delete(top_entry)
    await session.commit()

    return user.id
