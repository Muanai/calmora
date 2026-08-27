from datetime import date, datetime
from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import and_, select

from app.core.database import get_session
from app.core.security import verify_clerk_token
from app.models.action_log import ActionLog
from app.models.mission_log import MissionLog
from app.services.shadow_point import process_action

router = APIRouter(prefix="/api/v1/missions", tags=["missions"])

MISSIONS: list[dict] = [
    {
        "id": "easy_1",
        "level": "Easy",
        "title": "Buka Sedikit Celah Udara",
        "description": "Coba buka tirai atau jendela kamar selebar satu jengkal saja. Biarkan sedikit cahaya baru masuk menyapamu.",
        "time": "2 menit",
        "long_description": "Buka jendela kamarmu selama 2 menit. Rasakan udara luar yang masuk. Kamu tidak perlu pergi ke mana-mana.",
        "warning_text": "Kamu tidak perlu keluar. Cukup di dekat jendela saja, di dalam kamar.",
        "action_type": "micro_step_lv1",
    },
    {
        "id": "medium_1",
        "level": "Medium",
        "title": "Berdiri di Depan Pintu",
        "description": "Coba melangkah pelan mendekati pintu kamarmu.",
        "time": "30 detik",
        "long_description": "Coba berdiri santai di depannya selama 30 detik. Pintunya boleh tetap tertutup atau sedikit terbuka, senyamannya kamu.",
        "warning_text": "Pintu hanya batas saja dan kamu bisa kembali kapan saja.",
        "action_type": "micro_step_lv2",
    },
    {
        "id": "hard_1",
        "level": "Hard",
        "title": "10 Langkah dari Depan Pintu",
        "description": "Coba berjalan sejenak ke luar area kamar tidurmu.",
        "time": "Sesukamu",
        "long_description": "Kamu sudah sangat hebat sampai di titik ini. Yuk, coba buka pintu dan berjalan sejauh 10 langkah dari depan pintu.",
        "warning_text": "Tidak ada yang menghakimi kamu, satu langkah saja sudah luar biasa.",
        "action_type": "micro_step_lv3",
    },
]

MISSION_MAP: dict[str, dict] = {m["id"]: m for m in MISSIONS}


class MissionResponse(BaseModel):
    id: str
    level: str
    title: str
    description: str
    time: str
    long_description: str
    warning_text: str
    is_completed: bool


async def _get_completed_today(session: AsyncSession, user_id: str) -> set[str]:
    today_start = datetime.combine(date.today(), datetime.min.time())
    statement = select(MissionLog.mission_id).where(
        and_(
            MissionLog.user_id == user_id,
            MissionLog.completed_at >= today_start,
        )
    )
    result = await session.exec(statement)
    return set(result.all())


async def _award_mission_points(user_id: str, action_type: str) -> None:
    from app.core.database import get_session

    async for session in get_session():
        action_log = ActionLog(
            user_id=user_id,
            action_type=action_type,
            duration_seconds=0,
            completed=True,
        )
        session.add(action_log)
        await session.commit()
        await process_action(session, action_log)


@router.get("/today")
async def get_today_missions(
    user_id: str = Query(...),
    session: AsyncSession = Depends(get_session),
) -> list[MissionResponse]:
    completed_ids = await _get_completed_today(session, user_id)
    return [
        MissionResponse(
            id=m["id"],
            level=m["level"],
            title=m["title"],
            description=m["description"],
            time=m["time"],
            long_description=m["long_description"],
            warning_text=m["warning_text"],
            is_completed=m["id"] in completed_ids,
        )
        for m in MISSIONS
    ]


@router.post("/{mission_id}/complete", status_code=status.HTTP_200_OK)
async def complete_mission(
    mission_id: str,
    user_id: str = Query(...),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    session: AsyncSession = Depends(get_session),
) -> dict:
    mission = MISSION_MAP.get(mission_id)
    if mission is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mission not found")

    completed_ids = await _get_completed_today(session, user_id)
    if mission_id in completed_ids:
        return {"status": "already_completed"}

    log = MissionLog(user_id=user_id, mission_id=mission_id)
    session.add(log)
    await session.commit()

    background_tasks.add_task(_award_mission_points, user_id=user_id, action_type=mission["action_type"])

    return {"status": "success", "mission_id": mission_id}
