"""Drop FK constraints on user_id - Clerk is source of truth

Revision ID: b1c2d3e4f5a6
Revises: a2a53f46e6e6
Create Date: 2026-08-24 16:21:00.000000

"""
from typing import Sequence, Union

from alembic import op


revision: str = 'b1c2d3e4f5a6'
down_revision: Union[str, Sequence[str], None] = 'a2a53f46e6e6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint('action_logs_user_id_fkey', 'action_logs', type_='foreignkey')
    op.drop_constraint('ai_memories_user_id_fkey', 'ai_memories', type_='foreignkey')
    op.drop_constraint('chat_messages_user_id_fkey', 'chat_messages', type_='foreignkey')
    op.drop_constraint('journal_entries_user_id_fkey', 'journal_entries', type_='foreignkey')
    op.drop_constraint('waitlist_user_id_fkey', 'waitlist', type_='foreignkey')


def downgrade() -> None:
    pass
