'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { WhatIfSimulator } from '@/components/simulation/WhatIfSimulator';
import { Button } from '@/components/ui/Button';
import { Sliders, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';

function SimulationContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || 'C1024';

  return <WhatIfSimulator initialCustomerId={initialId} />;
}

export default function SimulationPage() {
  const { isEasyMode } = useAppStore();

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {isEasyMode ? "Fix & Save Customers Simulator" : "Interactive What-If Simulation Sandbox"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEasyMode
                ? "Test what happens if you offer a 1-year discount or solve their open support tickets."
                : "Simulate the predictive impact of renegotiating contract terms, resolving support tickets, or discounting tiers."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/impact">
              <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                {isEasyMode ? "See Money & Savings" : "View Aggregate Revenue at Risk"}
              </Button>
            </Link>
          </div>
        </div>

        {/* Informative Guidance Banner */}
        <div className="p-4 rounded-lg bg-white border border-slate-200 flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600 mt-0.5">
            <Sliders className="w-3.5 h-3.5 text-[#12233D]" />
          </div>
          <div className="text-xs text-slate-600 leading-relaxed">
            <span className="font-semibold text-slate-900 block mb-0.5">
              {isEasyMode ? "How This Save Simulator Works:" : "How the What-If Engine Works:"}
            </span>
            {isEasyMode ? (
              <span>
                Move the sliders below or click <strong>⚡ Apply Best Fix</strong> to see how much more loyal the customer becomes! Watch the risk score drop from <strong className="text-[#9E2A2B]">Danger</strong> to <strong className="text-[#2E6B4E]">Safe</strong> in real time.
              </span>
            ) : (
              <span>
                Adjusting levers immediately recalculates the model's decision path using the active XGBoost feature weights. Compare the <strong className="text-slate-800">Baseline Churn Probability</strong> against the <strong className="text-[#2E6B4E]">Simulated Outcome</strong> to quantify expected risk mitigation before committing customer success resources.
              </span>
            )}
          </div>
        </div>

        {/* Interactive Simulator wrapped in Suspense for searchParams */}
        <Suspense fallback={<div className="h-96 w-full bg-white border border-slate-200 rounded-lg animate-pulse" />}>
          <SimulationContent />
        </Suspense>
      </div>
    </AppShell>
  );
}
