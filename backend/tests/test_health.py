"""Tests for service status routes."""

from fastapi.testclient import TestClient


def test_health(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_root_identifies_service(client: TestClient) -> None:
    response = client.get("/")

    assert response.status_code == 200
    assert "PredictIQ" in response.json()["message"]

