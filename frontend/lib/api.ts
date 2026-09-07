/**
 * PredictIQ API Layer
 * Single integration entry point for the frontend.
 * Interacts with Next.js App Router SQLite endpoints and ML mock engine.
 */

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
  WhatIfSimulationRequest,
  WhatIfSimulationResponse,
  UserRegistrationRequest,
  UserAuthResponse,
  CustomerReviewAnalysisRequest,
  CustomerReviewAnalysisResponse,
} from '@/lib/types';
import { mockHandlers, setForceError, getForceError } from '@/mocks/handlers';

function getActiveUserId(): number {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('predictiq_user_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.id) return Number(parsed.id);
      }
    } catch {}
  }
  return 1;
}

export const apiClient = {
  // 0. Database User Auth & Registration (SQLite)
  async registerUser(data: UserRegistrationRequest): Promise<UserAuthResponse> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson?.error || 'Registration failed.');
      }
      return await res.json();
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) throw err;
      return {
        user: {
          id: Date.now(),
          name: data.name,
          email: data.email,
          organization: data.organization,
          role: data.role,
          created_at: new Date().toISOString(),
        },
        token: `jwt_fallback_${Date.now()}`,
      };
    }
  },

  async loginUser(data: { email: string; role?: string }): Promise<UserAuthResponse> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson?.error || 'Authentication failed.');
      }
      return await res.json();
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) throw err;
      return {
        user: {
          id: 1,
          name: data.email.split('@')[0],
          email: data.email,
          organization: 'Apex Enterprise Telecom',
          role: data.role || 'VP of Customer Success',
          created_at: new Date().toISOString(),
        },
        token: `jwt_fallback_${Date.now()}`,
      };
    }
  },

  // Qualitative Customer Review NLP Sentiment Analysis (SQLite)
  async analyzeCustomerReview(data: CustomerReviewAnalysisRequest): Promise<CustomerReviewAnalysisResponse> {
    try {
      const activeUserId = data.user_id || getActiveUserId();
      const res = await fetch('/api/reviews/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, user_id: activeUserId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || 'Sentiment analysis failed.');
      }
      return await res.json();
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) throw err;
      // Fallback NLP heuristic
      const hasFriction = /unresolved|outage|slow|cancel|alternative|frustrated|competitor/i.test(data.review_text);
      return {
        customer_id: data.customer_id || 'C1024',
        customer_name: data.customer_name || 'Apex Digital Labs',
        review_text: data.review_text,
        sentiment: hasFriction ? 'CRITICAL_FRICTION' : 'POSITIVE',
        sentiment_score: hasFriction ? -0.75 : 0.8,
        churn_risk_delta: hasFriction ? 0.35 : -0.20,
        adjusted_probability: hasFriction ? 0.87 : 0.20,
        friction_keywords: hasFriction ? ['ticket escalation', 'renewal risk'] : ['positive sentiment'],
        recommended_playbook: hasFriction ? 'Executive CS Escalation & 1-Year Contract Lock' : 'Account Expansion',
        created_at: new Date().toISOString(),
      };
    }
  },

  async getCustomerReviews(userId?: number | string): Promise<{ reviews: CustomerReviewAnalysisResponse[] }> {
    try {
      const activeUserId = userId ?? getActiveUserId();
      const res = await fetch(`/api/reviews?user_id=${activeUserId}`);
      if (!res.ok) throw new Error('Failed to fetch reviews.');
      return await res.json();
    } catch (err) {
      return { reviews: [] };
    }
  },

  async seedSampleReviews(userId?: number | string, organization?: string): Promise<{ success: boolean; count: number }> {
    const activeUserId = userId ?? getActiveUserId();
    const res = await fetch(`/api/reviews/seed?user_id=${activeUserId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: activeUserId, organization }),
    });
    if (!res.ok) throw new Error('Failed to seed sample reviews.');
    return await res.json();
  },

  // Executive Dashboard
  async getDashboardSummary(): Promise<ExecutiveDashboardSummary> {
    return mockHandlers.getDashboardSummary();
  },

  // Dataset Upload & Quality
  async uploadDataset(file: File | null, userId?: number | string): Promise<DatasetUploadResponse> {
    try {
      const activeUserId = userId ?? getActiveUserId();
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      formData.append('user_id', String(activeUserId));
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      return {
        dataset_id: data.dataset_id,
        file_name: data.file_name,
        file_size_bytes: data.file_size_bytes,
        row_count: data.row_count,
        column_count: data.column_count,
        status: data.status,
        uploaded_at: data.uploaded_at,
      };
    } catch (err) {
      return mockHandlers.uploadDataset(file);
    }
  },

  async getDataQuality(datasetId?: string): Promise<DataQualityProfile> {
    return mockHandlers.getDataQualityProfile(datasetId);
  },

  // Model Training & Evaluation
  async trainModel(algorithm: string = 'xgboost'): Promise<ModelTrainResponse> {
    return mockHandlers.trainModel(algorithm);
  },

  async getModelEvaluation(modelId?: string): Promise<ModelEvaluationResponse> {
    return mockHandlers.getModelEvaluation(modelId);
  },

  // Customers (Live SQLite with per-user scoping)
  async getCustomers(options?: {
    page?: number;
    pageSize?: number;
    search?: string;
    riskLevel?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    userId?: number | string;
  }): Promise<CustomerBatchListResponse> {
    try {
      const activeUserId = options?.userId ?? getActiveUserId();
      const params = new URLSearchParams();
      params.set('user_id', String(activeUserId));
      if (options?.page) params.set('page', String(options.page));
      if (options?.pageSize) params.set('pageSize', String(options.pageSize));
      if (options?.search) params.set('search', options.search);
      if (options?.riskLevel) params.set('riskLevel', options.riskLevel);
      if (options?.sortBy) params.set('sortBy', options.sortBy);
      if (options?.sortDir) params.set('sortDir', options.sortDir);

      const res = await fetch(`/api/customers?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch customers');
      return await res.json();
    } catch (err) {
      return mockHandlers.getCustomers(options);
    }
  },

  async seedSampleCustomers(userId?: number | string): Promise<{ success: boolean; count: number; message?: string }> {
    const activeUserId = userId ?? getActiveUserId();
    const res = await fetch(`/api/customers/seed?user_id=${activeUserId}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to seed sample customers');
    return await res.json();
  },

  async clearCustomerWorkspace(userId?: number | string): Promise<{ success: boolean }> {
    const activeUserId = userId ?? getActiveUserId();
    const res = await fetch(`/api/customers/seed?user_id=${activeUserId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to clear customer workspace');
    return await res.json();
  },

  async getCustomerDetail(id: string): Promise<CustomerDetailResponse> {
    return mockHandlers.getCustomerDetail(id);
  },

  // Predictions & Simulation
  async getPrediction(params: PredictionRequest): Promise<PredictionResponse> {
    return mockHandlers.getPrediction(params);
  },

  async simulateWhatIf(params: WhatIfSimulationRequest): Promise<WhatIfSimulationResponse> {
    return mockHandlers.simulateWhatIf(params);
  },

  // Business Impact
  async getBusinessImpact(): Promise<BusinessImpactSummary> {
    return mockHandlers.getBusinessImpact();
  },

  // Test error simulator toggle
  setSimulateError(enabled: boolean) {
    setForceError(enabled);
  },

  getIsSimulatingError(): boolean {
    return getForceError();
  },
};
