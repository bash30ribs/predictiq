'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, TrendingUp, Sparkles, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppStore();
  const [email, setEmail] = useState('elena.rostova@predictiq.io');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState('VP of Customer Success');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email, role);
      router.push('/dashboard');
    }, 450);
  };

  const handleDemoSignIn = () => {
    setEmail('elena.rostova@predictiq.io');
    setRole('VP of Customer Success');
    setIsLoading(true);
    setTimeout(() => {
      login('elena.rostova@predictiq.io', 'VP of Customer Success');
      router.push('/dashboard');
    }, 350);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC]">
      {/* Left Column: Executive Value Proposition */}
      <div className="md:w-1/2 bg-[#12233D] text-white p-8 md:p-14 flex flex-col justify-between border-r border-[#0a1424] relative overflow-hidden">
        {/* Gaussian Blur Atmospheric Orbs */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500/15 blur-[100px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-[#C77D2E]/15 blur-[120px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 left-1/4 w-80 h-80 rounded-full bg-[#2E6B4E]/12 blur-[110px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-8 h-8 rounded bg-white text-[#12233D] flex items-center justify-center font-bold text-base tracking-tight shadow-xs">
              P
            </div>
            <span className="text-xl font-bold tracking-tight text-white">PredictIQ</span>
            <span className="text-[10px] bg-white/15 text-slate-200 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
              Enterprise
            </span>
          </div>

          <div className="max-w-md">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Actionable Customer Churn Intelligence for Executive Leaders
            </h1>
            <p className="text-slate-300 text-sm mt-4 leading-relaxed">
              Detect enterprise customer churn risk 60 days before renewal. Turn complex machine learning probabilities into concrete, revenue-protecting retention playbooks.
            </p>

            {/* Key Value Points */}
            <div className="mt-8 space-y-3.5">
              <div className="flex items-start gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#A3D9BE] shrink-0 mt-0.5" />
                <span><strong>No ML expertise required:</strong> Plain-language drivers explain exactly why each account is at risk.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#A3D9BE] shrink-0 mt-0.5" />
                <span><strong>What-if strategy simulation:</strong> Test contract term adjustments and support resolutions live before outreach.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#A3D9BE] shrink-0 mt-0.5" />
                <span><strong>Portfolio ARR prioritization:</strong> Target high-impact intervention programs ranked by protected revenue.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Metrics callout */}
        <div className="mt-12 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 relative z-10 backdrop-blur-xs">
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">$4.9M</div>
            <div className="text-[11px] text-slate-400 mt-0.5">ARR Monitored</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">89.2%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Model Accuracy</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">23.5x</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Program ROI</div>
          </div>
        </div>
      </div>

      {/* Right Column: Authentication Gate */}
      <div className="md:w-1/2 p-8 md:p-14 flex items-center justify-center relative overflow-hidden">
        {/* Soft Ambient Blurs */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#12233D]/6 blur-[110px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[#C77D2E]/6 blur-[120px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-md w-full relative z-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Executive Sign In
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your corporate credentials or launch the instant executive demonstration.
            </p>
          </div>

          {/* Quick Demo Shortcut */}
          <div className="mb-6 p-4 rounded-lg bg-[#EBF5F0]/80 backdrop-blur-md border border-[#A3D9BE] shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#2E6B4E]">
                <Sparkles className="w-4 h-4" />
                <span>Instant Demo Access</span>
              </div>
              <span className="text-[10px] bg-white/90 px-2 py-0.5 rounded text-[#2E6B4E] font-medium border border-[#A3D9BE]">
                Pre-configured
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Explore the entire platform as <strong>Elena Rostova (VP of Customer Success)</strong> with pre-loaded enterprise dataset, calibrated XGBoost models, and simulated accounts.
            </p>
            <Button
              className="w-full bg-[#2E6B4E] hover:bg-[#25573e] text-white border-[#2E6B4E]"
              isLoading={isLoading}
              onClick={handleDemoSignIn}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In as VP of Customer Success
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-[#F8FAFC] px-3 text-slate-400 font-semibold tracking-wider">
                Or Sign In with Corporate SSO
              </span>
            </div>
          </div>

          {/* Credentials Form with glassmorphism */}
          <form onSubmit={handleSignIn} className="space-y-4 bg-white/70 backdrop-blur-md p-6 rounded-lg border border-slate-200/80 shadow-xs">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Corporate Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#12233D] text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#12233D] text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Executive Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#12233D] text-slate-900 font-medium"
              >
                <option value="VP of Customer Success">VP of Customer Success</option>
                <option value="Chief Revenue Officer">Chief Revenue Officer (CRO)</option>
                <option value="Director of Retention">Director of Retention</option>
              </select>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Dashboard
            </Button>
          </form>

          <div className="mt-6 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>SOC2 Type II Certified • 256-bit AES Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
