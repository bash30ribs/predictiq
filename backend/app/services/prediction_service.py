"""Prediction orchestration and persistence."""

from typing import Any, Mapping

from sqlalchemy import func, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.prediction import Prediction
from app.services.ml_service import MLPrediction, MLService, get_ml_service


class PredictionPersistenceError(RuntimeError):
    """Raised when prediction persistence is unavailable."""


class PredictionService:
    """Coordinate prediction calls without exposing ML details to routes."""

    def __init__(self, ml_service: MLService) -> None:
        self.ml_service = ml_service

    def predict_and_log(
        self,
        db: Session,
        features: Mapping[str, Any],
    ) -> MLPrediction:
        result = self.ml_service.predict(features)
        record = Prediction(
            input_features=dict(features),
            prediction=result.prediction,
            confidence=result.confidence,
        )

        try:
            db.add(record)
            db.commit()
        except SQLAlchemyError as exc:
            db.rollback()
            raise PredictionPersistenceError from exc

        return result

    def list_predictions(
        self,
        db: Session,
        page: int,
        page_size: int,
    ) -> tuple[list[Prediction], int]:
        try:
            total = db.scalar(select(func.count()).select_from(Prediction)) or 0
            records = list(
                db.scalars(
                    select(Prediction)
                    .order_by(Prediction.created_at.desc(), Prediction.id.desc())
                    .offset((page - 1) * page_size)
                    .limit(page_size)
                ).all()
            )
        except SQLAlchemyError as exc:
            raise PredictionPersistenceError from exc

        return records, total


def get_prediction_service() -> PredictionService:
    """Create an orchestrator around the currently configured ML service."""
    return PredictionService(ml_service=get_ml_service())

