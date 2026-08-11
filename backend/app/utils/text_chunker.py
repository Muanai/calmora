def chunk_text(text: str, min_tokens: int = 300, max_tokens: int = 500, overlap: int = 50) -> list[str]:
    words: list[str] = text.split()
    chunks: list[str] = []
    start: int = 0

    while start < len(words):
        end: int = start + max_tokens
        chunk: list[str] = words[start:end]

        if len(chunk) < min_tokens and chunks:
            chunks[-1] = chunks[-1] + " " + " ".join(chunk)
            break

        chunks.append(" ".join(chunk))
        start = end - overlap

    return chunks
