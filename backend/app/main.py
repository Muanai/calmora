from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlmodel import SQLModel

from app.api import actions, chat, journal, privacy, sponsor
from app.core.database import get_engine
from app.models import chat_message, ai_memory  # noqa: F401 - registers tables


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    async with get_engine().begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield
    await get_engine().dispose()


app: FastAPI = FastAPI(
    title="Calmora API",
    version="1.0.0",
    description="AI-powered mental health companion for Gen-Z anxiety and agoraphobia.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(actions.router)
app.include_router(journal.router)
app.include_router(privacy.router)
app.include_router(sponsor.router)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.status_code,
                "message": exc.detail,
                "details": [],
            }
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": 500,
                "message": "An internal server error occurred.",
                "details": [],
            }
        },
    )


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "calmora-api"}
