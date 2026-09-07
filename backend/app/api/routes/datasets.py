"""Dataset upload endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.schemas.dataset import DatasetUploadResponse
from app.services.dataset_service import (
    DatasetService,
    DatasetStorageError,
    InvalidDatasetError,
    get_dataset_service,
)


router = APIRouter(prefix="/datasets", tags=["datasets"])


@router.post(
    "",
    response_model=DatasetUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
def upload_dataset(
    file: Annotated[UploadFile, File(description="Raw dataset file")],
    service: Annotated[DatasetService, Depends(get_dataset_service)],
) -> DatasetUploadResponse:
    """Validate and store a raw dataset for later ML consumption."""
    try:
        result = service.save(
            source=file.file,
            filename=file.filename,
            content_type=file.content_type,
        )
    except InvalidDatasetError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    except DatasetStorageError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="The dataset could not be stored.",
        ) from exc

    return DatasetUploadResponse(
        dataset_id=result.dataset_id,
        filename=result.filename,
        stored_filename=result.stored_filename,
        content_type=result.content_type,
        size_bytes=result.size_bytes,
        status="uploaded",
    )

