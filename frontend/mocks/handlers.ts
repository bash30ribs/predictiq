import {
  BusinessImpactSummary,
  CustomerBatchListResponse,
  CustomerDetailResponse,
  DataQualityProfile,
  DatasetUploadResponse,
  ExecutiveDashboardSummary,
  ModelEvaluationResponse,
  ModelTrainResponse,
  PredictionRequest,
  PredictionResponse,
  RiskLevel,
  WhatIfSimulationRequest,
  WhatIfSimulationResponse,
} from '@/lib/types';
import {
  mockBusinessImpact,
  mockCustomerDetails,
  mockCustomersList,
  mockDashboardSummary,
  mockDataQuality,
  mockDatasetUpload,
  mockModelEvaluation,
} from './data';

// Helper for simulated network delay
export const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Flag to simulate API errors for testing error states
let forceErrorState = false;

export function setForceError(enabled: boolean) {
  forceErrorState = enabled;
}

export function getForceError(): boolean {
  return forceErrorState;
}

function checkError() {
  if (forceErrorState) {
    throw new Error("Simulated API Error: Service unavailable. Please try again.");
  }
}

// Calculate realistic prediction for what-if simulation & arbitrary inputs
export function computePrediction(params: PredictionRequest): PredictionResponse {
  let score = 0.40; // baseline

  // Contract impact
  if (params.contract === 'Month-to-month') {
    score += 0.28;
  } else if (params.contract === 'One year') {
    score -= 0.18;
  } else if (params.contract === 'Two year') {
    score -= 0.35;
  }

  // Support calls impact
  if (params.support_calls >= 5) {
    score += 0.25;
  } else if (params.support_calls >= 3) {
    score += 0.10;
  } else if (params.support_calls <= 1) {
    score -= 0.15;
  }

  // Tenure impact
  if (params.tenure <= 6) {
    score += 0.15;
  } else if (params.tenure <= 12) {
    score += 0.05;
  } else if (params.tenure > 36) {
    score -= 0.22;
  }

  // Monthly charges impact
  if (params.monthly_charges > 1500) {
    score += 0.16;
  } else if (params.monthly_charges > 900) {
    score += 0.08;
  } else if (params.monthly_charges < 400) {
    score -= 0.08;
  }

  // Clamp probability between 0.05 and 0.98
  const probability = Math.min(0.98, Math.max(0.05, Math.round(score * 100) / 100));

  let risk_level: RiskLevel = 'LOW';
  if (probability >= 0.70) {
    risk_level = 'HIGH';
  } else if (probability >= 0.35) {
    risk_level = 'MEDIUM';
  }

  const factors = [
    {
      feature: "Contract Type",
      impact: params.contract === 'Month-to-month' ? 0.28 : params.contract === 'One year' ? -0.18 : -0.35,
    },
    {
      feature: "Support Calls",
      impact: params.support_calls >= 5 ? 0.21 : params.support_calls >= 3 ? 0.10 : -0.12,
    },
    {
      feature: "Monthly Charges",
      impact: params.monthly_charges > 1000 ? 0.16 : 0.04,
    },
    {
      feature: "Tenure",
      impact: params.tenure < 12 ? 0.12 : -0.14,
    },
  ];

  return {
    customer_id: params.customer_id,
    prediction: probability >= 0.5 ? "Churn" : "Retain",
    probability,
    risk_level,
    confidence: "HIGH",
    top_factors: factors,
  };
}

export const mockHandlers = {
  async getDashboardSummary(): Promise<ExecutiveDashboardSummary> {
    await delay(450);
    checkError();
    return mockDashboardSummary;
  },

  async uploadDataset(file: File | null): Promise<DatasetUploadResponse> {
    await delay(700);
    checkError();
    return {
      ...mockDatasetUpload,
      file_name: file ? file.name : mockDatasetUpload.file_name,
      file_size_bytes: file ? file.size : mockDatasetUpload.file_size_bytes,
      uploaded_at: new Date().toISOString(),
    };
  },

  async getDataQualityProfile(datasetId?: string): Promise<DataQualityProfile> {
    await delay(500);
    checkError();
    return mockDataQuality;
  },

  async trainModel(algorithm: string = 'xgboost'): Promise<ModelTrainResponse> {
    await delay(1200); // slightly longer to feel like real ML fitting
    checkError();
    return {
      job_id: `job_${Date.now().toString(36)}`,
      status: "completed",
      model_id: "model_xgb_v2",
      model_name: algorithm === 'xgboost' ? "XGBoost Classifier v2.1" : algorithm === 'random_forest' ? "Random Forest v1.4" : "Logistic Regression v1.0",
      training_duration_seconds: 14.2,
      trained_at: new Date().toISOString(),
    };
  },

  async getModelEvaluation(modelId?: string): Promise<ModelEvaluationResponse> {
    await delay(400);
    checkError();
    return mockModelEvaluation;
  },

  async getCustomers(options: {
    page?: number;
    pageSize?: number;
    search?: string;
    riskLevel?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
  } = {}): Promise<CustomerBatchListResponse> {
    await delay(400);
    checkError();

    const {
      page = 1,
      pageSize = 10,
      search = '',
      riskLevel = 'ALL',
      sortBy = 'probability',
      sortDir = 'desc',
    } = options;

    let filtered = [...mockCustomersList];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        c => c.customer_id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
      );
    }

    if (riskLevel && riskLevel !== 'ALL') {
      filtered = filtered.filter(c => c.risk_level === riskLevel);
    }

    filtered.sort((a, b) => {
      let aVal = a[sortBy as keyof typeof a];
      let bVal = b[sortBy as keyof typeof b];

      if (typeof aVal === 'string') {
        return sortDir === 'asc'
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    const total = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);

    return {
      total,
      page,
      page_size: pageSize,
      total_pages: Math.max(1, Math.ceil(total / pageSize)),
      customers: paginated,
    };
  },

  async getCustomerDetail(customerId: string): Promise<CustomerDetailResponse> {
    await delay(450);
    checkError();

    // Check specific mock details or build dynamically from list
    if (mockCustomerDetails[customerId]) {
      return mockCustomerDetails[customerId];
    }

    const found = mockCustomersList.find(c => c.customer_id === customerId);
    const item = found || {
      customer_id: customerId,
      name: `Account ${customerId}`,
      segment: "Enterprise B2B",
      tenure: 10,
      monthly_charges: 1150,
      contract: "Month-to-month" as const,
      support_calls: 4,
      probability: 0.74,
      risk_level: "HIGH" as const,
      confidence: "HIGH" as const,
      primary_driver: "Contract Type",
    };

    const prediction = computePrediction({
      customer_id: item.customer_id,
      tenure: item.tenure,
      monthly_charges: item.monthly_charges,
      contract: item.contract,
      support_calls: item.support_calls,
    });

    return {
      customer: {
        customer_id: item.customer_id,
        name: item.name,
        email: `contact@${item.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        segment: item.segment,
        account_manager: "David Ross",
        tenure: item.tenure,
        monthly_charges: item.monthly_charges,
        contract: item.contract,
        support_calls: item.support_calls,
        joined_date: "2025-10-10",
        last_interaction: "2026-08-28",
        payment_method: "Electronic check",
        billing_status: "Current",
      },
      prediction,
      explanation: {
        summary: `${item.name} currently carries a ${Math.round(prediction.probability * 100)}% churn probability driven by contract duration and service ticket velocity.`,
        narratives: [
          `Active ${item.contract} terms expose the account to short-term churn volatility.`,
          `Recent support activity (${item.support_calls} calls logged) signals elevated customer frustration.`,
          `Monthly billing tier of $${item.monthly_charges.toLocaleString()} is above average for this customer segment.`,
        ],
      },
      recommendations: [
        {
          id: "rec_01",
          title: "Offer 1-Year Commitment at 10% Discount",
          description: "Transition account from month-to-month to annual terms with dedicated account review.",
          projected_risk_reduction: 0.38,
          urgency: "IMMEDIATE",
          estimated_cost: Math.round(item.monthly_charges * 1.2),
          estimated_annual_roi: Math.round(item.monthly_charges * 9),
        },
        {
          id: "rec_02",
          title: "Technical Health Check & White-Glove Support",
          description: "Schedule 30-minute review with Senior Support Engineer to resolve recurring tickets.",
          projected_risk_reduction: 0.22,
          urgency: "HIGH",
          estimated_cost: 400,
          estimated_annual_roi: Math.round(item.monthly_charges * 7),
        },
      ],
    };
  },

  async getPrediction(params: PredictionRequest): Promise<PredictionResponse> {
    await delay(350);
    checkError();
    return computePrediction(params);
  },

  async simulateWhatIf(params: WhatIfSimulationRequest): Promise<WhatIfSimulationResponse> {
    await delay(400);
    checkError();

    // Look up original customer if exists, or compute defaults
    const existing = mockCustomersList.find(c => c.customer_id === params.customer_id);
    const origTenure = existing ? existing.tenure : 8;
    const origCharges = existing ? existing.monthly_charges : 1299;
    const origContract = existing ? existing.contract : 'Month-to-month';
    const origCalls = existing ? existing.support_calls : 6;

    const originalPrediction = computePrediction({
      customer_id: params.customer_id,
      tenure: origTenure,
      monthly_charges: origCharges,
      contract: origContract,
      support_calls: origCalls,
    });

    const simulatedPrediction = computePrediction({
      customer_id: params.customer_id,
      tenure: params.tenure,
      monthly_charges: params.monthly_charges,
      contract: params.contract,
      support_calls: params.support_calls,
    });

    const origProb = existing ? existing.probability : originalPrediction.probability;
    const origRisk = existing ? existing.risk_level : originalPrediction.risk_level;

    const delta = Math.round((simulatedPrediction.probability - origProb) * 100) / 100;

    return {
      customer_id: params.customer_id,
      original: {
        probability: origProb,
        risk_level: origRisk,
        monthly_charges: origCharges,
        contract: origContract,
        support_calls: origCalls,
        tenure: origTenure,
      },
      simulated: {
        probability: simulatedPrediction.probability,
        risk_level: simulatedPrediction.risk_level,
        monthly_charges: params.monthly_charges,
        contract: params.contract,
        support_calls: params.support_calls,
        tenure: params.tenure,
      },
      probability_delta: delta,
      risk_level_changed: originalPrediction.risk_level !== simulatedPrediction.risk_level,
      projected_mrr_retained: delta < 0 ? params.monthly_charges : 0,
      factor_shifts: [
        {
          feature: "Contract Type",
          previous_impact: origContract === 'Month-to-month' ? 0.28 : -0.18,
          new_impact: params.contract === 'Month-to-month' ? 0.28 : params.contract === 'One year' ? -0.18 : -0.35,
        },
        {
          feature: "Support Calls",
          previous_impact: origCalls >= 5 ? 0.21 : 0.05,
          new_impact: params.support_calls >= 5 ? 0.21 : params.support_calls <= 2 ? -0.12 : 0.05,
        },
        {
          feature: "Monthly Charges",
          previous_impact: origCharges > 1000 ? 0.16 : 0.05,
          new_impact: params.monthly_charges > 1000 ? 0.16 : 0.04,
        },
      ],
    };
  },

  async getBusinessImpact(): Promise<BusinessImpactSummary> {
    await delay(450);
    checkError();
    return mockBusinessImpact;
  },
};
