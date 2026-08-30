from datetime import date, datetime

from fastapi import APIRouter, BackgroundTasks, Depends, Query, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import and_, desc, select

from app.core.database import get_session
from app.models.action_log import ActionLog
from app.models.journal_entry import JournalEntry
from app.models.mission_log import MissionLog
from app.models.user import User
from app.services.shadow_point import process_action

router = APIRouter(prefix="/api/v1/missions", tags=["missions"])

LEVEL_ORDER: list[str] = ["Easy", "Medium", "Hard"]

MOOD_LEVEL_DELTA: dict[str, int] = {
    "happy": 1,
    "angry": 0,
    "sad": -1,
    "panic": -1,
}

GROUNDING_CONTENT: dict[str, dict] = {
    "Easy": {
        "action_type": "quick_calm",
        "senses": {
            "lihat": [
                "Selimut atau sprei kasur.",
                "Lampu kamar atau langit-langit.",
                "Saklar lampu atau cermin.",
                "Handphone atau kabel charger.",
                "Sudut meja atau bantal.",
            ],
            "sentuh": [
                "Tekstur kain pakaian yang sedang kamu pakai.",
                "Permukaan layar HP-mu yang halus.",
                "Kelembutan bantal di sekitarmu.",
                "Telapak tanganmu sendiri dan rasakan kehangatannya.",
            ],
            "dengar": [
                "Suara embusan napasmu sendiri.",
                "Suara deru kipas, AC, atau hembusan angin.",
                "Suara lamat dari luar kamarmu.",
            ],
            "cium": [
                "Aroma kain pakaian atau sarung bantalmu.",
                "Aroma udara segar di sekitarmu.",
            ],
            "rasa": [
                "Sensasi segar dari seteguk air minum.",
            ],
        },
    },
    "Medium": {
        "action_type": "quick_calm",
        "senses": {
            "lihat": [
                "Benda di ruangan ini yang memiliki bentuk bundar.",
                "Dua benda dengan warna yang saling kontras.",
                "Detail terkecil dari benda di dekatmu (pola atau serat).",
                "Pantulan cahaya atau bayangan benda di lantai/dinding.",
                "Sesuatu yang terbuat dari kayu, logam, atau kaca.",
            ],
            "sentuh": [
                "Gosokan perlahan antara kedua telapak tanganmu.",
                "Denyut nadi di pergelangan tangan atau lehermu.",
                "Permukaan benda yang bersuhu lebih dingin dari tubuhmu.",
                "Bagian pakaianmu yang memiliki tekstur kasar atau lipatan.",
            ],
            "dengar": [
                "Suara paling jauh yang bisa kamu tangkap dari luar.",
                "Suara paling dekat dari gesekan pakaian atau napasmu.",
                "Suara ambien yang konstan di ruangan (dengungan mesin/keheningan).",
            ],
            "cium": [
                "Aroma alami dari kulit pergelangan tanganmu.",
                "Sensasi udara di hidung saat menarik napas panjang.",
            ],
            "rasa": [
                "Tekstur gigi atau langit-langit mulut menggunakan ujung lidah.",
            ],
        },
    },
    "Hard": {
        "action_type": "quick_calm",
        "senses": {
            "lihat": [
                "Gorden atau dedaunan yang bergoyang di luar jendela.",
                "Perubahan intensitas cahaya alami atau awan di langit.",
                "Makhluk hidup lain yang sedang beraktivitas di sekitar.",
                "Detail tekstur benda yang berada di luar jangkauan kasurmu.",
                "Warna paling dominan di luar jendela kamarmu.",
            ],
            "sentuh": [
                "Tekanan kuat dan mantap dari kedua telapak kakimu di lantai.",
                "Rentangan kedua lenganmu lebar-lebar ke arah dinding.",
                "Permukaan dingin dan kokoh di sudut kamar yang jarang disentuh.",
                "Permukaan lututmu sendiri yang diremas mantap dengan tangan.",
            ],
            "dengar": [
                "Suara dinamis dari luar bangunan (kendaraan/hujan/burung).",
                "Suara langkah kaki atau aktivitas manusia di koridor.",
                "Perbedaan bising saat jendela atau pintu kamar dibuka sedikit.",
            ],
            "cium": [
                "Aroma udara luar yang masuk saat jendela dibuka sedikit.",
                "Aroma khas dari luar kamarmu (kamar mandi atau dapur).",
            ],
            "rasa": [
                "Perubahan rasa dan suhu saat mengunyah sepotong makanan ringan.",
            ],
        },
    },
}


def _compute_new_level(current_level: str, mood_tag: str | None) -> str:
    delta: int = MOOD_LEVEL_DELTA.get(mood_tag or "", 0)
    current_index: int = LEVEL_ORDER.index(current_level)
    new_index: int = max(0, min(len(LEVEL_ORDER) - 1, current_index + delta))
    return LEVEL_ORDER[new_index]


async def _get_last_journal_mood(session: AsyncSession, user_id: str) -> str | None:
    statement = (
        select(JournalEntry.mood_tag)
        .where(JournalEntry.user_id == user_id)
        .order_by(desc(JournalEntry.created_at))
        .limit(1)
    )
    result = await session.exec(statement)
    return result.first()


async def _get_or_assess_level(session: AsyncSession, user_id: str) -> str:
    statement = select(User).where(User.id == user_id)
    result = await session.exec(statement)
    user: User | None = result.first()

    if user is None:
        return "Easy"

    today: date = date.today()
    if user.grounding_level_assessed_date == today:
        return user.grounding_level

    last_mood: str | None = await _get_last_journal_mood(session, user_id)
    new_level: str = _compute_new_level(user.grounding_level, last_mood)

    user.grounding_level = new_level
    user.grounding_level_assessed_date = today
    session.add(user)
    await session.commit()

    return new_level


async def _get_grounding_completed_today(session: AsyncSession, user_id: str) -> bool:
    today_start = datetime.combine(date.today(), datetime.min.time())
    statement = select(MissionLog).where(
        and_(
            MissionLog.user_id == user_id,
            MissionLog.mission_id.startswith("grounding_"),
            MissionLog.completed_at >= today_start,
        )
    )
    result = await session.exec(statement)
    return result.first() is not None


async def _get_journal_completed_today(session: AsyncSession, user_id: str) -> bool:
    today_start = datetime.combine(date.today(), datetime.min.time())
    statement = select(MissionLog).where(
        and_(
            MissionLog.user_id == user_id,
            MissionLog.mission_id == "mission_journal",
            MissionLog.completed_at >= today_start,
        )
    )
    result = await session.exec(statement)
    return result.first() is not None


async def _get_completed_micro_steps_today(session: AsyncSession, user_id: str) -> list[str]:
    today_start = datetime.combine(date.today(), datetime.min.time())
    statement = select(MissionLog.mission_id).where(
        and_(
            MissionLog.user_id == user_id,
            MissionLog.mission_id.in_(["micro_step_lv1", "micro_step_lv2", "micro_step_lv3"]),
            MissionLog.completed_at >= today_start,
        )
    )
    result = await session.exec(statement)
    return list(result.all())


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


class MissionResponse(BaseModel):
    level: str
    action_type: str
    senses: dict[str, list[str]]
    is_completed: bool
    is_journal_completed: bool
    completed_micro_steps: list[str]


@router.get("/today")
async def get_today_missions(
    user_id: str = Query(...),
    session: AsyncSession = Depends(get_session),
) -> MissionResponse:
    level: str = await _get_or_assess_level(session, user_id)
    content: dict = GROUNDING_CONTENT[level]
    is_completed: bool = await _get_grounding_completed_today(session, user_id)
    is_journal_completed: bool = await _get_journal_completed_today(session, user_id)
    completed_micro_steps: list[str] = await _get_completed_micro_steps_today(session, user_id)

    return MissionResponse(
        level=level,
        action_type=content["action_type"],
        senses=content["senses"],
        is_completed=is_completed,
        is_journal_completed=is_journal_completed,
        completed_micro_steps=completed_micro_steps,
    )


@router.post("/complete", status_code=status.HTTP_200_OK)
async def complete_mission(
    user_id: str = Query(...),
    action_type: str | None = Query(default=None),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    session: AsyncSession = Depends(get_session),
) -> dict:
    if action_type == "mission_journal":
        if await _get_journal_completed_today(session, user_id):
            return {"status": "already_completed"}
        
        log = MissionLog(user_id=user_id, mission_id="mission_journal")
        session.add(log)
        await session.commit()
        background_tasks.add_task(_award_mission_points, user_id=user_id, action_type="mission_journal")
        return {"status": "success", "level": "Jurnal"}

    elif action_type == "quick_calm":
        # Allow multiple grounding completions per day to keep updating stats
        is_completed: bool = await _get_grounding_completed_today(session, user_id)

        level: str = await _get_or_assess_level(session, user_id)

        log = MissionLog(user_id=user_id, mission_id=f"grounding_{level.lower()}")
        session.add(log)
        await session.commit()

        background_tasks.add_task(_award_mission_points, user_id=user_id, action_type="quick_calm")
        return {"status": "success", "level": level}

    elif action_type in ["micro_step_lv1", "micro_step_lv2", "micro_step_lv3"]:
        completed_micro_steps = await _get_completed_micro_steps_today(session, user_id)
        if action_type in completed_micro_steps:
            return {"status": "already_completed"}

        log = MissionLog(user_id=user_id, mission_id=action_type)
        session.add(log)
        await session.commit()

        background_tasks.add_task(_award_mission_points, user_id=user_id, action_type=action_type)
        return {"status": "success", "action_type": action_type}

    return {"status": "error", "message": "Unknown action type"}
