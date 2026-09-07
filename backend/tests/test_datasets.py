"""Tests for raw dataset uploads."""

from pathlib import Path

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.services.dataset_service import DatasetService, get_dataset_service


def test_upload_dataset_stores_raw_file(
    client: TestClient,
    tmp_path: Path,
) -> None:
    service = DatasetService(storage_dir=tmp_path, max_size_bytes=1024)
    app = client.app
    assert isinstance(app, FastAPI)
    app.dependency_overrides[get_dataset_service] = lambda: service

    response = client.post(
        "/api/datasets",
        files={"file": ("sales.csv", b"month,sales\nJan,100\n", "text/csv")},
    )

    assert response.status_code == 201
    body = response.json()
    assert body["filename"] == "sales.csv"
    assert body["status"] == "uploaded"
    assert body["size_bytes"] == 20
    assert (tmp_path / body["stored_filename"]).read_bytes() == b"month,sales\nJan,100\n"


def test_upload_dataset_rejects_unsupported_type(
    client: TestClient,
    tmp_path: Path,
) -> None:
    service = DatasetService(storage_dir=tmp_path, max_size_bytes=1024)
    client.app.dependency_overrides[get_dataset_service] = lambda: service

    response = client.post(
        "/api/datasets",
        files={"file": ("notes.txt", b"not a dataset", "text/plain")},
    )

    assert response.status_code == 400
    assert "Unsupported dataset type" in response.json()["detail"]

