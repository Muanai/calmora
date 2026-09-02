from collections.abc import AsyncGenerator

import httpx
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings
from app.core.http_client import get_http_client

FALLBACK_MESSAGE: str = (
    "Kamu tidak sendirian. Saat ini, fokuslah pada napasmu. "
    "Tarik napas dalam 4 detik, tahan 4 detik, hembuskan 4 detik. "
    "Jika kamu merasa dalam bahaya, hubungi hotline 119 ext 8."
)

LLM_TIMEOUT_SECONDS: float = 30.0
HISTORY_CONTEXT_LIMIT: int = 20


def stream_chat_response(
    user_message: str,
    intensity_level: str,
    settings: Settings,
    chat_history: list[dict] | None = None,
    ai_memories: list[str] | None = None,
    user_bio: str | None = None,
    db_session: AsyncSession | None = None,
) -> AsyncGenerator[str, None]:
    return _stream_chat_response_impl(
        user_message=user_message,
        intensity_level=intensity_level,
        settings=settings,
        chat_history=chat_history,
        ai_memories=ai_memories,
        user_bio=user_bio,
        db_session=db_session,
    )


async def _stream_chat_response_impl(
    user_message: str,
    intensity_level: str,
    settings: Settings,
    chat_history: list[dict] | None = None,
    ai_memories: list[str] | None = None,
    user_bio: str | None = None,
    db_session: AsyncSession | None = None,
) -> AsyncGenerator[str, None]:
    import json

    rag_context_block: str = ""
    if db_session is not None:
        try:
            from app.services.knowledge_ingestion import retrieve_relevant_chunks
            chunks: list[str] = await retrieve_relevant_chunks(
                query=user_message,
                session=db_session,
                settings=settings,
            )
            if chunks:
                formatted_chunks: str = "\n\n---\n\n".join(chunks)
                rag_context_block = (
                    f"\n\n=== PANDUAN KLINIS CALMORA (GUNAKAN SEBAGAI ACUAN UTAMA) ===\n"
                    f"{formatted_chunks}\n"
                    f"=== AKHIR PANDUAN KLINIS ==="
                )
        except Exception:
            pass

    memories_block: str = ""
    if ai_memories:
        formatted: str = "\n".join(f"- {m}" for m in ai_memories)
        memories_block = (
            f"\n\nKonteks yang kamu pelajari sendiri tentang pengguna ini:\n{formatted}"
        )

    bio_block: str = ""
    if user_bio and user_bio.strip():
        bio_block = (
            f"\n\nInformasi yang ditulis sendiri oleh pengguna tentang dirinya:\n{user_bio.strip()}"
        )

    system_prompt: str = (
        "Kamu adalah Calmora, pendamping kesehatan mental yang hangat dan tenang untuk Gen-Z Indonesia. "
        "Kamu dilatih khusus untuk mendampingi pengguna dengan kecemasan dan agorafobia. "
        "Gunakan bahasa sehari-hari yang natural, hindari istilah klinis berlebihan. "
        "Fokus pada teknik grounding berbasis evidence dan validasi emosional yang tulus. "
        "PENTING: Gunakan teks biasa TANPA format markdown (seperti **, *, #). "
        "DILARANG KERAS menyertakan catatan internal, proses berpikir, atau teks seperti '(Catatan: ...)' di dalam balasanmu. "
        "Balas langsung ke pengguna sebagai pendamping yang peduli. "
        "Pisahkan ide dengan paragraf baru atau dash (-) biasa. "
        "BACA BAIK-BAIK KONTEKS PERTANYAAN: Jika pengguna bertanya tentang cara membantu ORANG LAIN yang sedang kesulitan, "
        "berikan panduan bagaimana cara mendampingi orang tersebut — JANGAN memberikan teknik relaksasi untuk diri pengguna sendiri. "
        "DILARANG KERAS: (1) Menyebutkan atau menyiratkan diagnosis psikiatri spesifik apapun kepada pengguna. "
        "(2) Menyebutkan, merekomendasikan, atau menyarankan nama obat atau suplemen apapun. "
        "(3) Membuat klaim medis yang tidak ada dalam panduan klinis yang diberikan. "
        f"Level intensitas distres pengguna saat ini: {intensity_level}."
        f"{rag_context_block}"
        f"{bio_block}"
        f"{memories_block}"
    )

    history: list[dict] = chat_history[-HISTORY_CONTEXT_LIMIT:] if chat_history else []

    contents: list[dict] = []
    for turn in history:
        gemini_role: str = "model" if turn["role"] in ("ai", "model") else "user"
        contents.append({"role": gemini_role, "parts": [{"text": turn["content"]}]})

    contents.append({"role": "user", "parts": [{"text": f"{system_prompt}\n\nUser: {user_message}"}]})

    payload: dict = {
        "contents": contents,
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 1024,
        },
    }

    url: str = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{settings.LLM_MODEL_NAME}:streamGenerateContent"
        f"?alt=sse&key={settings.LLM_API_KEY}"
    )

    accumulated_text: str = ""

    try:
        client = get_http_client()
        async with client.stream("POST", url, json=payload, timeout=LLM_TIMEOUT_SECONDS) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    chunk_data: dict = json.loads(line[6:])
                    candidates: list = chunk_data.get("candidates", [])
                    for candidate in candidates:
                        parts: list = candidate.get("content", {}).get("parts", [])
                        for part in parts:
                            text: str = part.get("text", "")
                            if text:
                                accumulated_text += text
                                text_json: str = json.dumps({"text": text})
                                yield f"data: {text_json}\r\n\r\n"
        final_json: str = json.dumps({"text": "[DONE]", "full_response": accumulated_text})
        yield f"data: {final_json}\r\n\r\n"
    except (httpx.TimeoutException, httpx.HTTPError) as e:
        print(f"LLM API Error: {e}")
        fallback_json: str = json.dumps({"text": FALLBACK_MESSAGE, "full_response": FALLBACK_MESSAGE})
        yield f"data: {fallback_json}\r\n\r\n"
        yield f"data: {json.dumps({'text': '[DONE]', 'full_response': ''})}\r\n\r\n"
