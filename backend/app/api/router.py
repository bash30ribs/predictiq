"""Router for application integration endpoints."""

from fastapi import APIRouter

from app.api.routes.datasets import router as datasets_router
from app.api.routes.predictions import router as predictions_router


api_router = APIRouter(prefix="/api")
api_router.include_router(datasets_router)
api_router.include_router(predictions_router)

