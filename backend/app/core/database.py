from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, AsyncEngine, create_async_engine
from sqlmodel.ext.asyncio.session import AsyncSession as SQLModelAsyncSession

from app.core.config import Settings

_engine: AsyncEngine | None = None


def get_engine() -> AsyncEngine:
    global _engine
    if _engine is None:
        settings: Settings = Settings()
        _engine = create_async_engine(settings.DATABASE_URL, echo=False)
    return _engine


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with SQLModelAsyncSession(get_engine()) as session:
        yield session
