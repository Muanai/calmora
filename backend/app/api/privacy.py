import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.utils.crypto_burn import burn_user_data

router = APIRouter(prefix="/api/v1/privacy", tags=["privacy"])


@router.delete("/burn/{user_id}")
async def burn_user(user_id: uuid.UUID, session: AsyncSession = Depends(get_session)) -> dict[str, str]:
    await burn_user_data(session, user_id)
    return {
        "status": "burnt",
        "message": "All traces eradicated successfully.",
    }
