"""Create predictions table.

Revision ID: 20260907_01
Revises: None
Create Date: 2026-09-07
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "20260907_01"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "predictions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("input_features", sa.JSON(), nullable=False),
        sa.Column("prediction", sa.JSON(), nullable=False),
        sa.Column("confidence", sa.Float(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.CheckConstraint(
            "confidence >= 0.0 AND confidence <= 1.0",
            name="ck_predictions_confidence",
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_predictions_created_at",
        "predictions",
        ["created_at"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_predictions_created_at", table_name="predictions")
    op.drop_table("predictions")
