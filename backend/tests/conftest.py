"""Shared pytest fixtures for the PredictIQ API."""

import os
from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

# Supply isolated test configuration before importing modules that build the app
# and SQLAlchemy engine. Creating the engine does not open a database connection.
os.environ.setdefault("APP_NAME", "PredictIQ Test API")
os.environ.setdefault("APP_ENV", "test")
os.environ.setdefault(
    "DATABASE_URL",
    "postgresql+psycopg://test:test@localhost:5432/predictiq_test",
)

from app.db.base import Base  # noqa: E402
from app.db.session import get_db  # noqa: E402
from app.main import app  # noqa: E402
from app.models.prediction import Prediction  # noqa: E402, F401


@pytest.fixture
def test_db_session() -> Generator[Session, None, None]:
    """Return an isolated in-memory SQLite session."""
    test_engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=test_engine)
    testing_session = sessionmaker(
        bind=test_engine,
        autoflush=False,
        expire_on_commit=False,
    )
    session = testing_session()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=test_engine)
        test_engine.dispose()


@pytest.fixture
def client(test_db_session: Session) -> Generator[TestClient, None, None]:
    """Return a test client with the database dependency isolated."""

    def override_get_db() -> Generator[Session, None, None]:
        yield test_db_session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
