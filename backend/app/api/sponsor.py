import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.core.database import get_session
from app.models.user import User
from app.models.waitlist import Waitlist
from app.services.sponsor_distribution import distribute_premium

router = APIRouter(prefix="/api/v1/sponsor", tags=["sponsor"])


class DonateRequest(BaseModel):
    donor_id: uuid.UUID
    amount: int
    premium_months_granted: int


class OptInRequest(BaseModel):
    user_id: uuid.UUID
    choice: str


@router.post("/donate")
async def donate(request: DonateRequest, session: AsyncSession = Depends(get_session)) -> dict:
    sponsored_user_id: uuid.UUID | None = await distribute_premium(
        session=session,
        donor_id=request.donor_id,
        amount=request.amount,
        premium_months_granted=request.premium_months_granted,
    )

    if sponsored_user_id is None:
        return {"status": "success", "sponsored_user_id": None}

    return {"status": "success", "sponsored_user_id": str(sponsored_user_id)}


@router.post("/optin")
async def empathic_optin(request: OptInRequest, session: AsyncSession = Depends(get_session)) -> dict:
    statement = select(User).where(User.id == request.user_id)
    result = await session.exec(statement)
    user: User | None = result.first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    if not user.eligible_for_optin:
        raise HTTPException(status_code=403, detail="User is not eligible for opt-in")

    if request.choice == "join_waitlist":
        waitlist_statement = select(Waitlist).where(Waitlist.user_id == user.id)
        waitlist_result = await session.exec(waitlist_statement)
        existing: Waitlist | None = waitlist_result.first()

        if existing is None:
            entry = Waitlist(user_id=user.id, shadow_points=user.shadow_points)
            session.add(entry)

        user.eligible_for_optin = False
        session.add(user)
        await session.commit()
        return {"status": "success", "action": "added_to_waitlist"}

    if request.choice == "self_subscribe":
        user.eligible_for_optin = False
        session.add(user)
        await session.commit()
        return {"status": "success", "action": "redirect_to_payment"}

    raise HTTPException(status_code=400, detail="Invalid choice. Must be 'join_waitlist' or 'self_subscribe'")


@router.get("/status/{user_id}")
async def sponsor_status(user_id: uuid.UUID, session: AsyncSession = Depends(get_session)) -> dict:
    statement = select(User).where(User.id == user_id)
    result = await session.exec(statement)
    user: User | None = result.first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "account_type": user.account_type,
        "sponsored_by": user.sponsored_by,
        "eligible_for_optin": user.eligible_for_optin,
    }
