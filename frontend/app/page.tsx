'use client';

import React from 'react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { LandingRoiCalculator } from '@/components/landing/LandingRoiCalculator';
import { CustomerVoiceSection } from '@/components/landing/CustomerVoiceSection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-[#12233D] selection:text-white relative overflow-hidden">
      {/* Dynamic Ambient Background Gaussian Blur Gradient Orbs */}
      <div className="fixed -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[#12233D]/7 blur-[140px] pointer-events-none -z-10 animate-float-slow" />
      <div className="fixed top-1/3 -right-32 w-[550px] h-[550px] rounded-full bg-[#C77D2E]/8 blur-[150px] pointer-events-none -z-10 animate-float-reverse" />
      <div className="fixed -bottom-32 left-1/3 w-[500px] h-[500px] rounded-full bg-[#2E6B4E]/8 blur-[140px] pointer-events-none -z-10" />

      {/* Top Marketing Navigation */}
      <LandingNavbar />

      {/* Hero Section with Cockpit Preview & Live Metrics */}
      <main>
        <HeroSection />

        {/* 4 Core Pillars of Enterprise Churn Intelligence */}
        <FeatureGrid />

        {/* Real-Time Qualitative Customer Review NLP Engine Showcase */}
        <CustomerVoiceSection />

        {/* Interactive What-If ROI Calculator */}
        <LandingRoiCalculator />
      </main>

      {/* Corporate Compliance & Security Footer */}
      <LandingFooter />
    </div>
  );
}
