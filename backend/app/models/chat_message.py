from app.utils.timezone import get_wib_time
import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel


class ChatMessage(SQLModel, table=True):
    __tablename__ = "chat_messages"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: str = Field(index=True)
    role: str = Field(index=True)
    encrypted_content: str
    created_at: datetime = Field(default_factory=get_wib_time)
