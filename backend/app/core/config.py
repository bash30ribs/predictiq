"""Environment-backed application settings."""

from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Required runtime configuration loaded from environment variables."""

    app_name: str
    app_env: str
    database_url: str
    dataset_storage_dir: Path = Path("data/uploads")
    max_dataset_size_bytes: int = Field(default=50 * 1024 * 1024, gt=0)

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    """Return one validated settings instance per process."""
    return Settings()
