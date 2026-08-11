import uuid

from fastapi import APIRouter, BackgroundTasks, Depends
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.models.action_log import ActionLog
from app.services.shadow_point import process_action

router = APIRouter(prefix="/api/v1/actions", tags=["actions"])


class GroundingRequest(BaseModel):
    user_id: uuid.UUID
    action_type: str
    duration_seconds: int = Field(ge=0, le=3600)
    completed: bool


async def _process_in_background(user_id: uuid.UUID, action_type: str, duration_seconds: int, completed: bool) -> None:
    from app.core.database import get_session

    async for session in get_session():
        action_log = ActionLog(
            user_id=user_id,
            action_type=action_type,
            duration_seconds=duration_seconds,
            completed=completed,
        )
        session.add(action_log)
        await session.commit()
        await process_action(session, action_log)


@router.post("/grounding")
async def log_grounding(request: GroundingRequest, background_tasks: BackgroundTasks) -> dict[str, str]:
    background_tasks.add_task(
        _process_in_background,
        user_id=request.user_id,
        action_type=request.action_type,
        duration_seconds=request.duration_seconds,
        completed=request.completed,
    )
    return {
        "status": "success",
        "message": "Action logged successfully and points accumulated in backend.",
    }
