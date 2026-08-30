from app.utils.timezone import get_wib_time
import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel


class AiMemory(SQLModel, table=True):
    __tablename__ = "ai_memories"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: str = Field(index=True)
    memory_text: str
    source: str = Field(default="ai_generated")
    created_at: datetime = Field(default_factory=get_wib_time)
