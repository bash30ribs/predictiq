"""Tests for prediction creation and history."""

from typing import Any, Mapping

from fastapi.testclient import TestClient

from app.services.ml_service import MLPrediction, MLService
from app.services.prediction_service import PredictionService, get_prediction_service


class FixedPredictor:
    """Small deterministic Member 1 stand-in used only by tests."""

    def predict(self, features: Mapping[str, Any]) -> MLPrediction:
        assert features["tenure_months"] == 3
        return MLPrediction(prediction="will_churn", confidence=0.87)


def test_create_prediction_and_read_history(client: TestClient) -> None:
    service = PredictionService(MLService(predictor=FixedPredictor()))
    client.app.dependency_overrides[get_prediction_service] = lambda: service

    prediction_response = client.post(
        "/api/predict",
        json={"features": {"tenure_months": 3, "plan": "basic"}},
    )

    assert prediction_response.status_code == 200
    assert prediction_response.json() == {
        "prediction": "will_churn",
        "confidence": 0.87,
    }

    history_response = client.get("/api/predictions?page=1&page_size=10")

    assert history_response.status_code == 200
    history = history_response.json()
    assert history["total"] == 1
    assert history["pages"] == 1
    assert history["items"][0]["input_features"]["plan"] == "basic"
    assert history["items"][0]["prediction"] == "will_churn"


def test_prediction_rejects_empty_feature_map(client: TestClient) -> None:
    response = client.post("/api/predict", json={"features": {}})

    assert response.status_code == 422


def test_prediction_is_unavailable_without_model(client: TestClient) -> None:
    client.app.dependency_overrides[get_prediction_service] = lambda: PredictionService(
        MLService()
    )

    response = client.post(
        "/api/predict",
        json={"features": {"tenure_months": 3}},
    )

    assert response.status_code == 503
    assert "not been configured" in response.json()["detail"]
