import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel


class MissionLog(SQLModel, table=True):
    __tablename__ = "mission_logs"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: str = Field(index=True)
    mission_id: str = Field(index=True)
    completed_at: datetime = Field(default_factory=datetime.utcnow)
