"""Dataset upload schemas."""

from typing import Literal
from uuid import UUID

from pydantic import BaseModel


class DatasetUploadResponse(BaseModel):
    """Metadata returned after a dataset is safely stored."""

    dataset_id: UUID
    filename: str
    stored_filename: str
    content_type: str | None
    size_bytes: int
    status: Literal["uploaded"]

