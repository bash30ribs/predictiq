'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { RiskGauge } from '@/components/charts/RiskGauge';
import { RiskBadge } from '@/components/ui/Badge';
import {
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  Sparkles,
  Sliders,
  CheckCircle2,
  Lock,
  Zap,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 px-6 sm:px-12 max-w-7xl mx-auto">
      {/* Ambient Gaussian Blur Orbs */}
      <div className="absolute -top-24 -left-24 w-[580px] h-[580px] rounded-full bg-[#12233D]/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-[520px] h-[520px] rounded-full bg-[#C77D2E]/10 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-24 left-1/3 w-[480px] h-[480px] rounded-full bg-[#2E6B4E]/9 blur-[130px] pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headline & Action */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200 text-xs font-semibold text-slate-800 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#2E6B4E] animate-pulse" />
            <span>AI-Powered Enterprise Retention Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            Turn Customer Churn Into <span className="text-[#12233D]">Predictable ARR</span> Retention
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
            Detect at-risk enterprise accounts <strong>60 days before contract renewal</strong>. Empower Customer Success executives with mathematical SHAP explainability, prescriptive playbooks, and real-time what-if retention simulations.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/register">
              <Button
                size="lg"
                variant="primary"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="shadow-sm"
              >
                Create Enterprise Account
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                leftIcon={<Sparkles className="w-4 h-4 text-[#C77D2E]" />}
              >
                Explore Live Demo Cockpit
              </Button>
            </Link>
          </div>

          {/* Enterprise Trust Indicators */}
          <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2E6B4E]" />
              <span>SOC2 Type II Certified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>256-Bit AES Encryption</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2E6B4E]" />
              <span>SQLite Persistent Storage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#C77D2E]" />
              <span>99.99% Enterprise SLA</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Glassmorphic Cockpit Preview Card */}
        <div className="lg:col-span-5">
          <div className="relative">
            {/* Soft backdrop glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#12233D]/20 to-[#C77D2E]/20 rounded-xl blur-xl opacity-75" />

            <div className="relative bg-white/85 backdrop-blur-xl border border-slate-200/90 rounded-xl p-6 shadow-[0_8px_32px_0_rgba(18,35,61,0.08)] space-y-5">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#9E2A2B] animate-ping" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    High Priority Account Alert
                  </span>
                </div>
                <RiskBadge level="HIGH" />
              </div>

              {/* Account Metadata */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900">Apex Digital Labs</h4>
                  <p className="text-xs text-slate-500">Account ID: C1024 • Enterprise B2B</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900">$1,299 / mo</div>
                  <div className="text-[11px] text-slate-400">$15,588 Annual ARR</div>
                </div>
              </div>

              {/* Centered Risk Gauge */}
              <div className="py-1 flex justify-center bg-slate-50/60 rounded-lg border border-slate-100">
                <RiskGauge
                  probability={0.87}
                  riskLevel="HIGH"
                  confidence="HIGH"
                  size={190}
                />
              </div>

              {/* Explainability Driver Pills */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Primary Model Drivers (SHAP)
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-amber-50/80 border border-amber-200/80 flex items-center justify-between font-medium text-slate-800">
                    <span>Contract: Month-to-Month</span>
                    <span className="font-bold text-[#C77D2E]">+28%</span>
                  </div>
                  <div className="p-2 rounded bg-amber-50/80 border border-amber-200/80 flex items-center justify-between font-medium text-slate-800">
                    <span>Support Calls: 6 calls</span>
                    <span className="font-bold text-[#C77D2E]">+21%</span>
                  </div>
                </div>
              </div>

              {/* Prescriptive Action Pill */}
              <div className="p-3 rounded-lg bg-[#12233D] text-white flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold block">
                    Recommended Retention Action
                  </span>
                  <span className="font-semibold text-white">
                    Migrate to 1-Year Contract with 15% SLA Credit
                  </span>
                </div>
                <Link href="/simulation?id=C1024">
                  <Button size="sm" variant="secondary" className="text-xs shrink-0 text-slate-900">
                    Test in Sandbox
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Metrics Ribbon */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/75 backdrop-blur-md border border-slate-200/80 rounded-lg p-4 shadow-xs">
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">$4.9M</div>
          <div className="text-xs text-slate-500 mt-0.5">Recurring ARR Protected</div>
        </div>
        <div className="bg-white/75 backdrop-blur-md border border-slate-200/80 rounded-lg p-4 shadow-xs">
          <div className="text-2xl sm:text-3xl font-bold text-[#2E6B4E]">89.2%</div>
          <div className="text-xs text-slate-500 mt-0.5">ML Holdout Accuracy</div>
        </div>
        <div className="bg-white/75 backdrop-blur-md border border-slate-200/80 rounded-lg p-4 shadow-xs">
          <div className="text-2xl sm:text-3xl font-bold text-[#12233D]">23.5x</div>
          <div className="text-xs text-slate-500 mt-0.5">Retention Campaign ROI</div>
        </div>
        <div className="bg-white/75 backdrop-blur-md border border-slate-200/80 rounded-lg p-4 shadow-xs">
          <div className="text-2xl sm:text-3xl font-bold text-[#C77D2E]">60 Days</div>
          <div className="text-xs text-slate-500 mt-0.5">Advance Churn Detection</div>
        </div>
      </div>
    </section>
  );
};
