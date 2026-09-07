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
      // Client-side fallback if fetch is unavailable
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
      const res = await fetch('/api/reviews/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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

  async getCustomerReviews(): Promise<{ reviews: CustomerReviewAnalysisResponse[] }> {
    try {
      const res = await fetch('/api/reviews');
      if (!res.ok) throw new Error('Failed to fetch reviews.');
      return await res.json();
    } catch (err) {
      return { reviews: [] };
    }
  },

  // Executive Dashboard
  async getDashboardSummary(): Promise<ExecutiveDashboardSummary> {
    return mockHandlers.getDashboardSummary();
  },

  // Dataset Upload & Quality
  async uploadDataset(file: File | null): Promise<DatasetUploadResponse> {
    return mockHandlers.uploadDataset(file);
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

  // Customers
  async getCustomers(options?: {
    page?: number;
    pageSize?: number;
    search?: string;
    riskLevel?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
  }): Promise<CustomerBatchListResponse> {
    return mockHandlers.getCustomers(options);
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
