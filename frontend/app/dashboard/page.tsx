'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAppStore } from '@/store/useAppStore';
import { apiClient } from '@/lib/api';
import { ExecutiveDashboardSummary, CustomerListItem } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RiskBadge } from '@/components/ui/Badge';
import { ChurnTrendChart } from '@/components/charts/ChurnTrendChart';
import { RiskDonutChart } from '@/components/charts/RiskDonutChart';
import { KpiCardSkeleton, ChartSkeleton } from '@/components/ui/Skeleton';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { formatCurrency, formatPercent } from '@/lib/utils';
import {
  Users,
  AlertTriangle,
  DollarSign,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  Sparkles,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { dashboardSummary, setDashboardSummary } = useAppStore();
  const [summary, setSummary] = useState<ExecutiveDashboardSummary | null>(dashboardSummary);
  const [highRiskAccounts, setHighRiskAccounts] = useState<CustomerListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sumRes, custRes] = await Promise.all([
        apiClient.getDashboardSummary(),
        apiClient.getCustomers({ pageSize: 5, riskLevel: 'HIGH', sortBy: 'probability', sortDir: 'desc' }),
      ]);
      setSummary(sumRes);
      setDashboardSummary(sumRes);
      setHighRiskAccounts(custRes.customers);
    } catch (err: any) {
      setError(err?.message || "Unable to fetch dashboard intelligence metrics.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Executive Churn Intelligence
              </h1>
              <span className="text-[11px] font-semibold bg-[#EBF5F0] text-[#2E6B4E] border border-[#A3D9BE] px-2 py-0.5 rounded">
                Live Forecast
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Portfolio health overview, predicted revenue exposure, and prioritized customer intervention targets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/impact">
              <Button size="sm" variant="outline" rightIcon={<TrendingDown className="w-3.5 h-3.5 text-[#9E2A2B]" />}>
                View Revenue at Risk
              </Button>
            </Link>
            <Link href="/customers">
              <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Review At-Risk Accounts
              </Button>
            </Link>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <ErrorBanner
            message={error}
            onRetry={loadDashboardData}
            isRetrying={isLoading}
          />
        )}

        {/* 4 Executive KPI Cards */}
        {isLoading && !summary ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <KpiCardSkeleton key={i} />
            ))}
          </div>
        ) : summary ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Total Monitored Customers */}
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-lg p-5 shadow-[0_4px_20px_-2px_rgba(18,35,61,0.04)]">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                <span>Active Customer Accounts</span>
                <Users className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">
                {summary.total_customers.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <span className="text-[#2E6B4E] font-semibold">+3.8%</span>
                <span>portfolio growth this quarter</span>
              </div>
            </div>

            {/* KPI 2: At-Risk Customer Count */}
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-lg p-5 shadow-[0_4px_20px_-2px_rgba(18,35,61,0.04)]">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                <span>Accounts at High Risk</span>
                <AlertTriangle className="w-4 h-4 text-[#9E2A2B]" />
              </div>
              <div className="text-2xl font-bold text-[#9E2A2B] tracking-tight">
                {summary.at_risk_count.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-600 mt-1">
                <span className="font-semibold text-[#9E2A2B]">{summary.at_risk_percentage}%</span> of total customer base
              </div>
            </div>

            {/* KPI 3: Monthly Revenue at Risk */}
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-lg p-5 shadow-[0_4px_20px_-2px_rgba(18,35,61,0.04)]">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                <span>Monthly Revenue at Risk</span>
                <DollarSign className="w-4 h-4 text-[#C77D2E]" />
              </div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">
                {formatCurrency(summary.monthly_revenue_at_risk)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Annualized run rate:{' '}
                <span className="font-semibold text-slate-800">
                  {formatCurrency(summary.monthly_revenue_at_risk * 12)}
                </span>
              </div>
            </div>

            {/* KPI 4: Overall Model Confidence */}
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-lg p-5 shadow-[0_4px_20px_-2px_rgba(18,35,61,0.04)]">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                <span>Model Confidence</span>
                <ShieldCheck className="w-4 h-4 text-[#2E6B4E]" />
              </div>
              <div className="text-2xl font-bold text-[#2E6B4E] tracking-tight">
                {formatPercent(summary.overall_model_confidence)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <span>Based on XGBoost v2.1 (ROC 0.923)</span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Charts Grid: 2 Columns */}
        {isLoading && !summary ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <ChartSkeleton height="h-72" />
            </div>
            <div className="lg:col-span-5">
              <ChartSkeleton height="h-72" />
            </div>
          </div>
        ) : summary ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chart 1: Historical Churn Trend vs ML Forecast (7 cols) */}
            <div className="lg:col-span-7">
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>Portfolio Churn Rate Trend & ML Forecast</CardTitle>
                    <CardDescription>
                      Historical actuals (solid navy) vs machine learning 60-day projection (dashed amber)
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChurnTrendChart data={summary.monthly_trend} />
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Projected Oct churn decline with retention playbook intervention: <strong>-3.3%</strong></span>
                    <Link href="/impact" className="text-[#12233D] font-medium hover:underline flex items-center gap-1">
                      Explore ROI Scenarios <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart 2: Risk Distribution Donut (5 cols) */}
            <div className="lg:col-span-5">
              <Card className="h-full flex flex-col justify-between">
                <CardHeader>
                  <div>
                    <CardTitle>Customer Risk Distribution</CardTitle>
                    <CardDescription>
                      Classification across Low, Medium, and High churn vulnerability
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <RiskDonutChart distribution={summary.risk_distribution} />
                </CardContent>
                <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    864 critical accounts require executive touch
                  </span>
                  <Link href="/customers?risk=HIGH">
                    <Button size="sm" variant="outline" className="text-xs">
                      Filter High Risk
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        ) : null}

        {/* Priority Escalations Table: Top 5 Highest Risk Accounts */}
        <Card>
          <CardHeader>
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#9E2A2B]" />
                <CardTitle>Immediate Executive Attention Required</CardTitle>
              </div>
              <CardDescription>
                Highest churn probability enterprise accounts requiring immediate CS outreach
              </CardDescription>
            </div>
            <Link href="/customers">
              <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3 h-3" />}>
                View All {summary?.at_risk_count.toLocaleString() || '864'} Accounts
              </Button>
            </Link>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Account ID</th>
                  <th className="py-2.5 px-4">Customer Name</th>
                  <th className="py-2.5 px-4">Contract</th>
                  <th className="py-2.5 px-4">Tenure</th>
                  <th className="py-2.5 px-4">Monthly Spend</th>
                  <th className="py-2.5 px-4">Support Inquiries</th>
                  <th className="py-2.5 px-4">Churn Prob</th>
                  <th className="py-2.5 px-4">Risk Level</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {highRiskAccounts.map((c) => (
                  <tr key={c.customer_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-medium text-slate-700">
                      {c.customer_id}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-900">
                      {c.name}
                    </td>
                    <td className="py-2.5 px-4 text-slate-700">{c.contract}</td>
                    <td className="py-2.5 px-4 text-slate-700">{c.tenure} mos</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      {formatCurrency(c.monthly_charges)}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="inline-flex px-1.5 py-0.5 rounded bg-[#FDF2F2] text-[#9E2A2B] font-medium text-[11px]">
                        {c.support_calls} calls
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">
                      {formatPercent(c.probability)}
                    </td>
                    <td className="py-2.5 px-4">
                      <RiskBadge level={c.risk_level} />
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/simulation?id=${c.customer_id}`}>
                          <Button size="sm" variant="ghost" title="Simulate what-if retention offer">
                            <Sliders className="w-3.5 h-3.5 text-slate-500" />
                          </Button>
                        </Link>
                        <Link href={`/customers/${c.customer_id}`}>
                          <Button size="sm" variant="outline" className="text-xs">
                            Detail
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
