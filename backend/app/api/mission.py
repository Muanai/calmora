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
        "action_type": "micro_step_lv1",
        "senses": {
            "lihat": [
                "Selimut / Sprei",
                "Lampu kamar / Langit-langit",
                "Saklar / Cermin",
                "HP / Charger",
                "Sudut meja / Bantal",
            ],
            "sentuh": [
                "Sentuh tekstur kain selimut/pakaian yang sedang dipakai.",
                "Usap permukaan layar HP-mu yang halus.",
                "Rasakan kelembutan bantal di sekitarmu.",
                "Sentuh telapak tanganmu sendiri dan rasakan kehangatannya.",
            ],
            "dengar": [
                "Suara embusan napasmu sendiri.",
                "Suara deru kipas angin / AC / hembusan angin luar.",
                "Suara musik dari handphone.",
            ],
            "cium": [
                "Aroma kain pakaian atau sarung bantalmu.",
                "Aroma udara segar di sekitarmu.",
            ],
            "rasa": [
                "Air minum.",
            ],
        },
    },
    "Medium": {
        "action_type": "micro_step_lv2",
        "senses": {
            "lihat": [
                "Satu benda di ruangan ini yang memiliki bentuk bundar atau lingkaran.",
                "Dua benda yang warnanya saling berbeda atau kontras.",
                "Detail terkecil dari benda di dekatmu (misal: pola jahitan baju atau serat kayu meja).",
                "Pantulan cahaya atau bayangan benda di lantai/dinding.",
                "Sesuatu yang terbuat dari kayu, logam, atau kaca.",
            ],
            "sentuh": [
                "Gosokkan kedua telapak tanganmu secara perlahan dan rasakan sensasi gesekannya.",
                "Sentuh pergelangan tangan atau lehermu, dan rasakan denyut nadimu.",
                "Raba permukaan benda yang bersuhu lebih dingin dari tubuhmu (seperti tembok, lantai, atau kaca jendela).",
                "Sentuh bagian pakaianmu yang memiliki tekstur kasar atau tidak rata (seperti ritsleting, kancing, atau lipatan kerah).",
            ],
            "dengar": [
                "Suara paling jauh yang bisa kamu tangkap dari luar ruangan (suara kendaraan, burung, atau angin).",
                "Suara paling dekat dari dirimu sendiri (suara gesekan pakaian saat kamu bergerak atau mengatur napas).",
                "Suara ambien yang konstan di ruangan (dengungan pelan AC, kipas, mesin kulkas, atau sekadar suara keheningan).",
            ],
            "cium": [
                "Aroma alami dari kulit di pergelangan tangan atau lenganmu.",
                "Sensasi dan aroma udara saat kamu menarik napas panjang melalui hidung (sadari apakah udaranya terasa dingin, kering, atau lembap).",
            ],
            "rasa": [
                "Jalankan perlahan ujung lidahmu di sepanjang gigi atau bagian atas langit-langit mulut. Sadari teksturnya dan rasakan sensasi alami atau sisa rasa yang ada di dalam mulutmu saat ini.",
            ],
        },
    },
    "Hard": {
        "action_type": "micro_step_lv3",
        "senses": {
            "lihat": [
                "Gorden jendela yang bergoyang atau dedaunan pohon yang bergerak tertiup angin di luar jendela kamarmu.",
                "Perubahan intensitas cahaya alami di langit luar (sadari gumpalan awan yang bergerak lambat atau bayangan sinar matahari yang jatuh di luar ruangan).",
                "Makhluk hidup lain yang sedang beraktivitas (misalnya semut yang merayap di lantai, gema gerakan burung, atau tanaman hijau di pot teras).",
                "Tiga detail tekstur benda yang berada di luar jangkauan kasurmu (misalnya serat kayu pada gagang pintu kamar atau pola anyaman keset lantai).",
                "Warna paling dominan yang bisa kamu tangkap saat kamu melayangkan pandangan langsung ke arah luar jendela kamar.",
            ],
            "sentuh": [
                "Tekan kedua telapak kakimu dengan sangat kuat ke lantai (regangkan jari-jari kakimu, dan rasakan kekuatan tanah atau lantai yang sedang menopang berat tubuhmu sepenuhnya).",
                "Rentangkan kedua lenganmu lebar-lebar ke samping seolah sedang meraih kedua dinding kamar, luruskan gumpalan jari-jarimu, lalu lepaskan perlahan.",
                "Tempelkan telapak tanganmu pada permukaan yang dingin dan kokoh di sudut kamar yang jarang kamu sentuh (seperti kaca jendela yang dingin, tembok beton, atau gagang pintu besi).",
                "Sentuh permukaan lututmu sendiri dengan kedua tangan, lalu remas dengan mantap untuk merasakan kehadiran fisikmu secara utuh di sini.",
            ],
            "dengar": [
                "Suara dinamis dari luar bangunan (seperti deru kendaraan yang melintas di kejauhan, rintik hujan yang menyentuh atap, atau gonggongan anjing/kicauan burung).",
                "Suara langkah kaki atau aktivitas manusia lain di sekitar koridor rumah/kos (menyadari keberadaan koneksi sosial tanpa perlu berinteraksi langsung).",
                "Perbedaan suara ambien saat kamu membuka sedikit jendela atau pintu kamar (rasakan perubahan bising ruangan yang menjadi lebih terbuka).",
            ],
            "cium": [
                "Aroma udara luar yang masuk saat jendela kamarmu dibuka sedikit (rasakan apakah udaranya beraroma lembap tanah, kering hangat, atau segar).",
                "Aroma khas dari luar kamarmu (seperti keharuman sabun cuci dari arah kamar mandi, aroma seduhan kopi hangat dari dapur, atau aroma minyak angin).",
            ],
            "rasa": [
                "Makan sepotong kecil makanan ringan (seperti biskuit renyah atau permen mint dingin). Gigit perlahan, biarkan ia sesaat berada di atas lidahmu, lalu sadari perubahan rasa, suhu, serta gerakan tenggorokanmu saat menelannya secara perlahan.",
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


async def _get_completed_today(session: AsyncSession, user_id: str) -> bool:
    today_start = datetime.combine(date.today(), datetime.min.time())
    statement = select(MissionLog).where(
        and_(
            MissionLog.user_id == user_id,
            MissionLog.completed_at >= today_start,
        )
    )
    result = await session.exec(statement)
    return result.first() is not None


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


@router.get("/today")
async def get_today_missions(
    user_id: str = Query(...),
    session: AsyncSession = Depends(get_session),
) -> MissionResponse:
    level: str = await _get_or_assess_level(session, user_id)
    content: dict = GROUNDING_CONTENT[level]
    is_completed: bool = await _get_completed_today(session, user_id)

    return MissionResponse(
        level=level,
        action_type=content["action_type"],
        senses=content["senses"],
        is_completed=is_completed,
    )


@router.post("/complete", status_code=status.HTTP_200_OK)
async def complete_mission(
    user_id: str = Query(...),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    session: AsyncSession = Depends(get_session),
) -> dict:
    is_completed: bool = await _get_completed_today(session, user_id)
    if is_completed:
        return {"status": "already_completed"}

    level: str = await _get_or_assess_level(session, user_id)
    action_type: str = GROUNDING_CONTENT[level]["action_type"]

    log = MissionLog(user_id=user_id, mission_id=f"grounding_{level.lower()}")
    session.add(log)
    await session.commit()

    background_tasks.add_task(_award_mission_points, user_id=user_id, action_type=action_type)

    return {"status": "success", "level": level}
