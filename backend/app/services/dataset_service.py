"""Raw dataset validation and local storage."""

from dataclasses import dataclass
from pathlib import Path
from typing import BinaryIO
from uuid import UUID, uuid4

from app.core.config import get_settings


ALLOWED_DATASET_SUFFIXES = frozenset({".csv", ".json", ".parquet", ".xls", ".xlsx"})
COPY_CHUNK_SIZE = 1024 * 1024


class InvalidDatasetError(ValueError):
    """Raised when an uploaded dataset violates the API contract."""


class DatasetStorageError(RuntimeError):
    """Raised when a valid dataset cannot be persisted."""


@dataclass(frozen=True, slots=True)
class StoredDataset:
    """Metadata for a stored raw dataset."""

    dataset_id: UUID
    filename: str
    stored_filename: str
    content_type: str | None
    size_bytes: int


class DatasetService:
    """Store raw datasets without parsing or invoking training logic."""

    def __init__(self, storage_dir: Path, max_size_bytes: int) -> None:
        self.storage_dir = storage_dir
        self.max_size_bytes = max_size_bytes

    def save(
        self,
        source: BinaryIO,
        filename: str | None,
        content_type: str | None,
    ) -> StoredDataset:
        safe_filename = Path(filename or "").name
        if not safe_filename:
            raise InvalidDatasetError("A dataset filename is required.")

        suffix = Path(safe_filename).suffix.lower()
        if suffix not in ALLOWED_DATASET_SUFFIXES:
            allowed = ", ".join(sorted(ALLOWED_DATASET_SUFFIXES))
            raise InvalidDatasetError(f"Unsupported dataset type. Allowed: {allowed}.")

        dataset_id = uuid4()
        stored_filename = f"{dataset_id}{suffix}"
        destination = self.storage_dir / stored_filename
        size_bytes = 0

        try:
            self.storage_dir.mkdir(parents=True, exist_ok=True)
            with destination.open("xb") as output:
                while chunk := source.read(COPY_CHUNK_SIZE):
                    size_bytes += len(chunk)
                    if size_bytes > self.max_size_bytes:
                        raise InvalidDatasetError(
                            f"Dataset exceeds the {self.max_size_bytes}-byte limit."
                        )
                    output.write(chunk)
        except InvalidDatasetError:
            destination.unlink(missing_ok=True)
            raise
        except OSError as exc:
            destination.unlink(missing_ok=True)
            raise DatasetStorageError("Could not write the dataset file.") from exc

        if size_bytes == 0:
            destination.unlink(missing_ok=True)
            raise InvalidDatasetError("The dataset file is empty.")

        return StoredDataset(
            dataset_id=dataset_id,
            filename=safe_filename,
            stored_filename=stored_filename,
            content_type=content_type,
            size_bytes=size_bytes,
        )


def get_dataset_service() -> DatasetService:
    """Build the dataset service from validated application settings."""
    settings = get_settings()
    return DatasetService(
        storage_dir=settings.dataset_storage_dir,
        max_size_bytes=settings.max_dataset_size_bytes,
    )

