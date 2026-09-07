import { create } from 'zustand';
import {
  CustomerListItem,
  CustomerProfileDetail,
  DataQualityProfile,
  DatasetUploadResponse,
  ExecutiveDashboardSummary,
  ModelEvaluationResponse,
  PredictionResponse,
  WhatIfSimulationResponse,
} from '@/lib/types';
import { mockDatasetUpload, mockDataQuality, mockModelEvaluation } from '@/mocks/data';

export interface UserSession {
  email: string;
  name: string;
  role: string;
  token: string;
  isAuthenticated: boolean;
}

interface AppStoreState {
  // 1. Auth Session
  user: UserSession | null;
  login: (email: string, role?: string) => void;
  logout: () => void;

  // 2. Uploaded Dataset State
  activeDataset: DatasetUploadResponse | null;
  dataQuality: DataQualityProfile | null;
  setActiveDataset: (dataset: DatasetUploadResponse, quality?: DataQualityProfile) => void;

  // 3. Model Training & Evaluation State
  isTraining: boolean;
  trainingProgress: number; // 0 - 100
  trainingStepMessage: string;
  modelEvaluation: ModelEvaluationResponse | null;
  startModelTraining: () => void;
  updateTrainingProgress: (progress: number, message: string) => void;
  setModelEvaluation: (evaluation: ModelEvaluationResponse) => void;

  // 4. Executive Dashboard Cache
  dashboardSummary: ExecutiveDashboardSummary | null;
  setDashboardSummary: (summary: ExecutiveDashboardSummary) => void;

  // 5. Customer Exploration
  selectedCustomerId: string | null;
  selectedCustomer: {
    customer: CustomerProfileDetail;
    prediction: PredictionResponse;
  } | null;
  setSelectedCustomer: (detail: { customer: CustomerProfileDetail; prediction: PredictionResponse } | null) => void;

  // 6. What-If Simulation State
  simulationInput: {
    customer_id: string;
    tenure: number;
    monthly_charges: number;
    contract: string;
    support_calls: number;
  };
  simulationResult: WhatIfSimulationResponse | null;
  setSimulationInput: (input: Partial<AppStoreState['simulationInput']>) => void;
  setSimulationResult: (result: WhatIfSimulationResponse | null) => void;

  // 7. Global Demo / Error Testing Mode
  simulateApiErrors: boolean;
  setSimulateApiErrors: (enabled: boolean) => void;
}

export const useAppStore = create<AppStoreState>((set) => ({
  // Default logged in user for executive demo convenience
  user: {
    name: "Elena Rostova",
    email: "elena.rostova@predictiq.io",
    role: "VP of Customer Success",
    token: "mock-jwt-token-exec-session-9843",
    isAuthenticated: true,
  },

  login: (email: string, role: string = "VP of Customer Success") =>
    set({
      user: {
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email,
        role,
        token: `mock-jwt-token-${Date.now()}`,
        isAuthenticated: true,
      },
    }),

  logout: () =>
    set({
      user: null,
    }),

  activeDataset: mockDatasetUpload,
  dataQuality: mockDataQuality,
  setActiveDataset: (dataset, quality) =>
    set({
      activeDataset: dataset,
      dataQuality: quality || null,
    }),

  isTraining: false,
  trainingProgress: 0,
  trainingStepMessage: '',
  modelEvaluation: mockModelEvaluation,

  startModelTraining: () =>
    set({
      isTraining: true,
      trainingProgress: 10,
      trainingStepMessage: "Analyzing feature correlations and cleaning null values...",
    }),

  updateTrainingProgress: (progress, message) =>
    set({
      trainingProgress: progress,
      trainingStepMessage: message,
      isTraining: progress < 100,
    }),

  setModelEvaluation: (evaluation) =>
    set({
      modelEvaluation: evaluation,
      isTraining: false,
      trainingProgress: 100,
      trainingStepMessage: "Training complete. XGBoost v2.1 benchmark updated.",
    }),

  dashboardSummary: null,
  setDashboardSummary: (summary) => set({ dashboardSummary: summary }),

  selectedCustomerId: "C1024",
  selectedCustomer: null,
  setSelectedCustomer: (detail) =>
    set({
      selectedCustomer: detail,
      selectedCustomerId: detail ? detail.customer.customer_id : null,
    }),

  simulationInput: {
    customer_id: "C1024",
    tenure: 8,
    monthly_charges: 1299,
    contract: "Month-to-month",
    support_calls: 6,
  },
  simulationResult: null,

  setSimulationInput: (input) =>
    set((state) => ({
      simulationInput: { ...state.simulationInput, ...input },
    })),

  setSimulationResult: (result) => set({ simulationResult: result }),

  simulateApiErrors: false,
  setSimulateApiErrors: (enabled) => set({ simulateApiErrors: enabled }),
}));
