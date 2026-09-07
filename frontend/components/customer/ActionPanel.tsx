'use client';

import React, { useState } from 'react';
import { RecommendationAction } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { CheckCircle, Zap, TrendingDown, ArrowRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/lib/utils';
import Link from 'next/link';

interface ActionPanelProps {
  recommendations: RecommendationAction[];
  customerId: string;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({ recommendations, customerId }) => {
  const [activePlaybooks, setActivePlaybooks] = useState<Record<string, boolean>>({});
  const [activatingId, setActivatingId] = useState<string | null>(null);

  const handleTogglePlaybook = (id: string) => {
    setActivatingId(id);
    setTimeout(() => {
      setActivePlaybooks((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
      setActivatingId(null);
    }, 350);
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#C77D2E]" />
            <CardTitle>Prescriptive Retention Playbook</CardTitle>
          </div>
          <CardDescription>
            Algorithmically recommended interventions tied to primary risk drivers
          </CardDescription>
        </div>
        <Link href={`/simulation?id=${customerId}`}>
          <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Test in Simulator
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec) => {
          const isActivated = !!activePlaybooks[rec.id];
          const isActivating = activatingId === rec.id;

          const urgencyBadge = {
            IMMEDIATE: 'bg-[#FDF2F2] text-[#9E2A2B] border-[#F5B8B9]',
            HIGH: 'bg-[#FEF7ED] text-[#C77D2E] border-[#F8D29F]',
            MEDIUM: 'bg-slate-100 text-slate-700 border-slate-200',
          }[rec.urgency];

          return (
            <div
              key={rec.id}
              className={`p-4 rounded-lg border transition-all ${
                isActivated
                  ? 'border-emerald-300 bg-emerald-50/30 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isActivated
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-[#EBF5F0] text-[#2E6B4E]'
                    }`}
                  >
                    {isActivated ? <CheckCircle2 className="w-4 h-4" /> : <CheckCircle className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {rec.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isActivated && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-emerald-100 text-emerald-800 border-emerald-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Scheduled
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${urgencyBadge}`}
                  >
                    {rec.urgency}
                  </span>
                </div>
              </div>

              {/* Metrics strip */}
              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">Projected Risk Drop</span>
                  <span className="font-semibold text-[#2E6B4E] flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    -{formatPercent(rec.projected_risk_reduction)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Estimated Cost</span>
                  <span className="font-semibold text-slate-800">
                    {formatCurrency(rec.estimated_cost)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Protected Annual ARR</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(rec.estimated_annual_roi)}
                  </span>
                </div>
              </div>

              {/* Interactive Execution Strip */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                {isActivated ? (
                  <div className="text-xs text-emerald-800 font-medium flex items-center gap-1.5 animate-fadeIn">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Action scheduled: CS Lead & SLA credit workflow queued</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-500">
                    Ready to deploy to Customer Success workflow
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <Link href={`/simulation?id=${customerId}`}>
                    <Button size="sm" variant="ghost" className="text-xs text-slate-600 hover:text-slate-900">
                      Simulate Impact
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant={isActivated ? "secondary" : "primary"}
                    isLoading={isActivating}
                    onClick={() => handleTogglePlaybook(rec.id)}
                    leftIcon={isActivated ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Sparkles className="w-3.5 h-3.5" />}
                  >
                    {isActivated ? 'Playbook Active (Cancel)' : '⚡ Activate Playbook'}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
