'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { apiClient } from '@/lib/api';
import { Database, AlertCircle, LogOut, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const AppHeader: React.FC = () => {
  const { user, logout, activeDataset, simulateApiErrors, setSimulateApiErrors } = useAppStore();

  const toggleSimulateErrors = () => {
    const next = !simulateApiErrors;
    setSimulateApiErrors(next);
    apiClient.setSimulateError(next);
  };

  return (
    <header className="h-14 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-5 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Active Dataset Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
          <Database className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-medium text-slate-700">Dataset:</span>
          {activeDataset ? (
            <span className="text-slate-900 font-medium truncate max-w-[180px]">
              {activeDataset.file_name} ({activeDataset.row_count.toLocaleString()} rows)
            </span>
          ) : (
            <span className="text-amber-600 font-medium">No dataset loaded</span>
          )}
          {activeDataset && (
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B4E]" />
          )}
        </div>
      </div>

      {/* Right: Controls, Error Toggle, and User Profile */}
      <div className="flex items-center gap-4">
        {/* Toggle Error Simulation for Testing */}
        <button
          onClick={toggleSimulateErrors}
          title="Toggle simulated API errors to inspect error and retry handling states"
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer ${
            simulateApiErrors
              ? 'bg-[#FDF2F2] text-[#9E2A2B] border-[#F5B8B9] font-medium'
              : 'bg-white text-slate-500 border-slate-200 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Simulate API Error: {simulateApiErrors ? 'ON' : 'OFF'}</span>
        </button>

        {/* User Profile */}
        {user ? (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-900">{user.name}</div>
              <div className="text-[11px] text-slate-500">{user.role}</div>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#12233D] text-white flex items-center justify-center text-xs font-semibold">
              {user.name.charAt(0)}
            </div>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-xs font-medium text-white bg-[#12233D] px-3 py-1.5 rounded-md hover:bg-[#1c3459] transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};
