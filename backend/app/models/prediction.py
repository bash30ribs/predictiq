"""Stored prediction model."""

from datetime import datetime
from typing import Any

from sqlalchemy import CheckConstraint, DateTime, Float, Index, Integer, JSON, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Prediction(Base):
    """A prediction generated for one submitted feature map."""

    __tablename__ = "predictions"
    __table_args__ = (
        CheckConstraint(
            "confidence >= 0.0 AND confidence <= 1.0",
            name="ck_predictions_confidence",
        ),
        Index("ix_predictions_created_at", "created_at"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    input_features: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    prediction: Mapped[Any] = mapped_column(JSON, nullable=False)
    confidence: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

