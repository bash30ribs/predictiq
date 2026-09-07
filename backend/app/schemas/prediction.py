"""Prediction API schemas."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, JsonValue


class PredictionRequest(BaseModel):
    """Model-independent feature input."""

    features: dict[str, JsonValue] = Field(min_length=1)


class PredictionResponse(BaseModel):
    """Prediction and normalized confidence returned to the dashboard."""

    prediction: JsonValue
    confidence: float = Field(ge=0.0, le=1.0)


class PredictionHistoryItem(PredictionResponse):
    """A stored prediction with its inputs and audit metadata."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    input_features: dict[str, JsonValue]
    created_at: datetime


class PredictionHistoryResponse(BaseModel):
    """Paginated prediction history."""

    items: list[PredictionHistoryItem]
    total: int
    page: int
    page_size: int
    pages: int

