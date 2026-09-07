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
      {/* Ambient Gaussian Blur Mesh Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Deep Navy Ambient Orb */}
        <div
          className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-[#12233D]/10 blur-[110px]"
          aria-hidden="true"
        />
        {/* Warm Amber Attention Orb */}
        <div
          className="absolute top-1/3 -right-32 w-[480px] h-[480px] rounded-full bg-[#C77D2E]/8 blur-[120px]"
          aria-hidden="true"
        />
        {/* Muted Sage Green Retention Orb */}
        <div
          className="absolute -bottom-32 left-1/3 w-[450px] h-[450px] rounded-full bg-[#2E6B4E]/8 blur-[130px]"
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
