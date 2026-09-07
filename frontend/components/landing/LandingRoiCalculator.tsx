'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Calculator, ArrowRight, TrendingUp, ShieldCheck, DollarSign } from 'lucide-react';

export const LandingRoiCalculator: React.FC = () => {
  const [accountCount, setAccountCount] = useState<number>(1850);
  const [avgAcv, setAvgAcv] = useState<number>(28000);
  const [churnRate, setChurnRate] = useState<number>(14.5);

  // Math models
  const totalArr = accountCount * avgAcv;
  const atRiskArr = totalArr * (churnRate / 100);
  const savedArr = atRiskArr * 0.72; // 72% targeted retention save rate
  const annualInvestment = Math.max(35000, totalArr * 0.015);
  const netRoiMultiple = Math.max(2.5, savedArr / annualInvestment);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(2)}M`;
    }
    return `$${Math.round(val).toLocaleString()}`;
  };

  return (
    <section id="roi" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto relative">
      {/* Background Gaussian ambient orbs */}
      <div className="absolute top-1/2 left-10 w-96 h-96 rounded-full bg-[#12233D]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#C77D2E]/10 blur-[140px] pointer-events-none" />

      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-800 border border-slate-200">
          <Calculator className="w-3.5 h-3.5 text-[#C77D2E]" />
          <span>Executive Business Impact Model</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Quantify Your Protected ARR in Seconds
        </h2>
        <p className="text-slate-600 text-sm sm:text-base font-normal">
          Adjust your portfolio size and average contract value below to see how our proactive 60-day early warning system turns churn losses into retained revenue.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Sliders Input Panel */}
        <div className="lg:col-span-7 bg-white/80 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900">Portfolio Parameters</span>
              <span className="text-xs text-slate-500 font-medium">B2B SaaS / Enterprise</span>
            </div>

            {/* Slider 1: Managed Accounts */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <label htmlFor="accounts-slider">Active Enterprise Accounts</label>
                <span className="text-sm font-bold text-[#12233D] px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                  {accountCount.toLocaleString()} accounts
                </span>
              </div>
              <input
                id="accounts-slider"
                type="range"
                min={200}
                max={10000}
                step={50}
                value={accountCount}
                onChange={(e) => setAccountCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#12233D]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>200</span>
                <span>5,000</span>
                <span>10,000</span>
              </div>
            </div>

            {/* Slider 2: ACV */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <label htmlFor="acv-slider">Average Annual Contract Value (ACV)</label>
                <span className="text-sm font-bold text-[#12233D] px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                  ${avgAcv.toLocaleString()} / yr
                </span>
              </div>
              <input
                id="acv-slider"
                type="range"
                min={5000}
                max={100000}
                step={1000}
                value={avgAcv}
                onChange={(e) => setAvgAcv(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#12233D]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>$5,000</span>
                <span>$50,000</span>
                <span>$100,000</span>
              </div>
            </div>

            {/* Slider 3: Baseline Churn */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <label htmlFor="churn-slider">Baseline Annual Churn Rate</label>
                <span className="text-sm font-bold text-[#C77D2E] px-2 py-0.5 bg-amber-50 rounded border border-amber-200">
                  {churnRate.toFixed(1)}%
                </span>
              </div>
              <input
                id="churn-slider"
                type="range"
                min={5}
                max={35}
                step={0.5}
                value={churnRate}
                onChange={(e) => setChurnRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#C77D2E]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>5%</span>
                <span>20%</span>
                <span>35%</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2E6B4E] shrink-0" />
            <span>
              Benchmark based on 45,000+ audited B2B subscriptions across SaaS and enterprise telecom.
            </span>
          </div>
        </div>

        {/* Calculated Results Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#12233D] to-[#1C355E] text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                Projected Annual Impact
              </span>
              <span className="px-2 py-0.5 rounded bg-[#2E6B4E]/30 text-[#8CE2B4] text-[11px] font-bold border border-[#2E6B4E]/40">
                72% Intervention Rate
              </span>
            </div>

            {/* Total ARR Overview */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[11px] text-slate-300 block">Total Portfolio ARR</span>
                <span className="text-xl sm:text-2xl font-bold text-white">
                  {formatCurrency(totalArr)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-300 block">At-Risk ARR Before AI</span>
                <span className="text-xl sm:text-2xl font-bold text-[#F87171]">
                  {formatCurrency(atRiskArr)}
                </span>
              </div>
            </div>

            {/* Highlighted Protected ARR */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold">
                <TrendingUp className="w-4 h-4 text-[#C77D2E]" />
                <span>PredictIQ Protected ARR</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                {formatCurrency(savedArr)}
              </div>
              <p className="text-[11px] text-slate-300">
                ARR preserved annually by triggering targeted automated playbooks 60 days before contract expiry.
              </p>
            </div>

            {/* Net ROI Multiple */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-slate-300">Net Expected ROI Multiple:</span>
              <span className="text-lg font-bold text-[#8CE2B4]">
                {netRoiMultiple.toFixed(1)}x Return
              </span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-4">
            <Link href="/impact" className="w-full block">
              <Button
                variant="secondary"
                size="lg"
                className="w-full text-[#12233D] font-bold shadow-md hover:bg-slate-100"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Inspect Portfolio in Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
