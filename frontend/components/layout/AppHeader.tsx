'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { apiClient } from '@/lib/api';
import { Database, AlertCircle, LogOut, CheckCircle2, Sparkles, Building2, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export const AppHeader: React.FC = () => {
  const {
    user,
    logout,
    activeDataset,
    simulateApiErrors,
    setSimulateApiErrors,
    isEasyMode,
    toggleEasyMode,
    loadDemoData,
  } = useAppStore();

  const toggleSimulateErrors = () => {
    const next = !simulateApiErrors;
    setSimulateApiErrors(next);
    apiClient.setSimulateError(next);
  };

  return (
    <header className="h-14 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left: Active Dataset Status */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
          <Database className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-medium text-slate-700">
            {isEasyMode ? "Customer File:" : "Dataset:"}
          </span>
          {activeDataset ? (
            <span className="text-slate-900 font-medium truncate max-w-[170px]">
              {isEasyMode
                ? `${activeDataset.row_count.toLocaleString()} customers monitored`
                : `${activeDataset.file_name} (${activeDataset.row_count.toLocaleString()} rows)`}
            </span>
          ) : (
            <span className="text-amber-600 font-medium">
              {isEasyMode
                ? `No customer data uploaded for ${user?.organization || 'your team'}`
                : 'No dataset loaded'}
            </span>
          )}
          {activeDataset && (
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B4E]" />
          )}
        </div>

        {!activeDataset && (
          <button
            onClick={loadDemoData}
            className="text-[11px] font-semibold text-[#12233D] bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1 rounded transition-colors"
          >
            {isEasyMode ? "⚡ Try With Sample Customers" : "Load Demo Dataset"}
          </button>
        )}
      </div>

      {/* Right: Easy Mode Toggle, Error Toggle, and User Profile */}
      <div className="flex items-center gap-3">
        {/* Easy Mode (Plain English) Toggle */}
        <button
          onClick={toggleEasyMode}
          title={
            isEasyMode
              ? "Easy Mode is ON: Translates technical machine learning & financial math into plain English"
              : "Switch to Easy Mode: Explains everything in simple, everyday words instead of technical jargon"
          }
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xs ${
            isEasyMode
              ? 'bg-amber-100 text-amber-900 border border-amber-300 ring-2 ring-amber-400/40 shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <Sparkles
            className={`w-3.5 h-3.5 ${
              isEasyMode ? 'text-amber-600 fill-amber-500 animate-pulse' : 'text-slate-400'
            }`}
          />
          <span>{isEasyMode ? '💡 Easy Mode: ON' : '💡 Enter Easy Mode'}</span>
        </button>

        {/* Toggle Error Simulation for Testing */}
        <button
          onClick={toggleSimulateErrors}
          title="Toggle simulated API errors to inspect error and retry handling states"
          className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer ${
            simulateApiErrors
              ? 'bg-[#FDF2F2] text-[#9E2A2B] border-[#F5B8B9] font-semibold animate-pulse'
              : 'bg-white/80 text-slate-500 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span className="text-[11px]">
            {simulateApiErrors ? 'API Error: ON' : 'Test Error'}
          </span>
        </button>

        {/* User Profile */}
        {user ? (
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-900 flex items-center justify-end gap-1.5">
                <span>{user.name}</span>
                {user.organization && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-semibold border border-slate-200">
                    {user.organization}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500">{user.role}</div>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#12233D] text-white flex items-center justify-center text-xs font-bold shadow-xs">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
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
