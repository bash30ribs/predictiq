"""Tests for the Member 1 integration boundary."""

from typing import Any, Mapping

import pytest

from app.services.ml_service import (
    InvalidPredictionResultError,
    MLPrediction,
    MLService,
)


class InvalidConfidencePredictor:
    def predict(self, features: Mapping[str, Any]) -> MLPrediction:
        return MLPrediction(prediction="result", confidence=1.2)


class NonJsonPredictor:
    def predict(self, features: Mapping[str, Any]) -> MLPrediction:
        return MLPrediction(prediction=object(), confidence=0.9)  # type: ignore[arg-type]


def test_ml_service_rejects_invalid_confidence() -> None:
    service = MLService(predictor=InvalidConfidencePredictor())

    with pytest.raises(InvalidPredictionResultError, match="between 0.0 and 1.0"):
        service.predict({"value": 1})


def test_ml_service_rejects_non_json_prediction() -> None:
    service = MLService(predictor=NonJsonPredictor())

    with pytest.raises(InvalidPredictionResultError, match="JSON-compatible"):
        service.predict({"value": 1})
