"""add_missing_fields_user_bio_title

Revision ID: d2e3f4a5b6c7
Revises: c1d2e3f4a5b6
Create Date: 2026-08-31

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel

revision = "d2e3f4a5b6c7"
down_revision = "c1d2e3f4a5b6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute('ALTER TABLE users ADD COLUMN IF NOT EXISTS user_bio VARCHAR')
    op.execute('ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS title VARCHAR')


def downgrade() -> None:
    op.execute('ALTER TABLE journal_entries DROP COLUMN IF EXISTS title')
    op.execute('ALTER TABLE users DROP COLUMN IF EXISTS user_bio')
