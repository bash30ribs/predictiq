# PredictIQ Integration Contract & Schemas

This document defines the canonical JSON schemas and contracts between the PredictIQ frontend and the backend/ML services. All field names, data types, and enum values defined here are stable and must not deviate.

---

## 1. Prediction Endpoints

### 1.1 Single Customer Prediction

#### Request: `POST /api/predict`
```json
{
  "customer_id": "C1024",
  "tenure": 8,
  "monthly_charges": 1299,
  "contract": "Month-to-month",
  "support_calls": 6
}
```

#### Response: `200 OK`
```json
{
  "customer_id": "C1024",
  "prediction": "Churn",
  "probability": 0.87,
  "risk_level": "HIGH",
  "confidence": "HIGH",
  "top_factors": [
    { "feature": "Contract Type", "impact": 0.28 },
    { "feature": "Support Calls", "impact": 0.21 },
    { "feature": "Monthly Charges", "impact": 0.16 },
    { "feature": "Tenure", "impact": -0.12 }
  ]
}
```

- `prediction`: `"Churn"` | `"Retain"`
- `risk_level`: `"LOW"` | `"MEDIUM"` | `"HIGH"`
- `confidence`: `"LOW"` | `"MEDIUM"` | `"HIGH"`
- `impact`: float (-1.0 to 1.0), positive indicates increasing churn risk, negative indicates retention influence.

---

## 2. Dataset Management Endpoints

### 2.1 Dataset Upload

#### Request: `POST /api/dataset/upload` (Multipart Form Data)
- File: CSV file (`.csv`)

#### Response: `200 OK`
```json
{
  "dataset_id": "ds_telco_2026_09",
  "file_name": "telco_churn_customer_data.csv",
  "file_size_bytes": 1048576,
  "row_count": 7043,
  "column_count": 21,
  "status": "ready",
  "uploaded_at": "2026-09-07T10:30:00Z"
}
```

### 2.2 Data Quality & Profile Summary

#### Request: `GET /api/dataset/:dataset_id/quality`

#### Response: `200 OK`
```json
{
  "dataset_id": "ds_telco_2026_09",
  "total_rows": 7043,
  "total_features": 21,
  "missing_cells_pct": 0.45,
  "duplicate_rows": 0,
  "health_score": 94,
  "target_column": "Churn",
  "class_distribution": {
    "retained": 5174,
    "churned": 1869,
    "churn_rate_pct": 26.5
  },
  "columns": [
    { "name": "customer_id", "type": "string", "missing_count": 0, "unique_count": 7043, "sample_values": ["C1001", "C1002"] },
    { "name": "tenure", "type": "integer", "missing_count": 0, "mean": 32.4, "min": 1, "max": 72 },
    { "name": "monthly_charges", "type": "float", "missing_count": 11, "mean": 64.76, "min": 18.25, "max": 118.75 },
    { "name": "contract", "type": "categorical", "missing_count": 0, "categories": ["Month-to-month", "One year", "Two year"] },
    { "name": "support_calls", "type": "integer", "missing_count": 0, "mean": 2.1, "min": 0, "max": 9 }
  ],
  "health_flags": [
    { "level": "info", "code": "CLEAN_DATA", "message": "Zero duplicate records detected across 7,043 rows." },
    { "level": "warning", "code": "CLASS_IMBALANCE", "message": "Churn rate is 26.5% - SMOTE oversampling recommended during model training." },
    { "level": "warning", "code": "MISSING_VALUES", "message": "11 rows contain null values in monthly_charges (0.15% of dataset, will impute with median)." },
    { "level": "info", "code": "HIGH_CARDINALITY", "message": "All categorical columns have valid bounded cardinality." }
  ]
}
```

---

## 3. Model Training & Evaluation Endpoints

### 3.1 Trigger Training

#### Request: `POST /api/models/train`
```json
{
  "dataset_id": "ds_telco_2026_09",
  "algorithm": "xgboost",
  "optimize_hyperparameters": true
}
```

#### Response: `200 OK`
```json
{
  "job_id": "job_train_8812",
  "status": "completed",
  "model_id": "model_xgb_v2",
  "model_name": "XGBoost Classifier v2.1",
  "training_duration_seconds": 14.2,
  "trained_at": "2026-09-07T10:35:00Z"
}
```

### 3.2 Evaluation Metrics

#### Request: `GET /api/models/:model_id/metrics`

#### Response: `200 OK`
```json
{
  "model_id": "model_xgb_v2",
  "model_name": "XGBoost Classifier v2.1",
  "metrics": {
    "accuracy": 0.892,
    "precision": 0.845,
    "recall": 0.818,
    "f1_score": 0.831,
    "roc_auc": 0.923
  },
  "confusion_matrix": {
    "true_positive": 1528,
    "false_positive": 280,
    "true_negative": 4752,
    "false_negative": 483
  },
  "model_comparison": [
    { "name": "XGBoost v2.1", "accuracy": 0.892, "precision": 0.845, "recall": 0.818, "f1": 0.831, "roc_auc": 0.923, "is_active": true },
    { "name": "Random Forest v1.4", "accuracy": 0.871, "precision": 0.812, "recall": 0.795, "f1": 0.803, "roc_auc": 0.896, "is_active": false },
    { "name": "Logistic Regression v1.0", "accuracy": 0.804, "precision": 0.730, "recall": 0.710, "f1": 0.720, "roc_auc": 0.841, "is_active": false }
  ]
}
```

---

## 4. Executive Dashboard Endpoints

### 4.1 Dashboard KPIs & Trends

#### Request: `GET /api/dashboard/summary`

#### Response: `200 OK`
```json
{
  "total_customers": 7043,
  "at_risk_count": 864,
  "at_risk_percentage": 12.3,
  "monthly_revenue_at_risk": 412850,
  "currency": "USD",
  "overall_model_confidence": 0.914,
  "risk_distribution": {
    "high": 864,
    "medium": 1420,
    "low": 4759
  },
  "monthly_trend": [
    { "month": "Apr", "actual_churn_rate": 24.1, "predicted_churn_rate": 24.5, "revenue_lost": 34800 },
    { "month": "May", "actual_churn_rate": 25.0, "predicted_churn_rate": 25.2, "revenue_lost": 36200 },
    { "month": "Jun", "actual_churn_rate": 26.2, "predicted_churn_rate": 25.9, "revenue_lost": 38900 },
    { "month": "Jul", "actual_churn_rate": 27.1, "predicted_churn_rate": 26.8, "revenue_lost": 41500 },
    { "month": "Aug", "actual_churn_rate": 26.5, "predicted_churn_rate": 26.3, "revenue_lost": 39800 },
    { "month": "Sep", "actual_churn_rate": null, "predicted_churn_rate": 24.8, "revenue_lost": null },
    { "month": "Oct (Proj)", "actual_churn_rate": null, "predicted_churn_rate": 23.2, "revenue_lost": null }
  ]
}
```

---

## 5. Customer Risk List & Detail

### 5.1 Batch Customer List

#### Request: `GET /api/customers?page=1&page_size=20&risk_level=HIGH&search=C10&sort_by=probability&sort_dir=desc`

#### Response: `200 OK`
```json
{
  "total": 864,
  "page": 1,
  "page_size": 20,
  "total_pages": 44,
  "customers": [
    {
      "customer_id": "C1024",
      "name": "Apex Digital Labs",
      "segment": "Enterprise B2B",
      "tenure": 8,
      "monthly_charges": 1299,
      "contract": "Month-to-month",
      "support_calls": 6,
      "probability": 0.87,
      "risk_level": "HIGH",
      "confidence": "HIGH",
      "primary_driver": "Contract Type"
    }
  ]
}
```

### 5.2 Customer Detail & Recommendations

#### Request: `GET /api/customers/:customer_id`

#### Response: `200 OK`
```json
{
  "customer": {
    "customer_id": "C1024",
    "name": "Apex Digital Labs",
    "email": "procurement@apexdigital.io",
    "segment": "Enterprise B2B",
    "account_manager": "Sarah Jenkins",
    "tenure": 8,
    "monthly_charges": 1299,
    "contract": "Month-to-month",
    "support_calls": 6,
    "joined_date": "2025-12-15",
    "last_interaction": "2026-09-02",
    "payment_method": "Electronic Check",
    "billing_status": "Current"
  },
  "prediction": {
    "customer_id": "C1024",
    "prediction": "Churn",
    "probability": 0.87,
    "risk_level": "HIGH",
    "confidence": "HIGH",
    "top_factors": [
      { "feature": "Contract Type", "impact": 0.28 },
      { "feature": "Support Calls", "impact": 0.21 },
      { "feature": "Monthly Charges", "impact": 0.16 },
      { "feature": "Tenure", "impact": -0.12 }
    ]
  },
  "explanation": {
    "summary": "Apex Digital Labs exhibits an 87% probability of churn within the next 30 days.",
    "narratives": [
      "Month-to-month contract provides zero barrier to switching to competitors.",
      "High volume of recent support calls (6 in the last 30 days) indicates acute technical friction.",
      "Premium monthly spend ($1,299/mo) amplifies price sensitivity without long-term tier discounts."
    ]
  },
  "recommendations": [
    {
      "id": "rec_01",
      "title": "Migrate to 1-Year Annual Contract with 15% Incentive",
      "description": "Lock in annual commitment with a guaranteed SLA and 15% billing credit.",
      "projected_risk_reduction": 0.42,
      "urgency": "IMMEDIATE",
      "estimated_cost": 2340,
      "estimated_annual_roi": 13248
    },
    {
      "id": "rec_02",
      "title": "Executive CS Escalation & Support Audit",
      "description": "Assign Senior Solutions Architect to resolve the 6 outstanding support tickets within 48h.",
      "projected_risk_reduction": 0.23,
      "urgency": "HIGH",
      "estimated_cost": 500,
      "estimated_annual_roi": 15088
    }
  ]
}
```

---

## 6. What-If Simulation Endpoint

### 6.1 Simulate Parameter Shift

#### Request: `POST /api/simulation`
```json
{
  "customer_id": "C1024",
  "tenure": 8,
  "monthly_charges": 1104,
  "contract": "One year",
  "support_calls": 2
}
```

#### Response: `200 OK`
```json
{
  "customer_id": "C1024",
  "original": {
    "probability": 0.87,
    "risk_level": "HIGH",
    "monthly_charges": 1299,
    "contract": "Month-to-month",
    "support_calls": 6,
    "tenure": 8
  },
  "simulated": {
    "probability": 0.24,
    "risk_level": "LOW",
    "monthly_charges": 1104,
    "contract": "One year",
    "support_calls": 2,
    "tenure": 8
  },
  "probability_delta": -0.63,
  "risk_level_changed": true,
  "projected_mrr_retained": 1104,
  "factor_shifts": [
    { "feature": "Contract Type", "previous_impact": 0.28, "new_impact": -0.18 },
    { "feature": "Support Calls", "previous_impact": 0.21, "new_impact": 0.03 },
    { "feature": "Monthly Charges", "previous_impact": 0.16, "new_impact": 0.09 }
  ]
}
```

---

## 7. Business Impact & Revenue-at-Risk Endpoints

### 7.1 Aggregate Business Impact

#### Request: `GET /api/impact/summary`

#### Response: `200 OK`
```json
{
  "total_portfolio_mrr": 3140000,
  "total_portfolio_arr": 37680000,
  "mrr_at_risk": 412850,
  "arr_at_risk": 4954200,
  "high_risk_customers_count": 864,
  "segments": [
    { "segment": "Enterprise B2B", "customers_at_risk": 142, "mrr_at_risk": 184500, "avg_churn_prob": 0.82 },
    { "segment": "Mid-Market", "customers_at_risk": 298, "mrr_at_risk": 142200, "avg_churn_prob": 0.78 },
    { "segment": "SMB", "customers_at_risk": 424, "mrr_at_risk": 86150, "avg_churn_prob": 0.74 }
  ],
  "contract_breakdown": [
    { "contract": "Month-to-month", "customers_at_risk": 718, "mrr_at_risk": 352400 },
    { "contract": "One year", "customers_at_risk": 112, "mrr_at_risk": 48200 },
    { "contract": "Two year", "customers_at_risk": 34, "mrr_at_risk": 12250 }
  ],
  "retention_scenarios": [
    { "target_top_n": 25, "projected_interventions": 25, "success_rate_pct": 65, "mrr_saved": 48200, "arr_saved": 578400, "estimated_program_cost": 22500, "net_roi_multiple": 25.7 },
    { "target_top_n": 50, "projected_interventions": 50, "success_rate_pct": 60, "mrr_saved": 88400, "arr_saved": 1060800, "estimated_program_cost": 45000, "net_roi_multiple": 23.5 },
    { "target_top_n": 100, "projected_interventions": 100, "success_rate_pct": 55, "mrr_saved": 145000, "arr_saved": 1740000, "estimated_program_cost": 90000, "net_roi_multiple": 19.3 },
    { "target_top_n": 250, "projected_interventions": 250, "success_rate_pct": 48, "mrr_saved": 248000, "arr_saved": 2976000, "estimated_program_cost": 225000, "net_roi_multiple": 13.2 }
  ]
}
```
