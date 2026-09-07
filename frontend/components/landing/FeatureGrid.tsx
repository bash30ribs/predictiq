'use client';

import React from 'react';
import Link from 'next/link';
import {
  Radar,
  Sliders,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Zap,
  ArrowRight,
  Database,
  Cpu,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: <Radar className="w-5 h-5 text-[#12233D]" />,
      badge: 'Early Signal Detection',
      title: '60-Day Proactive Churn Radar',
      description:
        'Continuously aggregates 35+ telemetry signals: declining login frequencies, unresolved support escalations, billing friction, and feature under-utilization before renewal notices are triggered.',
      linkText: 'Explore Customer Radar',
      href: '/customers',
      stat: '60 Days Notice',
    },
    {
      icon: <Cpu className="w-5 h-5 text-[#2E6B4E]" />,
      badge: 'Transparent Explainable AI',
      title: 'SHAP Contribution Breakdown',
      description:
        'Never trust a black-box percentage. Every prediction provides exact mathematical Shapley driver values explaining precisely why an account is flagged (e.g. +28% contract term, +21% ticket delay).',
      linkText: 'View Explainability View',
      href: '/customers/C1024',
      stat: '100% Transparent',
    },
    {
      icon: <Sliders className="w-5 h-5 text-[#C77D2E]" />,
      badge: 'Counterfactual Sandbox',
      title: 'Live What-If Retention Simulator',
      description:
        'Test retention strategies before reaching out. Interactively simulate contract migrations, dedicated TAM assignments, and SLA billing credits to calculate expected risk reduction in real time.',
      linkText: 'Launch Simulator',
      href: '/simulation',
      stat: '-34% Risk Drop',
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-[#12233D]" />,
      badge: 'Executive Financial Impact',
      title: 'ARR Impact & ROI Cockpit',
      description:
        'Map machine learning predictions directly to corporate ARR balance sheets. Prioritize outreach by contract value and measure intervention ROI across Customer Success cohorts.',
      linkText: 'View ROI Dashboard',
      href: '/impact',
      stat: '$4.9M Protected',
    },
  ];

  return (
    <section id="features" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto relative">
      {/* Ambient background blur */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-[#12233D]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-[#2E6B4E]/8 blur-[120px] pointer-events-none" />

      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-800 border border-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-[#2E6B4E]" />
          <span>Core Capabilities</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Engineered for Enterprise Customer Success
        </h2>
        <p className="text-slate-600 text-sm sm:text-base font-normal">
          PredictIQ pairs predictive machine learning with transparent business logic, turning data points into high-confidence retention decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((item, idx) => (
          <div
            key={idx}
            className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/90 hover:border-slate-300 rounded-2xl p-7 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-100/90 border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                    {item.badge}
                  </span>
                  <span className="text-xs font-bold text-slate-900 font-mono px-2 py-0.5 bg-slate-50 rounded border border-slate-200">
                    {item.stat}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {item.title}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {item.description}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={item.href}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#12233D] hover:text-[#2E6B4E] transition-colors"
              >
                <span>{item.linkText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <span className="text-[11px] text-slate-400 font-medium">PredictIQ Engine</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
