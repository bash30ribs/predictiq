'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export const LandingNavbar: React.FC = () => {
  return (
    <header className="h-16 bg-white/75 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-50 px-6 sm:px-12 flex items-center justify-between transition-all">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded bg-[#12233D] text-white flex items-center justify-center font-bold text-base tracking-tight shadow-xs group-hover:scale-105 transition-transform">
          P
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">PredictIQ</span>
        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-wider font-semibold border border-slate-200">
          Enterprise
        </span>
      </Link>

      {/* Center Nav Links */}
      <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-600">
        <a href="#features" className="hover:text-slate-900 transition-colors">
          Platform
        </a>
        <a href="#explainability" className="hover:text-slate-900 transition-colors">
          Explainability Engine
        </a>
        <a href="#simulator" className="hover:text-slate-900 transition-colors">
          What-If Simulator
        </a>
        <a href="#roi" className="hover:text-slate-900 transition-colors">
          ROI Calculator
        </a>
        <a href="#voice" className="hover:text-slate-900 transition-colors">
          Customer Voice
        </a>
      </nav>

      {/* Right CTAs */}
      <div className="flex items-center gap-3">
        <Link href="/login" className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 transition-colors">
          Sign In
        </Link>
        <Link href="/register">
          <Button size="sm" variant="outline" className="hidden sm:inline-flex">
            Create Account
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button
            size="sm"
            variant="primary"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Live Demo
          </Button>
        </Link>
      </div>
    </header>
  );
};
