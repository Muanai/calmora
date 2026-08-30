import uuid
from enum import Enum

from fastapi import APIRouter, BackgroundTasks, Depends
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.models.action_log import ActionLog
from app.services.shadow_point import process_action

router = APIRouter(prefix="/api/v1/actions", tags=["actions"])


class ActionType(str, Enum):
    quick_calm = "quick_calm"
    mission_journal = "mission_journal"
    mission_open_window = "mission_open_window"
    mission_stand_at_door = "mission_stand_at_door"
    mission_10_steps_outside = "mission_10_steps_outside"


class GroundingRequest(BaseModel):
    user_id: str
    action_type: ActionType
    duration_seconds: int = Field(ge=0, le=3600)
    completed: bool


async def _process_in_background(user_id: str, action_type: str, duration_seconds: int, completed: bool) -> None:
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
        action_type=request.action_type.value,
        duration_seconds=request.duration_seconds,
        completed=request.completed,
    )
    return {
        "status": "success",
        "message": "Action logged successfully and points accumulated in backend.",
    }


class ActionStatsResponse(BaseModel):
    total_missions: int
    total_activities: int


@router.get("/stats")
async def get_action_stats(
    user_id: str,
    session: AsyncSession = Depends(get_session),
) -> ActionStatsResponse:
    from app.models.mission_log import MissionLog
    from sqlmodel import select, func

    total_stmt = select(func.count()).where(MissionLog.user_id == user_id)
    total_result = await session.exec(total_stmt)
    total_all: int = total_result.one()

    activity_stmt = select(func.count()).where(
        MissionLog.user_id == user_id,
        MissionLog.mission_id.startswith("grounding_"),
    )
    activity_result = await session.exec(activity_stmt)
    total_activities: int = activity_result.one()

    total_missions: int = total_all - total_activities

    return ActionStatsResponse(
        total_missions=total_missions,
        total_activities=total_activities,
    )
