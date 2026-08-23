import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel


class ChatMessage(SQLModel, table=True):
    __tablename__ = "chat_messages"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    role: str = Field(index=True)
    encrypted_content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
