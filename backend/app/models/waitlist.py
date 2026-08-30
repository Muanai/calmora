from app.utils.timezone import get_wib_time
import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel


class Waitlist(SQLModel, table=True):
    __tablename__ = "waitlist"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: str = Field(unique=True, index=True)
    shadow_points: int = Field(default=0, index=True)
    enrolled_at: datetime = Field(default_factory=get_wib_time)
