import asyncio
import os
import uuid
from pathlib import Path
from typing import Any

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings
from app.core.http_client import get_http_client
from app.utils.text_chunker import chunk_text

KNOWLEDGE_DIR: Path = Path(__file__).parent.parent.parent.parent / "knowledge"
EMBEDDING_TIMEOUT: float = 30.0
EMBED_BATCH_SIZE: int = 5


async def _embed_texts(texts: list[str], settings: Settings) -> list[list[float]]:
    url: str = (
        f"https://generativelanguage.googleapis.com/v1beta/"
        f"{settings.EMBEDDING_MODEL_NAME}:batchEmbedContents"
        f"?key={settings.LLM_API_KEY}"
    )
    requests_payload: list[dict] = [
        {"model": settings.EMBEDDING_MODEL_NAME, "content": {"parts": [{"text": t}]}}
        for t in texts
    ]
    payload: dict = {"requests": requests_payload}

    client = get_http_client()
    response = await client.post(url, json=payload, timeout=EMBEDDING_TIMEOUT)
    response.raise_for_status()
    data: dict = response.json()
    embeddings: list[list[float]] = [
        item["values"] for item in data.get("embeddings", [])
    ]
    return embeddings


async def _embed_single(text_content: str, settings: Settings) -> list[float]:
    url: str = (
        f"https://generativelanguage.googleapis.com/v1beta/"
        f"{settings.EMBEDDING_MODEL_NAME}:embedContent"
        f"?key={settings.LLM_API_KEY}"
    )
    payload: dict = {
        "model": settings.EMBEDDING_MODEL_NAME,
        "content": {"parts": [{"text": text_content}]},
    }
    client = get_http_client()
    response = await client.post(url, json=payload, timeout=EMBEDDING_TIMEOUT)
    response.raise_for_status()
    data: dict = response.json()
    return data["embedding"]["values"]


async def ingest_knowledge_base(session: AsyncSession, settings: Settings) -> dict[str, Any]:
    if not settings.LLM_API_KEY:
        return {"status": "error", "message": "LLM_API_KEY not configured"}

    await session.execute(text("DELETE FROM knowledge_chunks"))
    await session.commit()

    total_chunks: int = 0
    ingested_docs: list[str] = []
    errors: list[str] = []

    import itertools
    for filepath in itertools.chain(KNOWLEDGE_DIR.rglob("*.md"), KNOWLEDGE_DIR.rglob("*.txt")):
        filename = filepath.name
        source_doc: str = filepath.stem
        category: str = filepath.parent.name

        try:
            raw_text: str = filepath.read_text(encoding="utf-8")
            chunks: list[str] = chunk_text(raw_text, min_tokens=100, max_tokens=400, overlap=40)

            for i in range(0, len(chunks), EMBED_BATCH_SIZE):
                batch: list[str] = chunks[i : i + EMBED_BATCH_SIZE]
                try:
                    embeddings: list[list[float]] = await _embed_texts(batch, settings)
                except Exception:
                    embeddings = []
                    for chunk in batch:
                        try:
                            emb = await _embed_single(chunk, settings)
                            embeddings.append(emb)
                        except Exception as e:
                            errors.append(f"{filename} chunk {i}: {e}")
                            embeddings.append([])

                for chunk_text_content, embedding in zip(batch, embeddings):
                    if not embedding:
                        continue
                    # Truncate to 768 dimensions to match pgvector(768) schema (Matryoshka supported)
                    truncated_embedding = embedding[:768]
                    vector_str: str = "[" + ",".join(str(v) for v in truncated_embedding) + "]"
                    chunk_id: uuid.UUID = uuid.uuid4()
                    await session.execute(
                        text(
                            "INSERT INTO knowledge_chunks "
                            "(id, source_doc, category, chunk_text, embedding, created_at) "
                            "VALUES (:id, :source_doc, :category, :chunk_text, CAST(:embedding AS vector), NOW())"
                        ),
                        {
                            "id": str(chunk_id),
                            "source_doc": source_doc,
                            "category": category,
                            "chunk_text": chunk_text_content,
                            "embedding": vector_str,
                        },
                    )
                    total_chunks += 1

                await session.commit()
                await asyncio.sleep(0.5)

            ingested_docs.append(source_doc)

        except Exception as e:
            errors.append(f"{filename}: {e}")

    return {
        "status": "success",
        "total_chunks_ingested": total_chunks,
        "documents_ingested": ingested_docs,
        "errors": errors,
    }


async def retrieve_relevant_chunks(
    query: str,
    session: AsyncSession,
    settings: Settings,
    top_k: int | None = None,
    category_filter: str | None = None,
) -> list[str]:
    if not settings.LLM_API_KEY:
        return []

    effective_top_k: int = top_k if top_k is not None else settings.RAG_TOP_K

    try:
        query_embedding: list[float] = await _embed_single(query, settings)
    except Exception:
        return []

    # Truncate query embedding to 768 to match pgvector(768) schema
    truncated_query = query_embedding[:768]
    vector_str: str = "[" + ",".join(str(v) for v in truncated_query) + "]"

    if category_filter:
        sql = text(
            "SELECT chunk_text FROM knowledge_chunks "
            "WHERE category = :category "
            "ORDER BY embedding <=> CAST(:embedding AS vector) "
            "LIMIT :top_k"
        )
        params: dict = {
            "embedding": vector_str,
            "top_k": effective_top_k,
            "category": category_filter,
        }
    else:
        sql = text(
            "SELECT chunk_text FROM knowledge_chunks "
            "ORDER BY embedding <=> CAST(:embedding AS vector) "
            "LIMIT :top_k"
        )
        params = {"embedding": vector_str, "top_k": effective_top_k}

    result = await session.execute(sql, params)
    rows = result.fetchall()
    return [row[0] for row in rows]


async def get_knowledge_stats(session: AsyncSession) -> dict[str, Any]:
    result = await session.execute(
        text("SELECT category, COUNT(*) as count FROM knowledge_chunks GROUP BY category ORDER BY count DESC")
    )
    rows = result.fetchall()
    total_result = await session.execute(text("SELECT COUNT(*) FROM knowledge_chunks"))
    total: int = total_result.scalar() or 0
    return {
        "total_chunks": total,
        "by_category": {row[0]: row[1] for row in rows},
    }
