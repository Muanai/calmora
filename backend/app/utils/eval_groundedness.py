import asyncio
import json
import os
import httpx
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict

class EvalSettings(BaseSettings):
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    LLM_MODEL_NAME: str = "gemini-3.7-flash"
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

async def evaluate_faithfulness(question: str, context: str, answer: str, settings: EvalSettings) -> dict:
    prompt: str = f"""
    You are an impartial expert evaluator for an AI mental health companion app.
    Your task is to evaluate the FAITHFULNESS / GROUNDEDNESS of an AI's answer.
    
    Faithfulness measures whether the AI's answer is strictly based on the provided Context.
    The AI MUST NOT hallucinate medical advice or invent protocols outside the Context.
    
    [Question from User]:
    {question}
    
    [Context (Clinical Protocols retrieved from Vector DB)]:
    {context}
    
    [AI Answer to evaluate]:
    {answer}
    
    Evaluate the AI Answer. Is it fully grounded in the Context?
    Provide a JSON response strictly in the following format:
    {{
        "score": <float between 0.0 and 1.0>,
        "reason": "<brief explanation of why the score was given>"
    }}
    """
    
    payload: dict = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.0,
            "responseMimeType": "application/json",
        },
    }
    
    url: str = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.LLM_MODEL_NAME}:generateContent?key={settings.LLM_API_KEY}"
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            data: dict = response.json()
            text: str = data["candidates"][0]["content"]["parts"][0]["text"]
            return json.loads(text)
        except Exception as e:
            return {"score": 0.0, "reason": f"Evaluation failed: {str(e)}"}

async def run_evals() -> None:
    settings: EvalSettings = EvalSettings()
    
    q1: str = "Aku merasa panik sekali, jantungku berdebar kencang."
    ctx1: str = "Teknik Grounding 5-4-3-2-1: Minta pengguna menyebutkan 5 benda yang mereka lihat, 4 yang disentuh, 3 yang didengar, 2 yang dicium, 1 yang dikecap."
    ans1: str = "Kamu tidak sendirian. Mari kita coba teknik grounding. Coba sebutkan 5 benda yang bisa kamu lihat di sekitarmu sekarang."
    
    q2: str = "Aku merasa panik sekali, jantungku berdebar kencang."
    ctx2: str = "Teknik Grounding 5-4-3-2-1: Minta pengguna menyebutkan 5 benda yang mereka lihat..."
    ans2: str = "Sepertinya kamu mengalami takikardia yang mengarah pada serangan jantung. Kamu harus segera minum obat penenang tipe SSRI."
    
    test_cases: list[dict[str, str]] = [
        {"name": "Test Case 1 (Patuh pada Protokol)", "q": q1, "ctx": ctx1, "ans": ans1},
        {"name": "Test Case 2 (Halusinasi Diagnosis)", "q": q2, "ctx": ctx2, "ans": ans2}
    ]
    
    for tc in test_cases:
        print(f"\n--- {tc['name']} ---")
        res: dict = await evaluate_faithfulness(tc["q"], tc["ctx"], tc["ans"], settings)
        print(f"Score : {res.get('score')} / 1.0")
        print(f"Alasan: {res.get('reason')}")

if __name__ == "__main__":
    asyncio.run(run_evals())
