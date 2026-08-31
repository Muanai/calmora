import uuid
from datetime import datetime
from typing import Optional, List

from sqlalchemy import Column, Text
from sqlmodel import Field, SQLModel

from app.utils.timezone import get_wib_time


class KnowledgeChunk(SQLModel, table=True):
    __tablename__ = "knowledge_chunks"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    source_doc: str = Field(index=True)
    category: str = Field(index=True)
    chunk_text: str = Field(sa_column=Column(Text, nullable=False))
    created_at: datetime = Field(default_factory=get_wib_time)
