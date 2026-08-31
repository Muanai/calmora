from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings
from app.core.database import get_session
from app.services.knowledge_ingestion import ingest_knowledge_base, get_knowledge_stats

router = APIRouter(prefix="/api/v1/knowledge", tags=["knowledge"])


def _verify_admin_key(x_admin_key: str = Header(...)) -> None:
    settings: Settings = Settings()
    if not settings.ADMIN_API_KEY or x_admin_key != settings.ADMIN_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or missing admin API key.",
        )


@router.post("/ingest", dependencies=[Depends(_verify_admin_key)])
async def trigger_ingestion(
    session: AsyncSession = Depends(get_session),
) -> dict:
    settings: Settings = Settings()
    result: dict = await ingest_knowledge_base(session=session, settings=settings)
    return result


@router.get("/stats", dependencies=[Depends(_verify_admin_key)])
async def knowledge_stats(
    session: AsyncSession = Depends(get_session),
) -> dict:
    return await get_knowledge_stats(session=session)
