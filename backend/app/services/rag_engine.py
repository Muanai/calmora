from collections.abc import AsyncGenerator

import httpx

from app.core.config import Settings

FALLBACK_MESSAGE: str = (
    "Kamu tidak sendirian. Saat ini, fokuslah pada napasmu. "
    "Tarik napas dalam 4 detik, tahan 4 detik, hembuskan 4 detik. "
    "Jika kamu merasa dalam bahaya, hubungi hotline 119 ext 8."
)

LLM_TIMEOUT_SECONDS: float = 3.0


async def stream_chat_response(
    user_message: str,
    intensity_level: str,
    settings: Settings,
) -> AsyncGenerator[str, None]:
    system_prompt: str = (
        "Kamu adalah Calmora, pendamping kesehatan mental yang hangat dan tenang. "
        "Gunakan bahasa sehari-hari, hindari istilah klinis. "
        "Fokus pada teknik grounding dan validasi emosional. "
        "PENTING: Gunakan teks biasa TANPA format markdown (seperti **, *, #). "
        "Pisahkan ide dengan paragraf baru atau dash (-) biasa. "
        f"Level intensitas distres pengguna: {intensity_level}."
    )

    payload: dict = {
        "contents": [
            {"role": "user", "parts": [{"text": f"{system_prompt}\n\nUser: {user_message}"}]}
        ],
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

    import json

    yield ": ping\r\n\r\n"

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
                                    text_json: str = json.dumps({"text": text})
                                    yield f"data: {text_json}\r\n\r\n"
        yield "data: [DONE]\r\n\r\n"
    except (httpx.TimeoutException, httpx.HTTPError) as e:
        print(f"LLM API Error: {e}")
        fallback_json: str = json.dumps({"text": FALLBACK_MESSAGE})
        yield f"data: {fallback_json}\r\n\r\n"
        yield "data: [DONE]\r\n\r\n"
