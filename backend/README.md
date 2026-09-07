# PredictIQ Backend

FastAPI integration layer for PredictIQ. The backend accepts raw datasets,
defines a stable boundary for Member 1's predictor, logs prediction results in
PostgreSQL, and exposes paginated history for Member 3's dashboard. It does not
contain model training, a concrete model, authentication, or frontend code.

## Prerequisites

- Windows PowerShell
- Python 3.11 or newer
- PostgreSQL for prediction logging (not needed for the test suite)

## Setup

From the `backend` directory, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup.ps1
```

The script creates or reuses `.venv`, activates it for the setup process,
upgrades pip, and installs `requirements.txt`. Because a child PowerShell process
cannot activate an environment in its parent shell, activate it in the shell you
will use afterward:

```powershell
.\.venv\Scripts\Activate.ps1
```

Create your local runtime configuration without committing it:

```powershell
Copy-Item .env.example .env
```

Edit `DATABASE_URL` in `.env` for your PostgreSQL instance. `APP_NAME`,
`APP_ENV`, and `DATABASE_URL` are required; startup fails with a validation error
if any are missing. Dataset storage defaults to `data/uploads` with a 50 MiB
per-file limit and can be changed through the optional settings shown in
`.env.example`.

Create or update the database schema:

```powershell
alembic upgrade head
```

## Run

```powershell
uvicorn app.main:app --reload
```

The service is available at `http://127.0.0.1:8000`:

- `GET /` identifies the PredictIQ backend.
- `GET /health` returns `{"status": "ok"}`.
- `POST /api/datasets` stores a raw CSV, JSON, Parquet, XLS, or XLSX dataset.
- `POST /api/predict` accepts `{"features": {...}}` and returns a prediction
  with confidence.
- `GET /api/predictions?page=1&page_size=20` returns paginated history.
- Interactive API documentation is at `/docs`.

Creating the SQLAlchemy engine does not open a database connection. PostgreSQL
is contacted only when a route or service performs a database operation.

## Test

```powershell
pytest
```

Tests inject their own configuration, use temporary upload directories, and
override the database dependency with in-memory SQLite, so they never require a
live PostgreSQL server.

## Member 1 predictor contract

Member 1 supplies an object with this interface:

```python
from typing import Any, Mapping

from app.services.ml_service import MLPrediction


class ModelPredictor:
    def predict(self, features: Mapping[str, Any]) -> MLPrediction:
        # Call the trained model here.
        return MLPrediction(prediction="result", confidence=0.90)
```

Register that object from the future application composition/startup code with
`configure_predictor(ModelPredictor())`. Until a predictor is registered,
`POST /api/predict` intentionally returns HTTP 503 instead of a fabricated
prediction. Route modules never import the concrete model.

## Integration boundaries

- `app/api/routes/` owns HTTP route declarations.
- `app/schemas/` owns Pydantic request and response types.
- `app/models/` owns SQLAlchemy models.
- `app/services/` owns upload, prediction, persistence, and ML-boundary logic.
- `alembic/` owns database migrations.
