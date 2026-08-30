import uuid
from enum import Enum

from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel, Field

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
) -> ActionStatsResponse:
    from app.core.database import get_session
    from sqlmodel import select, and_
    
    total_missions = 0
    total_activities = 0
    
    async for session in get_session():
        statement = select(ActionLog).where(
            and_(ActionLog.user_id == user_id, ActionLog.completed == True)
        )
        result = await session.exec(statement)
        logs = result.all()
        
        for log in logs:
            if log.action_type.startswith("mission_"):
                total_missions += 1
            else:
                total_activities += 1
                
        return ActionStatsResponse(
            total_missions=total_missions,
            total_activities=total_activities,
        )
