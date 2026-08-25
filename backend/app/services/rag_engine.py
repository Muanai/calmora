from collections.abc import AsyncGenerator

import httpx

from app.core.config import Settings

FALLBACK_MESSAGE: str = (
    "Kamu tidak sendirian. Saat ini, fokuslah pada napasmu. "
    "Tarik napas dalam 4 detik, tahan 4 detik, hembuskan 4 detik. "
    "Jika kamu merasa dalam bahaya, hubungi hotline 119 ext 8."
)

LLM_TIMEOUT_SECONDS: float = 30.0
HISTORY_CONTEXT_LIMIT: int = 20


async def stream_chat_response(
    user_message: str,
    intensity_level: str,
    settings: Settings,
    chat_history: list[dict] | None = None,
    ai_memories: list[str] | None = None,
    user_bio: str | None = None,
) -> AsyncGenerator[str, None]:
    import json

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
        "Kamu adalah Calmora, pendamping kesehatan mental yang hangat dan tenang. "
        "Gunakan bahasa sehari-hari, hindari istilah klinis. "
        "Fokus pada teknik grounding dan validasi emosional. "
        "PENTING: Gunakan teks biasa TANPA format markdown (seperti **, *, #). "
        "Pisahkan ide dengan paragraf baru atau dash (-) biasa. "
        f"Level intensitas distres pengguna: {intensity_level}."
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

    yield ": ping\r\n\r\n"

    accumulated_text: str = ""

    try:
        async with httpx.AsyncClient(timeout=LLM_TIMEOUT_SECONDS) as client:
            async with client.stream("POST", url, json=payload) as response:
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
