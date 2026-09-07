'use client';

import React from 'react';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-slate-900 relative">
      {/* Ambient Gaussian Blur Mesh Elements — Colors Merged into Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Deep Navy Ambient Atmospheric Orb (Top-Left) */}
        <div
          className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-[#12233D]/14 blur-[130px] animate-float-slow"
          aria-hidden="true"
        />

        {/* Warm Amber Attention Glow (Center-Right) */}
        <div
          className="absolute top-1/4 -right-32 w-[580px] h-[580px] rounded-full bg-[#C77D2E]/12 blur-[140px] animate-float-reverse"
          aria-hidden="true"
        />

        {/* Muted Sage Green Retention Mesh (Bottom-Left) */}
        <div
          className="absolute -bottom-32 left-1/4 w-[550px] h-[550px] rounded-full bg-[#2E6B4E]/11 blur-[140px] animate-float-slow"
          aria-hidden="true"
        />

        {/* Center Indigo Secondary Diffusion (Center) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-[#274778]/10 blur-[150px]"
          aria-hidden="true"
        />
      </div>

      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <AppHeader />
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
