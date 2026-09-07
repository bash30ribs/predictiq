"""Service status endpoints."""

from fastapi import APIRouter

from app.schemas.system import HealthResponse, RootResponse


router = APIRouter(tags=["system"])


@router.get("/", response_model=RootResponse)
def read_root() -> RootResponse:
    """Identify the service and confirm that it is running."""
    return RootResponse(message="PredictIQ backend is running")


@router.get("/health", response_model=HealthResponse)
def read_health() -> HealthResponse:
    """Return a lightweight process health check."""
    return HealthResponse(status="ok")

