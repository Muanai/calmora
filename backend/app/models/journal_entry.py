from app.utils.timezone import get_wib_time
import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel


class JournalEntry(SQLModel, table=True):
    __tablename__ = "journal_entries"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: str = Field(index=True)
    encrypted_content: str
    mood_tag: str | None = Field(default=None, index=True)
    title: str | None = Field(default=None)
    created_at: datetime = Field(default_factory=get_wib_time)

