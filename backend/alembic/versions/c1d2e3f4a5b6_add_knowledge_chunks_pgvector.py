"""add_knowledge_chunks_pgvector

Revision ID: c1d2e3f4a5b6
Revises: 6b62e0b0b88d
Create Date: 2026-08-31

"""
from alembic import op
import sqlalchemy as sa

revision = "c1d2e3f4a5b6"
down_revision = "6b62e0b0b88d"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    op.create_table(
        "knowledge_chunks",
        sa.Column("id", sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("source_doc", sa.String(), nullable=False, index=True),
        sa.Column("category", sa.String(), nullable=False, index=True),
        sa.Column("chunk_text", sa.Text(), nullable=False),
        sa.Column("embedding", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.execute(
        "ALTER TABLE knowledge_chunks ALTER COLUMN embedding TYPE vector(768) USING NULL::vector(768)"
    )

    op.execute(
        "CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_idx "
        "ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10)"
    )


def downgrade() -> None:
    op.drop_table("knowledge_chunks")
