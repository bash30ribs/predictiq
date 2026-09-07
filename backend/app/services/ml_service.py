"""Stable boundary around Member 1's future prediction implementation."""

from dataclasses import dataclass
from math import isfinite
from typing import Any, Mapping, Protocol

from pydantic import JsonValue, TypeAdapter, ValidationError


_json_value_adapter = TypeAdapter(JsonValue)


class MLServiceUnavailableError(RuntimeError):
    """Raised when no model predictor has been configured."""


class InvalidPredictionResultError(RuntimeError):
    """Raised when a predictor violates the integration contract."""


@dataclass(frozen=True, slots=True)
class MLPrediction:
    """Model-independent result produced by Member 1's adapter."""

    prediction: JsonValue
    confidence: float


class Predictor(Protocol):
    """Interface that the concrete Member 1 adapter must implement."""

    def predict(self, features: Mapping[str, Any]) -> MLPrediction:
        """Return a prediction and a confidence between zero and one."""
        ...


class MLService:
    """Validate calls and results at the ML integration boundary."""

    def __init__(self, predictor: Predictor | None = None) -> None:
        self.predictor = predictor

    def predict(self, features: Mapping[str, Any]) -> MLPrediction:
        if self.predictor is None:
            raise MLServiceUnavailableError(
                "The prediction model has not been configured yet."
            )

        result = self.predictor.predict(features)
        if not isinstance(result, MLPrediction):
            raise InvalidPredictionResultError(
                "The predictor must return an MLPrediction instance."
            )

        confidence = float(result.confidence)
        if not isfinite(confidence) or not 0.0 <= confidence <= 1.0:
            raise InvalidPredictionResultError(
                "The predictor confidence must be between 0.0 and 1.0."
            )

        try:
            prediction = _json_value_adapter.validate_python(result.prediction)
        except ValidationError as exc:
            raise InvalidPredictionResultError(
                "The predictor output must be JSON-compatible."
            ) from exc

        return MLPrediction(
            prediction=prediction,
            confidence=confidence,
        )


_ml_service = MLService()


def get_ml_service() -> MLService:
    """Return the process-wide ML boundary."""
    return _ml_service


def configure_predictor(predictor: Predictor) -> None:
    """Install Member 1's predictor without changing any API route."""
    global _ml_service
    _ml_service = MLService(predictor=predictor)
