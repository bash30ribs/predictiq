/**
 * PredictIQ Shared TypeScript Definitions
 * Canonical data contracts between Frontend and Backend (FastAPI / ML Engine / SQLite)
 */

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type PredictionOutcome = 'Churn' | 'Retain';
export type ContractType = 'Month-to-month' | 'One year' | 'Two year';
export type SentimentType = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'CRITICAL_FRICTION';

export interface TopFactor {
  feature: string;
  impact: number; // positive increases churn risk, negative reduces churn risk
}

// 0. User Account & Registration
export interface UserRegistrationRequest {
  name: string;
  email: string;
  password?: string;
  organization: string;
  role: string;
}

export interface UserAuthResponse {
  user: {
    id: number | string;
    name: string;
    email: string;
    organization: string;
    role: string;
    created_at: string;
  };
  token: string;
}

// 1. Prediction Request & Response
export interface PredictionRequest {
  customer_id: string;
  tenure: number;
  monthly_charges: number;
  contract: ContractType | string;
  support_calls: number;
}

export interface PredictionResponse {
  customer_id: string;
  prediction: PredictionOutcome;
  probability: number;
  risk_level: RiskLevel;
  confidence: ConfidenceLevel;
  top_factors: TopFactor[];
}

// 2. Dataset Upload & Data Quality
export interface DatasetUploadResponse {
  dataset_id: string;
  file_name: string;
  file_size_bytes: number;
  row_count: number;
  column_count: number;
  status: 'processing' | 'ready' | 'error';
  uploaded_at: string;
}

export interface ColumnProfile {
  name: string;
  type: 'string' | 'integer' | 'float' | 'categorical' | 'boolean';
  missing_count: number;
  unique_count?: number;
  mean?: number;
  min?: number;
  max?: number;
  categories?: string[];
  sample_values?: (string | number)[];
}

export interface HealthFlag {
  level: 'info' | 'warning' | 'error';
  code: string;
  message: string;
}

export interface DataQualityProfile {
  dataset_id: string;
  total_rows: number;
  total_features: number;
  missing_cells_pct: number;
  duplicate_rows: number;
  health_score: number; // 0 - 100
  target_column: string;
  class_distribution: {
    retained: number;
    churned: number;
    churn_rate_pct: number;
  };
  columns: ColumnProfile[];
  health_flags: HealthFlag[];
}

// 3. Model Training & Evaluation
export interface ModelTrainRequest {
  dataset_id: string;
  algorithm: 'xgboost' | 'random_forest' | 'logistic_regression';
  optimize_hyperparameters?: boolean;
}

export interface ModelTrainResponse {
  job_id: string;
  status: 'running' | 'completed' | 'failed';
  model_id: string;
  model_name: string;
  training_duration_seconds: number;
  trained_at: string;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
}

export interface ConfusionMatrix {
  true_positive: number;
  false_positive: number;
  true_negative: number;
  false_negative: number;
}

export interface ModelBenchmark {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number;
  is_active: boolean;
}

export interface ModelEvaluationResponse {
  model_id: string;
  model_name: string;
  metrics: ModelMetrics;
  confusion_matrix: ConfusionMatrix;
  model_comparison: ModelBenchmark[];
}

// 4. Executive Dashboard
export interface MonthlyTrendPoint {
  month: string;
  actual_churn_rate: number | null;
  predicted_churn_rate: number;
  revenue_lost: number | null;
}

export interface ExecutiveDashboardSummary {
  total_customers: number;
  at_risk_count: number;
  at_risk_percentage: number;
  monthly_revenue_at_risk: number;
  currency: string;
  overall_model_confidence: number;
  risk_distribution: {
    high: number;
    medium: number;
    low: number;
  };
  monthly_trend: MonthlyTrendPoint[];
}

// 5. Customer Entities & Batch List
export interface CustomerListItem {
  customer_id: string;
  name: string;
  segment: string;
  tenure: number;
  monthly_charges: number;
  contract: ContractType;
  support_calls: number;
  probability: number;
  risk_level: RiskLevel;
  confidence: ConfidenceLevel;
  primary_driver: string;
}

export interface CustomerBatchListResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  customers: CustomerListItem[];
}

export interface CustomerProfileDetail {
  customer_id: string;
  name: string;
  email: string;
  segment: string;
  account_manager: string;
  tenure: number;
  monthly_charges: number;
  contract: ContractType;
  support_calls: number;
  joined_date: string;
  last_interaction: string;
  payment_method: string;
  billing_status: string;
}

export interface RecommendationAction {
  id: string;
  title: string;
  description: string;
  projected_risk_reduction: number;
  urgency: 'IMMEDIATE' | 'HIGH' | 'MEDIUM';
  estimated_cost: number;
  estimated_annual_roi: number;
}

export interface CustomerDetailResponse {
  customer: CustomerProfileDetail;
  prediction: PredictionResponse;
  explanation: {
    summary: string;
    narratives: string[];
  };
  recommendations: RecommendationAction[];
}

// 6. What-If Simulation
export interface WhatIfSimulationRequest {
  customer_id: string;
  tenure: number;
  monthly_charges: number;
  contract: ContractType | string;
  support_calls: number;
}

export interface FactorShift {
  feature: string;
  previous_impact: number;
  new_impact: number;
}

export interface WhatIfSimulationResponse {
  customer_id: string;
  original: {
    probability: number;
    risk_level: RiskLevel;
    monthly_charges: number;
    contract: ContractType | string;
    support_calls: number;
    tenure: number;
  };
  simulated: {
    probability: number;
    risk_level: RiskLevel;
    monthly_charges: number;
    contract: ContractType | string;
    support_calls: number;
    tenure: number;
  };
  probability_delta: number;
  risk_level_changed: boolean;
  projected_mrr_retained: number;
  factor_shifts: FactorShift[];
}

// 7. Business Impact & Revenue at Risk
export interface SegmentImpact {
  segment: string;
  customers_at_risk: number;
  mrr_at_risk: number;
  avg_churn_prob: number;
}

export interface ContractImpact {
  contract: ContractType;
  customers_at_risk: number;
  mrr_at_risk: number;
}

export interface RetentionScenario {
  target_top_n: number;
  projected_interventions: number;
  success_rate_pct: number;
  mrr_saved: number;
  arr_saved: number;
  estimated_program_cost: number;
  net_roi_multiple: number;
}

export interface BusinessImpactSummary {
  total_portfolio_mrr: number;
  total_portfolio_arr: number;
  mrr_at_risk: number;
  arr_at_risk: number;
  high_risk_customers_count: number;
  segments: SegmentImpact[];
  contract_breakdown: ContractImpact[];
  retention_scenarios: RetentionScenario[];
}

// 8. Qualitative Customer Review & Sentiment Analysis
export interface CustomerReviewAnalysisRequest {
  customer_id?: string;
  customer_name?: string;
  review_text: string;
  source?: 'NPS Survey' | 'Support Ticket' | 'Exit Interview' | 'Executive QBR' | string;
  user_id?: number | string;
  organization?: string;
}

export interface CustomerReviewAnalysisResponse {
  id?: number | string;
  customer_id?: string;
  customer_name?: string;
  review_text: string;
  sentiment: SentimentType;
  sentiment_score: number; // -1.0 to 1.0
  churn_risk_delta: number; // e.g. +0.25 or -0.15
  adjusted_probability: number;
  friction_keywords: string[];
  recommended_playbook: string;
  created_at: string;
}
