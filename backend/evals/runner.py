import asyncio
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import Settings
from app.services.knowledge_ingestion import retrieve_relevant_chunks
from app.services.rag_engine import _stream_chat_response_impl
from evals.dataset import EVAL_DATASET, EvalCase
from evals.metrics import (
    evaluate_answer_relevance,
    evaluate_context_relevance,
    evaluate_faithfulness,
)

CASE_DELAY_SECONDS: float = 4.0

PASS_THRESHOLD: float = 0.7


async def _get_full_ai_response(
    question: str,
    settings: Settings,
    db_session: AsyncSession,
) -> str:
    full_text: str = ""
    async for chunk in _stream_chat_response_impl(
        user_message=question,
        intensity_level="moderate",
        settings=settings,
        db_session=db_session,
    ):
        if chunk.startswith("data: "):
            import json
            try:
                data: dict = json.loads(chunk[6:])
                token: str = data.get("text", "")
                if token and token != "[DONE]":
                    full_text += token
            except Exception:
                pass
    return full_text.strip()


async def _run_single_case(
    case: EvalCase,
    settings: Settings,
    async_session_factory: sessionmaker,
) -> dict:
    case_id: str = case["id"]
    question: str = case["question"]
    expected_topic: str = case["expected_topic"]

    async with async_session_factory() as session:
        print(f"  → [{case_id}] Retrieving context...", flush=True)
        try:
            chunks: list[str] = await retrieve_relevant_chunks(
                query=question,
                session=session,
                settings=settings,
            )
        except Exception as e:
            chunks = []
            print(f"    ⚠ Retrieval error for {case_id}: {e}", flush=True)

        print(f"  → [{case_id}] Generating AI answer ({len(chunks)} chunks retrieved)...", flush=True)
        try:
            answer: str = await _get_full_ai_response(question, settings, session)
        except Exception as e:
            answer = ""
            print(f"    ⚠ Generation error for {case_id}: {e}", flush=True)

    print(f"  → [{case_id}] Running 3 evaluators (sequential to avoid 429)...", flush=True)
    ctx_result = await evaluate_context_relevance(question, chunks, settings.LLM_API_KEY)
    await asyncio.sleep(2.0)
    faith_result = await evaluate_faithfulness(question, chunks, answer, settings.LLM_API_KEY)
    await asyncio.sleep(2.0)
    ans_result = await evaluate_answer_relevance(question, answer, expected_topic, settings.LLM_API_KEY)

    return {
        "id": case_id,
        "category": case["category"],
        "question": question,
        "chunks_retrieved": len(chunks),
        "answer_preview": answer[:200] + "..." if len(answer) > 200 else answer,
        "context_relevance": ctx_result,
        "faithfulness": faith_result,
        "answer_relevance": ans_result,
    }


def _print_report(results: list[dict], elapsed: float) -> str:
    total: int = len(results)

    def avg(metric: str) -> float:
        scores = [r[metric]["score"] for r in results if isinstance(r[metric].get("score"), (int, float))]
        return sum(scores) / len(scores) if scores else 0.0

    def pass_count(metric: str) -> int:
        return sum(1 for r in results if r[metric].get("score", 0) >= PASS_THRESHOLD)

    ctx_avg = avg("context_relevance")
    faith_avg = avg("faithfulness")
    ans_avg = avg("answer_relevance")
    overall = (ctx_avg + faith_avg + ans_avg) / 3

    ctx_pass = pass_count("context_relevance")
    faith_pass = pass_count("faithfulness")
    ans_pass = pass_count("answer_relevance")

    sep = "=" * 62
    lines: list[str] = [
        "",
        sep,
        " CALMORA RAG EVALUATION REPORT",
        sep,
        f" Run At       : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        f" Duration     : {elapsed:.1f}s",
        f" Test Cases   : {total}",
        f" Pass Threshold: >= {PASS_THRESHOLD}",
        f" Judge Model  : gemini-flash-lite-latest",
        "",
        " METRIC SCORES:",
        f"   Context Relevance  : {ctx_avg:.2f}   ({ctx_pass}/{total} passed)",
        f"   Faithfulness       : {faith_avg:.2f}   ({faith_pass}/{total} passed)",
        f"   Answer Relevance   : {ans_avg:.2f}   ({ans_pass}/{total} passed)",
        "",
        f" OVERALL SCORE  : {overall:.2f}",
        "-" * 62,
    ]

    if overall >= PASS_THRESHOLD:
        lines.append(f" ✅ PASS — Sistem RAG Calmora layak untuk pitching")
    else:
        lines.append(f" ❌ FAIL — Sistem perlu perbaikan sebelum pitching")

    lines.append(sep)

    lines += ["", " DETAIL PER TEST CASE:", "-" * 62]
    for r in results:
        cr = r["context_relevance"]
        fa = r["faithfulness"]
        ar = r["answer_relevance"]
        icon = "✅" if all(m.get("score", 0) >= PASS_THRESHOLD for m in [cr, fa, ar]) else "⚠ "
        lines.append(
            f" {icon} [{r['id']}] ({r['category']}) "
            f"CR={cr.get('score', 0):.2f} "
            f"FA={fa.get('score', 0):.2f} "
            f"AR={ar.get('score', 0):.2f} "
            f"chunks={r['chunks_retrieved']}"
        )
        lowest = min([cr, fa, ar], key=lambda m: m.get("score", 0))
        if lowest.get("score", 1) < PASS_THRESHOLD:
            lines.append(f"    ↳ [{lowest['metric']}] {lowest.get('reason', '')}")

    lines += ["", sep, ""]
    report: str = "\n".join(lines)
    print(report)
    return report


async def main() -> None:
    settings: Settings = Settings()

    if not settings.LLM_API_KEY:
        print("ERROR: LLM_API_KEY tidak ditemukan di .env")
        sys.exit(1)

    if not settings.DATABASE_URL:
        print("ERROR: DATABASE_URL tidak ditemukan di .env")
        sys.exit(1)

    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    print(f"\n🔍 Memulai Calmora RAG Evaluation Suite")
    print(f"   Total test cases: {len(EVAL_DATASET)}")
    print(f"   Mode: Sequential (1 case at a time, {CASE_DELAY_SECONDS}s cooldown)\n")

    start: float = asyncio.get_event_loop().time()
    results: list[dict] = []

    for i, case in enumerate(EVAL_DATASET):
        result = await _run_single_case(case, settings, async_session)
        results.append(result)
        if i < len(EVAL_DATASET) - 1:
            print(f"  ⏳ Cooling down {CASE_DELAY_SECONDS}s before next case...\n", flush=True)
            await asyncio.sleep(CASE_DELAY_SECONDS)

    elapsed: float = asyncio.get_event_loop().time() - start
    report: str = _print_report(list(results), elapsed)

    report_path = Path(__file__).parent / "report.md"
    report_path.write_text(f"```\n{report}\n```", encoding="utf-8")
    print(f"📄 Laporan disimpan ke: {report_path}")


if __name__ == "__main__":
    asyncio.run(main())
