'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { apiClient } from '@/lib/api';
import { CustomerDetailResponse } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RiskBadge, ConfidenceBadge } from '@/components/ui/Badge';
import { RiskGauge } from '@/components/charts/RiskGauge';
import { FactorBarChart } from '@/components/charts/FactorBarChart';
import { ActionPanel } from '@/components/customer/ActionPanel';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { formatCurrency, formatPercent } from '@/lib/utils';
import {
  ArrowLeft,
  Sliders,
  Mail,
  User,
  Calendar,
  CreditCard,
  PhoneCall,
  Clock,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';

export default function CustomerDetailPage() {
  const { isEasyMode } = useAppStore();
  const params = useParams();
  const router = useRouter();
  const customerId = (params?.id as string) || 'C1024';

  const [detail, setDetail] = useState<CustomerDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCustomer = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.getCustomerDetail(customerId);
      setDetail(res);
    } catch (err: any) {
      setError(err?.message || `Failed to fetch customer profile for ${customerId}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomer();
  }, [customerId]);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Back navigation & Action bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/customers">
              <Button size="sm" variant="outline" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
                Back to Directory
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  {isLoading ? 'Loading Customer Profile...' : detail?.customer.name}
                </h1>
                <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {customerId}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {detail?.customer.segment} • Account Managed by {detail?.customer.account_manager || 'Sarah Jenkins'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/simulation?id=${customerId}`}>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Sliders className="w-3.5 h-3.5" />}
              >
                {isEasyMode ? "⚡ Test How to Save Them" : "Simulate Retention Strategy"}
              </Button>
            </Link>
          </div>
        </div>

        {/* Easy Mode Banner */}
        {isEasyMode && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 via-amber-50/70 to-emerald-50 border border-amber-200/90 shadow-xs flex items-start gap-3.5 animate-fadeIn">
            <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-800 text-sm font-bold shadow-2xs">
              💡
            </div>
            <div className="flex-1 text-xs">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>Easy Mode: Customer Deep-Dive</span>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                  Plain English
                </span>
              </div>
              <p className="text-slate-700 mt-1 leading-relaxed">
                Why is <strong>{detail?.customer.name || customerId}</strong> thinking of leaving? In the chart below, see the exact reasons: <strong>too many unresolved support tickets</strong> and <strong>lack of an annual discount</strong>. Click <strong>&quot;Test How to Save Them&quot;</strong> to see how offering a 1-year deal drops their churn risk!
              </p>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <ErrorBanner
            message={error}
            onRetry={loadCustomer}
            isRetrying={isLoading}
          />
        )}

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full lg:col-span-2" />
            </div>
            <Skeleton className="h-72 w-full" />
          </div>
        ) : detail ? (
          <>
            {/* Top Grid: Prediction Card (1 col) + Profile Card (2 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Prediction Card (5 cols) */}
              <div className="lg:col-span-5">
                <Card className="h-full flex flex-col justify-between">
                  <CardHeader>
                    <div>
                      <CardTitle>
                        {isEasyMode ? "Chance of Leaving (Risk Score)" : "ML Churn Risk Assessment"}
                      </CardTitle>
                      <CardDescription>
                        {isEasyMode
                          ? "Calculated based on their recent usage, payments, and support history."
                          : "Calibrated probability score generated by XGBoost v2.1"}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-2">
                    <RiskGauge
                      probability={detail.prediction.probability}
                      riskLevel={detail.prediction.risk_level}
                      confidence={detail.prediction.confidence}
                      size={210}
                    />

                    <div className="w-full mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-center text-xs">
                      <div className="p-2 rounded bg-slate-50 border border-slate-100">
                        <span className="text-slate-500 text-[11px] block">Outcome Flag</span>
                        <span className="font-bold text-[#9E2A2B]">
                          {detail.prediction.prediction}
                        </span>
                      </div>
                      <div className="p-2 rounded bg-slate-50 border border-slate-100">
                        <span className="text-slate-500 text-[11px] block">Model Confidence</span>
                        <span className="font-bold text-slate-800">
                          {detail.prediction.confidence}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Forecast horizon: Next 30–60 days</span>
                    <span className="font-medium text-slate-700">Contract expiry sensitive</span>
                  </div>
                </Card>
              </div>

              {/* Customer Profile & Billing Attributes (7 cols) */}
              <div className="lg:col-span-7">
                <Card className="h-full">
                  <CardHeader>
                    <div>
                      <CardTitle>Account Profile & Service Parameters</CardTitle>
                      <CardDescription>
                        Current contract commitment, utilization, and ticket history
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                          Contract Agreement
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {detail.customer.contract}
                        </div>
                        <div className="text-[10px] text-[#9E2A2B] font-medium mt-0.5">
                          {detail.customer.contract === 'Month-to-month' ? 'High switching ease' : 'Locked'}
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Tenure
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {detail.customer.tenure} Months
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Since {detail.customer.joined_date}
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                          Monthly Spend (MRR)
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {formatCurrency(detail.customer.monthly_charges)}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          ARR: {formatCurrency(detail.customer.monthly_charges * 12)}
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                          <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                          Support Calls (30d)
                        </div>
                        <div className="text-sm font-bold text-[#9E2A2B]">
                          {detail.customer.support_calls} Inquiries
                        </div>
                        <div className="text-[10px] text-[#9E2A2B] mt-0.5 font-medium">
                          Critical escalation trigger
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                          Payment Method
                        </div>
                        <div className="text-sm font-semibold text-slate-900 truncate">
                          {detail.customer.payment_method}
                        </div>
                        <div className="text-[10px] text-[#2E6B4E] mt-0.5 font-medium">
                          Status: {detail.customer.billing_status}
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Last CS Touchpoint
                        </div>
                        <div className="text-sm font-semibold text-slate-900">
                          {detail.customer.last_interaction}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          5 days ago
                        </div>
                      </div>
                    </div>

                    {/* Contact & Account Manager */}
                    <div className="p-3 bg-slate-50/70 rounded-md border border-slate-200/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">Primary Contact:</span>
                        <span className="font-semibold text-slate-900">{detail.customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">CS Lead:</span>
                        <span className="font-semibold text-slate-900">{detail.customer.account_manager}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Middle Row: Explainability (Screen 7 Top-Factors Bar Chart & Narratives) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Factor Attribution Chart (6 cols) */}
              <div className="lg:col-span-6">
                <Card className="h-full">
                  <CardHeader>
                    <div>
                      <CardTitle>Feature Impact Attribution (SHAP)</CardTitle>
                      <CardDescription>
                        Quantified contribution to churn risk. Amber pushes toward churn, Green promotes retention.
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <FactorBarChart factors={detail.prediction.top_factors} />
                  </CardContent>
                </Card>
              </div>

              {/* Plain-Language Business Explanation (6 cols) */}
              <div className="lg:col-span-6">
                <Card className="h-full flex flex-col justify-between">
                  <CardHeader>
                    <div>
                      <CardTitle>Decision Intelligence Narrative</CardTitle>
                      <CardDescription>
                        Plain-language synthesis translated from the underlying model trees
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-md text-xs text-slate-900 font-medium leading-relaxed">
                      {detail.explanation.summary}
                    </div>

                    <div className="space-y-2 text-xs">
                      <span className="font-semibold text-slate-800 block">Identified Drivers:</span>
                      {detail.explanation.narratives.map((nar, i) => (
                        <div key={i} className="flex items-start gap-2 text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C77D2E] shrink-0 mt-1.5" />
                          <span>{nar}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Root cause: Low switching friction combined with technical ticket backlog</span>
                  </div>
                </Card>
              </div>
            </div>

            {/* Bottom Row: Recommended Retention Playbook (Screen 7) */}
            <ActionPanel
              recommendations={detail.recommendations}
              customerId={detail.customer.customer_id}
            />
          </>
        ) : null}
      </div>
    </AppShell>
  );
}
