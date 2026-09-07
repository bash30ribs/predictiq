'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { apiClient } from '@/lib/api';
import { BusinessImpactSummary, RetentionScenario } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { formatCurrency, formatPercent } from '@/lib/utils';
import {
  TrendingDown,
  DollarSign,
  Users,
  PieChart as PieIcon,
  ShieldCheck,
  Target,
  ArrowRight,
  Calculator,
  Download,
} from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';

export default function BusinessImpactPage() {
  const { isEasyMode } = useAppStore();
  const [impact, setImpact] = useState<BusinessImpactSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Selected Top-N scenario index (0: Top 25, 1: Top 50, 2: Top 100, 3: Top 250)
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(1);

  const fetchImpactSummary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.getBusinessImpact();
      setImpact(res);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch business impact and revenue-at-risk projections.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImpactSummary();
  }, []);

  const activeScenario: RetentionScenario | null =
    impact && impact.retention_scenarios[selectedScenarioIndex]
      ? impact.retention_scenarios[selectedScenarioIndex]
      : null;

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
                <span>Easy Mode: Money & Savings</span>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                  Plain English
                </span>
              </div>
              <p className="text-slate-700 mt-1 leading-relaxed">
                Here is a simple look at your company's revenue: <strong>how much total money customers pay us</strong>, <strong>how much money we might lose</strong> if unhappy customers cancel, and <strong>how much profit we make by reaching out to save them</strong>!
              </p>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {isEasyMode ? "Money & Savings Overview" : "Business Impact & Revenue at Risk"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEasyMode
                ? "See how much revenue is in danger and calculate how much money you can save with simple customer check-ins."
                : "Portfolio ARR vulnerability, segment exposure, and return on investment (ROI) for targeted retention campaigns."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/customers">
              <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                {isEasyMode ? "See Customers Who Need Help" : "Review Priority Accounts"}
              </Button>
            </Link>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <ErrorBanner
            message={error}
            onRetry={fetchImpactSummary}
            isRetrying={isLoading}
          />
        )}

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <Skeleton className="h-72 w-full" />
          </div>
        ) : impact ? (
          <>
            {/* Top 4 Impact KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-lg p-5">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span>{isEasyMode ? "Total Annual Income" : "Total Monitored ARR"}</span>
                  <DollarSign className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-2xl font-bold text-slate-900 tracking-tight">
                  {formatCurrency(impact.total_portfolio_arr)}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {isEasyMode ? "Monthly: " : "Monthly MRR: "}{formatCurrency(impact.total_portfolio_mrr)}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-5">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span>{isEasyMode ? "Money We Might Lose" : "Total Annual ARR at Risk"}</span>
                  <TrendingDown className="w-4 h-4 text-[#9E2A2B]" />
                </div>
                <div className="text-2xl font-bold text-[#9E2A2B] tracking-tight">
                  {formatCurrency(impact.arr_at_risk)}
                </div>
                <div className="text-[11px] text-[#9E2A2B] font-medium mt-1">
                  {isEasyMode ? "Monthly at Risk: " : "Monthly MRR at Risk: "}{formatCurrency(impact.mrr_at_risk)}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-5">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span>{isEasyMode ? "Accounts Needing Care" : "High-Risk Accounts"}</span>
                  <Users className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-2xl font-bold text-slate-900 tracking-tight">
                  {impact.high_risk_customers_count.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {isEasyMode ? "Accounts thinking of leaving" : "12.3% of 7,043 customer accounts"}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-5">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span>{isEasyMode ? "Profit Per $1 Spent" : "Retention Campaign ROI"}</span>
                  <Target className="w-4 h-4 text-[#2E6B4E]" />
                </div>
                <div className="text-2xl font-bold text-[#2E6B4E] tracking-tight">
                  {activeScenario?.net_roi_multiple.toFixed(1)}x
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {isEasyMode ? `Save ${activeScenario?.target_top_n} accounts` : `Projected on Top ${activeScenario?.target_top_n} accounts`}
                </div>
              </div>
            </div>

            {/* Interactive Top-N Intervention ROI Calculator */}
            <Card>
              <CardHeader>
                <div>
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-[#12233D]" />
                    <CardTitle>
                      {isEasyMode ? "How Many Customers Do You Want to Save?" : "Top-N Executive Intervention & ROI Scenario Engine"}
                    </CardTitle>
                  </div>
                  <CardDescription>
                    {isEasyMode
                      ? "Pick how many customers you want to contact. See how much money you protect and what profit you make!"
                      : "Model the financial return of concentrating executive customer success outreach on the highest revenue-at-risk accounts"}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Scenario Selector Chips */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700 mr-2">
                    Intervention Target Cohort:
                  </span>
                  {impact.retention_scenarios.map((sc, idx) => (
                    <button
                      key={sc.target_top_n}
                      onClick={() => setSelectedScenarioIndex(idx)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                        selectedScenarioIndex === idx
                          ? 'bg-[#12233D] text-white border-[#12233D] shadow-xs font-semibold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Target Top {sc.target_top_n} Accounts
                    </button>
                  ))}
                </div>

                {/* Scenario Outcome Metrics Grid */}
                {activeScenario && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="p-3 bg-white rounded-md border border-slate-200">
                      <span className="text-[11px] text-slate-500 font-medium block mb-1">
                        Expected Success Rate
                      </span>
                      <span className="text-xl font-bold text-slate-900">
                        {activeScenario.success_rate_pct}%
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {Math.round((activeScenario.target_top_n * activeScenario.success_rate_pct) / 100)} accounts saved
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-md border border-[#A3D9BE] bg-[#EBF5F0]/30">
                      <span className="text-[11px] text-[#2E6B4E] font-semibold block mb-1">
                        Protected Monthly MRR
                      </span>
                      <span className="text-xl font-bold text-[#2E6B4E]">
                        {formatCurrency(activeScenario.mrr_saved)}
                      </span>
                      <span className="text-[10px] text-slate-600 block mt-0.5">
                        Protected ARR: {formatCurrency(activeScenario.arr_saved)}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-md border border-slate-200">
                      <span className="text-[11px] text-slate-500 font-medium block mb-1">
                        Program Outreach Cost
                      </span>
                      <span className="text-xl font-bold text-slate-800">
                        {formatCurrency(activeScenario.estimated_program_cost)}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        ~{formatCurrency(activeScenario.estimated_program_cost / activeScenario.target_top_n)} per account
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-md border border-slate-200">
                      <span className="text-[11px] text-slate-500 font-medium block mb-1">
                        Net Program ROI Multiple
                      </span>
                      <span className="text-xl font-bold text-[#12233D]">
                        {activeScenario.net_roi_multiple.toFixed(1)}x
                      </span>
                      <span className="text-[10px] text-[#2E6B4E] font-semibold block mt-0.5">
                        +{formatCurrency(activeScenario.arr_saved - activeScenario.estimated_program_cost)} net gain
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Breakdown Tables: By Customer Segment & By Contract Duration */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Table 1: Segment Exposure (6 cols) */}
              <div className="lg:col-span-6">
                <Card>
                  <CardHeader>
                    <div>
                      <CardTitle>Revenue at Risk by Customer Segment</CardTitle>
                      <CardDescription>
                        Concentration of churn risk across business tiers
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-4">Segment</th>
                          <th className="py-2.5 px-4">Accounts at Risk</th>
                          <th className="py-2.5 px-4">Monthly MRR</th>
                          <th className="py-2.5 px-4 text-right">Avg Churn Prob</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-normal">
                        {impact.segments.map((seg) => (
                          <tr key={seg.segment} className="hover:bg-slate-50/70">
                            <td className="py-2.5 px-4 font-semibold text-slate-900">
                              {seg.segment}
                            </td>
                            <td className="py-2.5 px-4 text-slate-700">
                              {seg.customers_at_risk.toLocaleString()} accounts
                            </td>
                            <td className="py-2.5 px-4 font-mono font-medium text-slate-900">
                              {formatCurrency(seg.mrr_at_risk)}
                            </td>
                            <td className="py-2.5 px-4 text-right font-mono font-bold text-[#9E2A2B]">
                              {formatPercent(seg.avg_churn_prob)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

              {/* Table 2: Contract Exposure (6 cols) */}
              <div className="lg:col-span-6">
                <Card>
                  <CardHeader>
                    <div>
                      <CardTitle>Vulnerability by Contract Commitment</CardTitle>
                      <CardDescription>
                        Disproportionate exposure among flexible month-to-month contracts
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-4">Contract Agreement</th>
                          <th className="py-2.5 px-4">Accounts at Risk</th>
                          <th className="py-2.5 px-4">Monthly MRR at Risk</th>
                          <th className="py-2.5 px-4 text-right">% of Total Risk</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-normal">
                        {impact.contract_breakdown.map((item) => {
                          const pct = ((item.mrr_at_risk / impact.mrr_at_risk) * 100).toFixed(1);
                          return (
                            <tr key={item.contract} className="hover:bg-slate-50/70">
                              <td className="py-2.5 px-4 font-semibold text-slate-900">
                                {item.contract}
                              </td>
                              <td className="py-2.5 px-4 text-slate-700">
                                {item.customers_at_risk.toLocaleString()}
                              </td>
                              <td className="py-2.5 px-4 font-mono font-medium text-slate-900">
                                {formatCurrency(item.mrr_at_risk)}
                              </td>
                              <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                                {pct}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </AppShell>
  );
}
