import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.core.config import Settings
from app.models.ai_memory import AiMemory

MEMORY_EXTRACTION_PROMPT_TEMPLATE: str = (
    "Kamu adalah sistem analisis konteks. Baca respons AI berikut dari percakapan kesehatan mental.\n"
    "Tugas: Tentukan apakah respons ini mengandung informasi penting tentang pengguna yang perlu diingat "
    "untuk percakapan mendatang (misalnya: kondisi spesifik, nama, situasi hidup, ketakutan, atau pola emosi).\n"
    "Jika YA, tulis ringkasan konteks dalam 1-2 kalimat singkat dalam Bahasa Indonesia.\n"
    "Jika TIDAK ada yang perlu diingat, balas hanya dengan kata: SKIP\n\n"
    "Respons AI:\n{ai_response}"
)

MEMORY_LIMIT_PER_USER: int = 50
LLM_MEMORY_TIMEOUT_SECONDS: float = 10.0


async def extract_and_save_memories(
    session: AsyncSession,
    user_id: str,
    ai_response: str,
    settings: Settings,
) -> None:
    import json

    if not ai_response.strip() or not settings.LLM_API_KEY:
        return

    prompt: str = MEMORY_EXTRACTION_PROMPT_TEMPLATE.format(ai_response=ai_response)

    payload: dict = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 128,
        },
    }

    url: str = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{settings.LLM_MODEL_NAME}:generateContent"
        f"?key={settings.LLM_API_KEY}"
    )

    try:
        async with httpx.AsyncClient(timeout=LLM_MEMORY_TIMEOUT_SECONDS) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            data: dict = response.json()
            candidates: list = data.get("candidates", [])
            if not candidates:
                return
            memory_text: str = (
                candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "").strip()
            )
            if not memory_text or memory_text.upper() == "SKIP":
                return

            count_result = await session.exec(
                select(AiMemory).where(AiMemory.user_id == user_id)
            )
            existing: list[AiMemory] = list(count_result.all())

            if len(existing) >= MEMORY_LIMIT_PER_USER:
                oldest: AiMemory = min(existing, key=lambda m: m.created_at)
                await session.delete(oldest)

            new_memory: AiMemory = AiMemory(
                user_id=user_id,
                memory_text=memory_text,
                source="ai_generated",
            )
            session.add(new_memory)
            await session.commit()
    except (httpx.TimeoutException, httpx.HTTPError, json.JSONDecodeError, KeyError):
        return
