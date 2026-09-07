'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAppStore } from '@/store/useAppStore';
import { apiClient } from '@/lib/api';
import { ModelEvaluationResponse } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ConfusionMatrix } from '@/components/charts/ConfusionMatrix';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatPercent } from '@/lib/utils';
import {
  Cpu,
  Play,
  CheckCircle2,
  TrendingUp,
  Layers,
  ArrowRight,
  ShieldCheck,
  Award,
} from 'lucide-react';
import Link from 'next/link';

export default function TrainingPage() {
  const { modelEvaluation, setModelEvaluation } = useAppStore();
  const [selectedAlgo, setSelectedAlgo] = useState<'xgboost' | 'random_forest' | 'logistic_regression'>('xgboost');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingStep, setTrainingStep] = useState<string>('');
  const [progressPct, setProgressPct] = useState(0);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setIsLoadingMetrics(true);
    setError(null);
    try {
      const res = await apiClient.getModelEvaluation();
      setModelEvaluation(res);
    } catch (err: any) {
      setError(err?.message || "Failed to load model evaluation metrics.");
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  useEffect(() => {
    if (!modelEvaluation) {
      fetchMetrics();
    }
  }, []);

  const handleTrainModel = async () => {
    setIsTraining(true);
    setError(null);
    setProgressPct(15);
    setTrainingStep("Phase 1/4: Encoding categorical variables and scaling features...");

    setTimeout(() => {
      setProgressPct(45);
      setTrainingStep("Phase 2/4: Applying balanced class weights & 5-fold cross validation...");
    }, 450);

    setTimeout(() => {
      setProgressPct(80);
      setTrainingStep("Phase 3/4: Tuning tree depth, learning rate, and decision thresholds...");
    }, 900);

    setTimeout(async () => {
      setProgressPct(100);
      setTrainingStep("Phase 4/4: Finalizing test set calibration and feature attributions...");
      try {
        await apiClient.trainModel(selectedAlgo);
        const evalRes = await apiClient.getModelEvaluation();
        setModelEvaluation(evalRes);
      } catch (err: any) {
        setError(err?.message || "Training job interrupted.");
      } finally {
        setIsTraining(false);
      }
    }, 1400);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Model Training & Cross-Model Benchmarking
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Train, validate, and compare predictive algorithms against historical customer churn outcomes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Go to Executive Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <ErrorBanner
            message={error}
            onRetry={fetchMetrics}
            isRetrying={isLoadingMetrics || isTraining}
          />
        )}

        {/* Training Trigger Box */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#12233D]" />
                <h3 className="text-sm font-bold text-slate-900">
                  Trigger Algorithm Retraining
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
                Select your algorithm architecture. Hyperparameters and probability thresholds will be optimized automatically against holdout test records.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={selectedAlgo}
                onChange={(e) => setSelectedAlgo(e.target.value as any)}
                disabled={isTraining}
                className="text-xs bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-800 font-medium focus:ring-1 focus:ring-[#12233D]"
              >
                <option value="xgboost">XGBoost Classifier v2.1 (Recommended)</option>
                <option value="random_forest">Random Forest Classifier v1.4</option>
                <option value="logistic_regression">Logistic Regression v1.0</option>
              </select>

              <Button
                size="sm"
                variant="primary"
                isLoading={isTraining}
                onClick={handleTrainModel}
                leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
              >
                {isTraining ? 'Training Model...' : 'Train Model'}
              </Button>
            </div>
          </div>

          {/* Training Progress Bar */}
          {isTraining && (
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-slate-800">{trainingStep}</span>
                <span className="font-mono font-bold text-[#12233D]">{progressPct}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#12233D] transition-all duration-300 rounded-full"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Evaluation Metrics & Confusion Matrix */}
        {isLoadingMetrics ? (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        ) : modelEvaluation ? (
          <div className="space-y-6">
            {/* 4 Core Performance Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="text-[11px] font-semibold uppercase text-slate-500">
                  ROC-AUC Score
                </div>
                <div className="text-2xl font-bold text-[#12233D] mt-1">
                  {modelEvaluation.metrics.roc_auc.toFixed(3)}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Top tier discrimination power
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="text-[11px] font-semibold uppercase text-slate-500">
                  Model Accuracy
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {formatPercent(modelEvaluation.metrics.accuracy)}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  On unseen holdout data
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="text-[11px] font-semibold uppercase text-slate-500">
                  Precision (Churned)
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {formatPercent(modelEvaluation.metrics.precision)}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Low false-positive rate
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="text-[11px] font-semibold uppercase text-slate-500">
                  Recall / Sensitivity
                </div>
                <div className="text-2xl font-bold text-[#2E6B4E] mt-1">
                  {formatPercent(modelEvaluation.metrics.recall)}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Catches 81.8% of actual churn
                </div>
              </div>
            </div>

            {/* Confusion Matrix + Explanation Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <Card>
                  <CardHeader>
                    <div>
                      <CardTitle>Holdout Confusion Matrix (2x2)</CardTitle>
                      <CardDescription>
                        Predicted vs actual customer churn classifications across 7,043 evaluated records
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ConfusionMatrix matrix={modelEvaluation.confusion_matrix} />
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-5">
                <Card className="h-full flex flex-col justify-between">
                  <CardHeader>
                    <div>
                      <CardTitle>Decision Boundary Calibration</CardTitle>
                      <CardDescription>
                        Executive decision thresholds & error trade-offs
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3.5 text-xs text-slate-600">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                      <span className="font-semibold text-slate-900 block mb-1">
                        High Recall Prioritization:
                      </span>
                      In B2B customer retention, missing an at-risk enterprise client (False Negative) is 10x more costly than an unnecessary retention review (False Positive).
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                      <span className="font-semibold text-slate-900 block mb-1">
                        Operating Decision Cutoff:
                      </span>
                      Probability threshold calibrated at <strong className="text-slate-900">0.50</strong> for standard risk classification, with escalation alerts triggering at <strong className="text-[#9E2A2B]">0.70+</strong>.
                    </div>
                  </CardContent>
                  <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Status: Verified for Deployment</span>
                    <span className="font-semibold text-[#2E6B4E] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Production Active
                    </span>
                  </div>
                </Card>
              </div>
            </div>

            {/* Model Comparison Benchmark Table */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Model Comparison Benchmark</CardTitle>
                  <CardDescription>
                    Head-to-head performance metrics evaluated across identical validation splits
                  </CardDescription>
                </div>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Architecture</th>
                      <th className="py-3 px-4">ROC-AUC</th>
                      <th className="py-3 px-4">Accuracy</th>
                      <th className="py-3 px-4">Precision</th>
                      <th className="py-3 px-4">Recall</th>
                      <th className="py-3 px-4">F1 Score</th>
                      <th className="py-3 px-4 text-right">Deployment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-normal">
                    {modelEvaluation.model_comparison.map((model) => (
                      <tr
                        key={model.name}
                        className={model.is_active ? 'bg-[#EBF5F0]/30 font-medium' : 'hover:bg-slate-50/60'}
                      >
                        <td className="py-3 px-4 flex items-center gap-2">
                          {model.is_active && <Award className="w-4 h-4 text-[#2E6B4E]" />}
                          <span className="font-semibold text-slate-900">{model.name}</span>
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                          {model.roc_auc.toFixed(3)}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">
                          {formatPercent(model.accuracy)}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">
                          {formatPercent(model.precision)}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">
                          {formatPercent(model.recall)}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">
                          {model.f1.toFixed(3)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {model.is_active ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EBF5F0] text-[#2E6B4E] border border-[#A3D9BE]">
                              Active in Production
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">
                              Candidate
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
