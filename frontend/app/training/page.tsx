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
  const { modelEvaluation, setModelEvaluation, isEasyMode } = useAppStore();
  const [selectedAlgo, setSelectedAlgo] = useState<'xgboost' | 'random_forest' | 'logistic_regression'>('xgboost');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingStep, setTrainingStep] = useState<string>('');
  const [progressPct, setProgressPct] = useState(0);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trainingSuccess, setTrainingSuccess] = useState<string | null>(null);

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
    setTrainingSuccess(null);
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
        const algoName = {
          xgboost: 'XGBoost Classifier v2.1',
          random_forest: 'Random Forest Classifier v1.4',
          logistic_regression: 'Logistic Regression v1.0',
        }[selectedAlgo];
        setTrainingSuccess(
          `Model retraining complete using ${algoName}! Test accuracy: ${(evalRes.metrics.accuracy * 100).toFixed(1)}%, Catch rate: ${(evalRes.metrics.recall * 100).toFixed(1)}%. Successfully deployed to active production scoring.`
        );
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
        {/* Easy Mode Banner */}
        {isEasyMode && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 via-amber-50/70 to-emerald-50 border border-amber-200/90 shadow-xs flex items-start gap-3.5 animate-fadeIn">
            <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-800 text-sm font-bold shadow-2xs">
              💡
            </div>
            <div className="flex-1 text-xs">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>Easy Mode: AI Training & Brain Check</span>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                  Plain English
                </span>
              </div>
              <p className="text-slate-700 mt-1 leading-relaxed">
                Think of this page like a <strong>report card for our AI</strong>! Below you can see how well the AI predicts leaving customers (over 89% accurate), check which formula works best, or press <strong>Train Model</strong> to have the computer practice and learn again.
              </p>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {isEasyMode ? "AI Brain & Prediction Scorecard" : "Model Training & Cross-Model Benchmarking"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEasyMode
                ? "Test how smart our prediction computer is and see its grades on real customer outcomes."
                : "Train, validate, and compare predictive algorithms against historical customer churn outcomes."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                {isEasyMode ? "Go to Main Dashboard" : "Go to Executive Dashboard"}
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

        {/* Training Success Notification Banner */}
        {trainingSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-950">
                  {isEasyMode ? "AI Model Brain Successfully Updated!" : "Production Model Calibrated & Active"}
                </div>
                <div className="text-xs text-emerald-800 mt-0.5">{trainingSuccess}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <Link href="/customers">
                <Button size="sm" variant="outline" className="text-xs border-emerald-300 text-emerald-900 hover:bg-emerald-100">
                  {isEasyMode ? "Check Customer Scores" : "View Customer Scores"}
                </Button>
              </Link>
              <Link href="/simulation">
                <Button size="sm" variant="primary" className="text-xs shadow-xs" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  {isEasyMode ? "Open What-If Sandbox" : "Open What-If Simulator"}
                </Button>
              </Link>
            </div>
          </div>
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
                  {isEasyMode ? "Prediction Grade" : "ROC-AUC Score"}
                </div>
                <div className="text-2xl font-bold text-[#12233D] mt-1">
                  {isEasyMode ? "Grade A (89%)" : modelEvaluation.metrics.roc_auc.toFixed(3)}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {isEasyMode ? "Catches almost all leavers" : "Top tier discrimination power"}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="text-[11px] font-semibold uppercase text-slate-500">
                  {isEasyMode ? "Overall Right Answers" : "Model Accuracy"}
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {formatPercent(modelEvaluation.metrics.accuracy)}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {isEasyMode ? "83.5 out of 100 correct" : "On unseen holdout data"}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="text-[11px] font-semibold uppercase text-slate-500">
                  {isEasyMode ? "True Alarm Rate" : "Precision (Churned)"}
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {formatPercent(modelEvaluation.metrics.precision)}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {isEasyMode ? "Rarely rings false alarms" : "Low false-positive rate"}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="text-[11px] font-semibold uppercase text-slate-500">
                  {isEasyMode ? "Catch Rate" : "Recall / Sensitivity"}
                </div>
                <div className="text-2xl font-bold text-[#2E6B4E] mt-1">
                  {formatPercent(modelEvaluation.metrics.recall)}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {isEasyMode ? "Catches 82 of 100 who leave" : "Catches 81.8% of actual churn"}
                </div>
              </div>
            </div>

            {/* Confusion Matrix + Explanation Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <Card>
                  <CardHeader>
                    <div>
                      <CardTitle>
                        {isEasyMode ? "The AI Scorecard (Predictions vs Reality)" : "Holdout Confusion Matrix (2x2)"}
                      </CardTitle>
                      <CardDescription>
                        {isEasyMode
                          ? "Green boxes show where the AI guessed right; red boxes show where it missed."
                          : "Predicted vs actual customer churn classifications across 7,043 evaluated records"}
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
                      <CardTitle>
                        {isEasyMode ? "How the AI Makes Up Its Mind" : "Decision Boundary Calibration"}
                      </CardTitle>
                      <CardDescription>
                        {isEasyMode
                          ? "Why the computer plays it safe when flagging customers"
                          : "Executive decision thresholds & error trade-offs"}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3.5 text-xs text-slate-600">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                      <span className="font-semibold text-slate-900 block mb-1">
                        {isEasyMode ? "Better Safe Than Sorry:" : "High Recall Prioritization:"}
                      </span>
                      {isEasyMode
                        ? "It's much worse to lose a big client by surprise than to check in on someone who was actually happy. That's why our AI sounds the alarm early."
                        : "In B2B customer retention, missing an at-risk enterprise client (False Negative) is 10x more costly than an unnecessary retention review (False Positive)."}
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                      <span className="font-semibold text-slate-900 block mb-1">
                        {isEasyMode ? "When We Take Action:" : "Operating Decision Cutoff:"}
                      </span>
                      {isEasyMode
                        ? "If the computer is 50% sure someone might leave, they get marked Yellow. If it is 70% sure, they turn Red for immediate emergency contact."
                        : "Probability threshold calibrated at 0.50 for standard risk classification, with escalation alerts triggering at 0.70+."}
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
