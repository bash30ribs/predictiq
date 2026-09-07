'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Activity, CheckCircle2 } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-white/75 backdrop-blur-xl border-t border-slate-200/80 pt-16 pb-12 px-6 sm:px-12 max-w-7xl mx-auto relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-200/80">
        {/* Brand Column */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#12233D] text-white flex items-center justify-center font-bold text-sm">
              P
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">PredictIQ</span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold border border-slate-200">
              Enterprise
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Autonomous customer churn prediction and ARR retention intelligence platform for enterprise Customer Success teams.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#2E6B4E] inline-block animate-pulse" />
            <span>Core ML & Database Engine: Operational</span>
          </div>
        </div>

        {/* Links Column 1: Platform */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Platform Modules
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 font-medium">
            <li>
              <Link href="/dashboard" className="hover:text-slate-900 transition-colors">
                Executive Churn Cockpit
              </Link>
            </li>
            <li>
              <Link href="/customers" className="hover:text-slate-900 transition-colors">
                Customer Radar Table
              </Link>
            </li>
            <li>
              <Link href="/customers/C1024" className="hover:text-slate-900 transition-colors">
                SHAP Explainability View
              </Link>
            </li>
            <li>
              <Link href="/simulation" className="hover:text-slate-900 transition-colors">
                What-If Sandbox Simulator
              </Link>
            </li>
            <li>
              <Link href="/impact" className="hover:text-slate-900 transition-colors">
                ARR Financial Impact Calculator
              </Link>
            </li>
            <li>
              <Link href="/reviews" className="hover:text-slate-900 transition-colors">
                Customer Voice & NLP Review Hub
              </Link>
            </li>
          </ul>
        </div>

        {/* Links Column 2: Security & Architecture */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Security & Governance
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 font-medium">
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E6B4E]" />
              <span>SOC 2 Type II Audited</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>AES-256 Data Encryption</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B4E]" />
              <span>Local SQLite WAL Architecture</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#C77D2E]" />
              <span>Audit Logging & Role RBAC</span>
            </li>
          </ul>
        </div>

        {/* Links Column 3: Access */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Portals
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 font-medium">
            <li>
              <Link href="/login" className="hover:text-slate-900 transition-colors">
                Sign In
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-slate-900 transition-colors">
                Create Account
              </Link>
            </li>
            <li>
              <Link href="/training" className="hover:text-slate-900 transition-colors">
                Model Training
              </Link>
            </li>
            <li>
              <Link href="/upload" className="hover:text-slate-900 transition-colors">
                Data Ingestion
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 font-normal">
        <div>
          © {new Date().getFullYear()} PredictIQ Technologies, Inc. All rights reserved. Enterprise Churn Intelligence.
        </div>
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-800 cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-slate-800 cursor-pointer">Terms of Service</span>
          <span>•</span>
          <span className="hover:text-slate-800 cursor-pointer">Compliance & Trust</span>
        </div>
      </div>
    </footer>
  );
};
