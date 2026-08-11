import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.core.database import get_session
from app.models.user import User
from app.services.sponsor_distribution import distribute_premium

router = APIRouter(prefix="/api/v1/sponsor", tags=["sponsor"])


class DonateRequest(BaseModel):
    donor_id: uuid.UUID
    amount: int
    premium_months_granted: int


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
    }
