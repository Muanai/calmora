import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    __tablename__ = "users"

    # Clerk User ID (e.g., "user_2xyz...")
    id: str = Field(primary_key=True)
    email: str = Field(index=True, unique=True)
    
    # Metadata disinkronkan dari Clerk
    nama: str | None = Field(default=None)
    umur: str | None = Field(default=None)
    agama: str | None = Field(default=None)
    kondisi: str | None = Field(default=None)
    asal_daerah: str | None = Field(default=None)
    jenis_kelamin: str | None = Field(default=None)

    # Calmora App Data
    shadow_points: int = Field(default=0)
    account_type: str = Field(default="free")
    eligible_for_optin: bool = Field(default=False)
    sponsored_by: str | None = Field(default=None)
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
