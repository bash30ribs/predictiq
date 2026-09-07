"""Schemas for service status endpoints."""

from typing import Literal

from pydantic import BaseModel


class HealthResponse(BaseModel):
    """Health check response."""

    status: Literal["ok"]


class RootResponse(BaseModel):
    """Root service identification response."""

    message: str

