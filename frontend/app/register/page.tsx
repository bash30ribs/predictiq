'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { ShieldCheck, Sparkles, ArrowRight, CheckCircle2, Lock, UserPlus, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAppStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('VP of Customer Success');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await apiClient.registerUser({
        name,
        email,
        organization,
        role,
        password,
      });

      login(res.user.email, res.user.role);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Failed to create account. Please verify your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC]">
      {/* Left Column: Executive Value Proposition with Gaussian Atmosphere */}
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
          <Link href="/" className="inline-flex items-center gap-2.5 mb-12 group">
            <div className="w-8 h-8 rounded bg-white text-[#12233D] flex items-center justify-center font-bold text-base tracking-tight shadow-xs group-hover:scale-105 transition-transform">
              P
            </div>
            <span className="text-xl font-bold tracking-tight text-white">PredictIQ</span>
            <span className="text-[10px] bg-white/15 text-slate-200 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
              Enterprise
            </span>
          </Link>

          <div className="max-w-md">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-xs font-semibold text-slate-200 mb-4 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#A3D9BE]" />
              Enterprise Account Setup
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Empower Your Retention Team with Machine Learning
            </h1>
            <p className="text-slate-300 text-sm mt-4 leading-relaxed">
              Create your corporate executive account. Monitor accounts across contract cycles, test what-if retention strategies, and safeguard recurring ARR.
            </p>

            <div className="mt-8 space-y-3.5">
              <div className="flex items-start gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#A3D9BE] shrink-0 mt-0.5" />
                <span><strong>Persistent SQLite Database:</strong> Your team's account credentials and custom models persist locally across sessions.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#A3D9BE] shrink-0 mt-0.5" />
                <span><strong>Full Platform Access:</strong> Executive Cockpit, Dataset Ingestion, SHAP Explainability, and What-If Sandbox.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#A3D9BE] shrink-0 mt-0.5" />
                <span><strong>Qualitative Sentiment Reader:</strong> Analyze customer feedback text to quantify direct churn risk shifts.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Metrics */}
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

      {/* Right Column: Registration Form */}
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Create Enterprise Account
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Your profile will be stored in the local SQLite database.
            </p>
          </div>

          {error && (
            <div className="mb-4">
              <ErrorBanner message={error} />
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleRegister}
            className="space-y-3.5 bg-white/80 backdrop-blur-md p-6 rounded-lg border border-slate-200/80 shadow-xs"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#12233D] text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Corporate Email
              </label>
              <input
                type="email"
                required
                placeholder="alex.morgan@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#12233D] text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company / Org
                </label>
                <input
                  type="text"
                  required
                  placeholder="Acme Telecom"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
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
                  <option value="VP of Customer Success">VP Customer Success</option>
                  <option value="Chief Revenue Officer">Chief Revenue Officer</option>
                  <option value="Director of Retention">Director of Retention</option>
                  <option value="Account Executive">Account Executive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#12233D] text-slate-900"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
              leftIcon={<UserPlus className="w-4 h-4" />}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Complete Registration & Enter
            </Button>
          </form>

          <div className="mt-5 text-center text-xs text-slate-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-[#12233D] hover:underline">
              Sign In here
            </Link>
          </div>

          <div className="mt-6 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>SQLite Embedded Database • Local Persistent Storage</span>
          </div>
        </div>
      </div>
    </div>
  );
}
