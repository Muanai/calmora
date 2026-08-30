from app.utils.timezone import get_wib_time
import uuid
from datetime import date, datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: str = Field(primary_key=True)
    email: str = Field(index=True, unique=True)

    nama: str | None = Field(default=None)
    umur: str | None = Field(default=None)
    agama: str | None = Field(default=None)
    kondisi: str | None = Field(default=None)
    asal_daerah: str | None = Field(default=None)
    jenis_kelamin: str | None = Field(default=None)

    shadow_points: int = Field(default=0)
    account_type: str = Field(default="free")
    eligible_for_optin: bool = Field(default=False)
    sponsored_by: str | None = Field(default=None)
    user_bio: str | None = Field(default=None)

    grounding_level: str = Field(default="Easy")
    grounding_level_assessed_date: Optional[date] = Field(default=None)

    created_at: datetime = Field(default_factory=get_wib_time)
    updated_at: datetime = Field(default_factory=get_wib_time)
