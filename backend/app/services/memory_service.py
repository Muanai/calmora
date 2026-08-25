import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.core.config import Settings
from app.models.ai_memory import AiMemory

MEMORY_EXTRACTION_PROMPT_TEMPLATE: str = (
    "Kamu adalah sistem manajemen memori konteks. Baca respons AI berikut dari percakapan kesehatan mental.\n\n"
    "MEMORI YANG SUDAH ADA:\n{existing_memories}\n\n"
    "RESPONS AI BARU:\n{ai_response}\n\n"
    "TUGAS:\n"
    "1. Tentukan apakah respons ini mengandung informasi BARU & PENTING tentang pengguna "
    "(kondisi, nama, situasi hidup, ketakutan, preferensi hobi/hiburan, atau pola emosi).\n"
    "2. Jika informasi SUDAH ADA atau REDUNDAN dengan memori yang ada -> balas HANYA: SKIP\n"
    "3. Jika informasi MEMPERBARUI memori yang sudah ada -> balas HANYA: UPDATE:<id_memori>:<teks_memori_baru_singkat>\n"
    "4. Jika informasi BENAR-BENAR BARU -> tulis ringkasan 1 kalimat singkat dalam Bahasa Indonesia.\n\n"
    "PENTING: Jangan duplikasi informasi yang sudah ada. Jadilah hemat penyimpanan."
)

MEMORY_EXTRACTION_PROMPT_NO_EXISTING: str = (
    "Kamu adalah sistem manajemen memori konteks. Baca respons AI berikut dari percakapan kesehatan mental.\n\n"
    "RESPONS AI BARU:\n{ai_response}\n\n"
    "TUGAS:\n"
    "Tentukan apakah respons ini mengandung informasi PENTING tentang pengguna "
    "(kondisi, nama, situasi hidup, ketakutan, preferensi hobi/hiburan, atau pola emosi).\n"
    "Jika YA -> tulis ringkasan 1 kalimat singkat dalam Bahasa Indonesia.\n"
    "Jika TIDAK -> balas HANYA: SKIP"
)

MEMORY_LIMIT_PER_USER: int = 30
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

    count_result = await session.execute(
        select(AiMemory).where(AiMemory.user_id == user_id).order_by(AiMemory.created_at)
    )
    existing: list[AiMemory] = list(count_result.scalars().all())

    if existing:
        existing_block: str = "\n".join(
            f"[{m.id}] {m.memory_text}" for m in existing
        )
        prompt: str = MEMORY_EXTRACTION_PROMPT_TEMPLATE.format(
            existing_memories=existing_block,
            ai_response=ai_response,
        )
    else:
        prompt = MEMORY_EXTRACTION_PROMPT_NO_EXISTING.format(ai_response=ai_response)

    payload: dict = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.1,
            "maxOutputTokens": 200,
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
            llm_output: str = (
                candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "").strip()
            )
            if not llm_output or llm_output.upper() == "SKIP":
                return

            if llm_output.upper().startswith("UPDATE:"):
                parts: list[str] = llm_output.split(":", 2)
                if len(parts) == 3:
                    target_id_str: str = parts[1].strip()
                    new_text: str = parts[2].strip()
                    import uuid as uuid_module
                    try:
                        target_id = uuid_module.UUID(target_id_str)
                        for m in existing:
                            if m.id == target_id:
                                m.memory_text = new_text
                                session.add(m)
                                await session.commit()
                                return
                    except (ValueError, AttributeError):
                        pass
                return

            if len(existing) >= MEMORY_LIMIT_PER_USER:
                oldest: AiMemory = min(existing, key=lambda m: m.created_at)
                await session.delete(oldest)

            new_memory: AiMemory = AiMemory(
                user_id=user_id,
                memory_text=llm_output,
                source="ai_generated",
            )
            session.add(new_memory)
            await session.commit()
    except Exception as e:
        import traceback
        print(f"Memory extraction failed: {e}")
        traceback.print_exc()
        return
