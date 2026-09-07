import React from 'react';
import { RecommendationAction } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { CheckCircle, Zap, TrendingDown, ArrowRight } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/lib/utils';
import Link from 'next/link';

interface ActionPanelProps {
  recommendations: RecommendationAction[];
  customerId: string;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({ recommendations, customerId }) => {
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
          const urgencyBadge = {
            IMMEDIATE: 'bg-[#FDF2F2] text-[#9E2A2B] border-[#F5B8B9]',
            HIGH: 'bg-[#FEF7ED] text-[#C77D2E] border-[#F8D29F]',
            MEDIUM: 'bg-slate-100 text-slate-700 border-slate-200',
          }[rec.urgency];

          return (
            <div
              key={rec.id}
              className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#EBF5F0] text-[#2E6B4E] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
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
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${urgencyBadge}`}
                >
                  {rec.urgency}
                </span>
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
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
