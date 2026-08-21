import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel


class ActionLog(SQLModel, table=True):
    __tablename__ = "action_logs"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    action_type: str = Field(index=True)
    duration_seconds: int
    completed: bool = Field(default=False)
    logged_at: datetime = Field(default_factory=datetime.utcnow)
