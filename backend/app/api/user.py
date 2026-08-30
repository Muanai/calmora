from app.utils.timezone import get_wib_time
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.core.database import get_session
from app.models.user import User

router = APIRouter(prefix="/api/v1/user", tags=["user"])


class UserProfileResponse(BaseModel):
    id: str
    email: str
    nama: str | None
    umur: str | None
    agama: str | None
    kondisi: str | None
    asal_daerah: str | None
    jenis_kelamin: str | None


class UserProfileUpdateRequest(BaseModel):
    user_id: str
    nama: str | None = None
    umur: str | None = None
    agama: str | None = None
    kondisi: str | None = None
    asal_daerah: str | None = None
    jenis_kelamin: str | None = None


@router.get("/profile")
async def get_user_profile(
    user_id: str,
    session: AsyncSession = Depends(get_session),
) -> UserProfileResponse:
    result = await session.exec(select(User).where(User.id == user_id))
    record: User | None = result.first()
    if not record:
        return UserProfileResponse(
            id=user_id,
            email="",
            nama=None,
            umur=None,
            agama=None,
            kondisi=None,
            asal_daerah=None,
            jenis_kelamin=None,
        )
    return UserProfileResponse(
        id=record.id,
        email=record.email,
        nama=record.nama,
        umur=record.umur,
        agama=record.agama,
        kondisi=record.kondisi,
        asal_daerah=record.asal_daerah,
        jenis_kelamin=record.jenis_kelamin,
    )


@router.put("/profile")
async def update_user_profile(
    request: UserProfileUpdateRequest,
    session: AsyncSession = Depends(get_session),
) -> dict[str, str]:
    result = await session.exec(select(User).where(User.id == request.user_id))
    record: User | None = result.first()
    if not record:
        record = User(id=request.user_id, email="")
        session.add(record)
    
    if request.nama is not None:
        record.nama = request.nama
    if request.umur is not None:
        record.umur = request.umur
    if request.agama is not None:
        record.agama = request.agama
    if request.kondisi is not None:
        record.kondisi = request.kondisi
    if request.asal_daerah is not None:
        record.asal_daerah = request.asal_daerah
    if request.jenis_kelamin is not None:
        record.jenis_kelamin = request.jenis_kelamin
        
    record.updated_at = get_wib_time()
    session.add(record)
    await session.commit()
    return {"status": "updated"}
