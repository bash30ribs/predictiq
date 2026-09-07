"""Tests for environment-backed configuration."""

from pathlib import Path

import pytest
from pydantic import ValidationError

from app.core.config import Settings


def test_settings_load_from_environment(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("APP_NAME", "PredictIQ Environment API")
    monkeypatch.setenv("APP_ENV", "testing")
    monkeypatch.setenv(
        "DATABASE_URL",
        "postgresql+psycopg://tester:secret@db.example.test:5432/predictiq",
    )
    monkeypatch.setenv("DATASET_STORAGE_DIR", "test-data/uploads")
    monkeypatch.setenv("MAX_DATASET_SIZE_BYTES", "2048")

    settings = Settings(_env_file=None)

    assert settings.app_name == "PredictIQ Environment API"
    assert settings.app_env == "testing"
    assert settings.database_url.endswith(":5432/predictiq")
    assert settings.dataset_storage_dir == Path("test-data/uploads")
    assert settings.max_dataset_size_bytes == 2048


def test_missing_required_environment_fails(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.delenv("APP_NAME", raising=False)
    monkeypatch.delenv("APP_ENV", raising=False)
    monkeypatch.delenv("DATABASE_URL", raising=False)

    with pytest.raises(ValidationError):
        Settings(_env_file=None)
