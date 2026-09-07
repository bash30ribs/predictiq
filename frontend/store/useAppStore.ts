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
  id: string | number;
  email: string;
  name: string;
  organization: string;
  role: string;
  token: string;
  isAuthenticated: boolean;
  hasLoadedDemoData?: boolean;
}

interface AppStoreState {
  // 1. Auth Session
  user: UserSession | null;
  login: (userOrEmail: string | Partial<UserSession>, role?: string) => void;
  logout: () => void;
  loadDemoData: () => void;
  clearWorkspaceData: () => void;

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

  // 8. Easy Mode / Plain English Mode
  isEasyMode: boolean;
  toggleEasyMode: () => void;
}

// Initial session resolver (safe for SSR)
function getInitialUser(): UserSession | null {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('predictiq_user_session');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored user session', e);
    }
  }
  // Default to Elena Rostova demo session if no session stored
  return {
    id: 1,
    name: "Elena Rostova",
    email: "elena.rostova@predictiq.io",
    organization: "Apex Enterprise Telecom",
    role: "VP of Customer Success",
    token: "mock-jwt-token-exec-session-9843",
    isAuthenticated: true,
    hasLoadedDemoData: true,
  };
}

const initialUser = getInitialUser();

export const useAppStore = create<AppStoreState>((set) => ({
  user: initialUser,

  login: (userOrEmail, role = "VP of Customer Success") => {
    let sessionUser: UserSession;

    if (typeof userOrEmail === 'object' && userOrEmail !== null) {
      sessionUser = {
        id: userOrEmail.id || Date.now(),
        name: userOrEmail.name || 'Enterprise User',
        email: userOrEmail.email || '',
        organization: userOrEmail.organization || 'Enterprise Org',
        role: userOrEmail.role || role,
        token: userOrEmail.token || `jwt_${Date.now()}`,
        isAuthenticated: true,
        hasLoadedDemoData: userOrEmail.id === 1,
      };
    } else {
      const email = userOrEmail;
      sessionUser = {
        id: email === 'elena.rostova@predictiq.io' ? 1 : Date.now(),
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        email,
        organization: email === 'elena.rostova@predictiq.io' ? 'Apex Enterprise Telecom' : 'Enterprise Org',
        role,
        token: `mock-jwt-token-${Date.now()}`,
        isAuthenticated: true,
        hasLoadedDemoData: email === 'elena.rostova@predictiq.io',
      };
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('predictiq_user_session', JSON.stringify(sessionUser));
      } catch (e) {
        console.warn('Failed to persist user session', e);
      }
    }

    // If User 1 (Demo account), load pre-seeded telecom dataset.
    // If a newly created user (e.g. User 2), start with a clean workspace!
    const isDemoUser = sessionUser.id === 1;

    set({
      user: sessionUser,
      activeDataset: isDemoUser ? mockDatasetUpload : null,
      dataQuality: isDemoUser ? mockDataQuality : null,
      modelEvaluation: isDemoUser ? mockModelEvaluation : null,
      selectedCustomerId: isDemoUser ? 'C1024' : null,
    });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('predictiq_user_session');
      } catch (e) {
        console.warn('Failed to clear user session', e);
      }
    }
    set({
      user: null,
      activeDataset: null,
      dataQuality: null,
      modelEvaluation: null,
      selectedCustomerId: null,
      dashboardSummary: null,
    });
  },

  loadDemoData: () =>
    set((state) => {
      const updatedUser = state.user ? { ...state.user, hasLoadedDemoData: true } : null;
      if (typeof window !== 'undefined' && updatedUser) {
        try {
          localStorage.setItem('predictiq_user_session', JSON.stringify(updatedUser));
        } catch (e) {}
      }
      return {
        user: updatedUser,
        activeDataset: mockDatasetUpload,
        dataQuality: mockDataQuality,
        modelEvaluation: mockModelEvaluation,
        selectedCustomerId: "C1024",
      };
    }),

  clearWorkspaceData: () =>
    set({
      activeDataset: null,
      dataQuality: null,
      modelEvaluation: null,
      selectedCustomerId: null,
    }),

  activeDataset: initialUser?.id === 1 ? mockDatasetUpload : null,
  dataQuality: initialUser?.id === 1 ? mockDataQuality : null,
  setActiveDataset: (dataset, quality) =>
    set({
      activeDataset: dataset,
      dataQuality: quality || null,
    }),

  isTraining: false,
  trainingProgress: 0,
  trainingStepMessage: '',
  modelEvaluation: initialUser?.id === 1 ? mockModelEvaluation : null,

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

  selectedCustomerId: initialUser?.id === 1 ? "C1024" : null,
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

  isEasyMode: false,
  toggleEasyMode: () =>
    set((state) => {
      const next = !state.isEasyMode;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('predictiq_easy_mode', String(next));
        } catch (e) {}
      }
      return { isEasyMode: next };
    }),
}));
