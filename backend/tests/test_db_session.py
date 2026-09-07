"""Tests for database primitives and session lifecycle."""

from unittest.mock import MagicMock

import pytest
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session

import app.db.session as session_module
from app.db.base import Base


def test_database_primitives_import_without_connecting() -> None:
    assert Base.metadata is not None
    assert isinstance(session_module.engine, Engine)


def test_get_db_yields_and_closes_session(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    session = MagicMock(spec=Session)
    monkeypatch.setattr(session_module, "SessionLocal", lambda: session)

    dependency = session_module.get_db()

    assert next(dependency) is session
    with pytest.raises(StopIteration):
        next(dependency)
    session.close.assert_called_once_with()

