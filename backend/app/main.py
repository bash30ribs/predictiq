"""FastAPI application entry point."""

from fastapi import FastAPI

from app.api.router import api_router
from app.api.routes.system import router as system_router
from app.core.config import get_settings


def create_app() -> FastAPI:
    """Create and configure the PredictIQ FastAPI application."""
    settings = get_settings()
    application = FastAPI(
        title=settings.app_name,
        description="Backend integration service for PredictIQ.",
        version="0.1.0",
    )
    application.include_router(system_router)
    application.include_router(api_router)
    return application


app = create_app()

