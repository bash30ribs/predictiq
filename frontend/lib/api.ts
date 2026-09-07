/**
 * PredictIQ API Layer
 * Single integration entry point for the frontend.
 * Currently backed by frontend/mocks/handlers.ts.
 * Swapping to FastAPI requires modifying only this file.
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
} from '@/lib/types';
import { mockHandlers, setForceError, getForceError } from '@/mocks/handlers';

export const apiClient = {
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
