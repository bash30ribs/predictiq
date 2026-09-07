"""Prediction creation and history endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.prediction import (
    PredictionHistoryItem,
    PredictionHistoryResponse,
    PredictionRequest,
    PredictionResponse,
)
from app.services.ml_service import (
    InvalidPredictionResultError,
    MLServiceUnavailableError,
)
from app.services.prediction_service import (
    PredictionPersistenceError,
    PredictionService,
    get_prediction_service,
)


router = APIRouter(tags=["predictions"])


@router.post("/predict", response_model=PredictionResponse)
def create_prediction(
    request: PredictionRequest,
    db: Annotated[Session, Depends(get_db)],
    service: Annotated[PredictionService, Depends(get_prediction_service)],
) -> PredictionResponse:
    """Generate a prediction through the ML boundary and log the result."""
    try:
        result = service.predict_and_log(db=db, features=request.features)
    except MLServiceUnavailableError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
    except InvalidPredictionResultError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc
    except PredictionPersistenceError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The prediction could not be stored.",
        ) from exc

    return PredictionResponse(
        prediction=result.prediction,
        confidence=result.confidence,
    )


@router.get("/predictions", response_model=PredictionHistoryResponse)
def list_predictions(
    db: Annotated[Session, Depends(get_db)],
    service: Annotated[PredictionService, Depends(get_prediction_service)],
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
) -> PredictionHistoryResponse:
    """Return prediction history in reverse chronological order."""
    try:
        records, total = service.list_predictions(
            db=db,
            page=page,
            page_size=page_size,
        )
    except PredictionPersistenceError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Prediction history is currently unavailable.",
        ) from exc

    pages = (total + page_size - 1) // page_size
    return PredictionHistoryResponse(
        items=[PredictionHistoryItem.model_validate(record) for record in records],
        total=total,
        page=page,
        page_size=page_size,
        pages=pages,
    )
