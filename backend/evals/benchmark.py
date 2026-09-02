import asyncio
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.orm import sessionmaker
from app.core.config import Settings
from app.core.database import get_engine
from app.services.rag_engine import stream_chat_response
from evals.dataset import EVAL_DATASET
from sqlmodel.ext.asyncio.session import AsyncSession

async def main():
    settings = Settings()
    
    print("\nMemulai Benchmark Latensi Calmora (TTFT & Total Time)")
    print("==============================================================")
    
    # Ambil 5 sampel pertama saja agar cepat
    test_cases = EVAL_DATASET[:5]
    
    ttft_times = []
    total_times = []
    
    async_session = sessionmaker(
        get_engine(), class_=AsyncSession, expire_on_commit=False
    )
    
    for i, case in enumerate(test_cases):
        print(f"Menguji Kasus {i+1}/5: {case['id']}")
        start_time = time.time()
        first_token_time = None
        
        async with async_session() as session:
            # Panggil stream_chat_response secara langsung
            generator = stream_chat_response(
                user_message=case["question"],
                intensity_level="high",
                settings=settings,
                chat_history=[],
                ai_memories=[],
                user_bio=None,
                db_session=session
            )
            
            async for chunk in generator:
                if first_token_time is None and "data: " in chunk and not chunk.startswith("data: {\"text\": \"[DONE]\""):
                    first_token_time = time.time()
            
            end_time = time.time()
            
            # Hitung waktu
            ttft = first_token_time - start_time if first_token_time else 0
            total = end_time - start_time
            
            ttft_times.append(ttft)
            total_times.append(total)
            
            print(f"  ➜ TTFT       : {ttft:.2f} detik")
            print(f"  ➜ Total Waktu: {total:.2f} detik\n")
            
        # Cooldown sedikit agar tidak 429
        await asyncio.sleep(2)
        
    avg_ttft = sum(ttft_times) / len(ttft_times)
    avg_total = sum(total_times) / len(total_times)
    
    print("==============================================================")
    print("HASIL BENCHMARK RATA-RATA (5 Sampel)")
    print("==============================================================")
    print(f"Average Time-To-First-Token (TTFT) : {avg_ttft:.2f} detik")
    print(f"Average Total Response Time        : {avg_total:.2f} detik")
    print("==============================================================")
    
    if avg_ttft <= 1.5:
        print("STATUS: SANGAT BAIK (Di bawah target 1.5 detik)")
    else:
        print("STATUS: PERLU OPTIMASI (Di atas target 1.5 detik)")
        
if __name__ == "__main__":
    asyncio.run(main())
