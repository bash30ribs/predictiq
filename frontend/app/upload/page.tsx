'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAppStore } from '@/store/useAppStore';
import { apiClient } from '@/lib/api';
import { DataQualityProfile } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton, TableSkeleton } from '@/components/ui/Skeleton';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Info,
  Database,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

export default function UploadPage() {
  const { activeDataset, dataQuality, setActiveDataset, isEasyMode, user } = useAppStore();
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingQuality, setIsLoadingQuality] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const fetchQualityProfile = async () => {
    setIsLoadingQuality(true);
    setError(null);
    try {
      const profile = await apiClient.getDataQuality();
      setActiveDataset(activeDataset || {
        dataset_id: profile.dataset_id,
        file_name: "telco_customer_churn_q3.csv",
        file_size_bytes: 1048576,
        row_count: profile.total_rows,
        column_count: profile.total_features,
        status: "ready",
        uploaded_at: new Date().toISOString(),
      }, profile);
    } catch (err: any) {
      setError(err?.message || "Failed to load data quality profile.");
    } finally {
      setIsLoadingQuality(false);
    }
  };

  useEffect(() => {
    if (!dataQuality) {
      fetchQualityProfile();
    }
  }, []);

  const handleSimulateUpload = async (file?: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const uploadRes = await apiClient.uploadDataset(file || null, user?.id);
      const qualityRes = await apiClient.getDataQuality(uploadRes.dataset_id);
      setActiveDataset(uploadRes, qualityRes);
    } catch (err: any) {
      setError(err?.message || "Dataset upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Easy Mode Banner */}
        {isEasyMode && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 via-amber-50/70 to-emerald-50 border border-amber-200/90 shadow-xs flex items-start gap-3.5 animate-fadeIn">
            <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-800 text-sm font-bold shadow-2xs">
              💡
            </div>
            <div className="flex-1 text-xs">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>Easy Mode: Add Your Customer Spreadsheet</span>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                  Plain English
                </span>
              </div>
              <p className="text-slate-700 mt-1 leading-relaxed">
                Add your customer records here! Simply drop your CSV file below or click <strong>Browse Files</strong>. Our system will check the file for mistakes and automatically teach the AI how your customers behave.
              </p>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {isEasyMode ? "Add Your Customer Spreadsheet" : "Dataset Upload & Quality Audit"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEasyMode
                ? "Drop your customer spreadsheet here so our system can check for missing information and study churn patterns."
                : "Ingest customer relationship records, inspect schema integrity, and audit data health before ML training."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/training">
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                {isEasyMode ? "Go to AI Brain Training" : "Proceed to Model Training"}
              </Button>
            </Link>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <ErrorBanner
            message={error}
            onRetry={fetchQualityProfile}
            isRetrying={isLoadingQuality || isUploading}
          />
        )}

        {/* Top: Drag & Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            handleSimulateUpload(file);
          }}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all bg-white ${
            dragOver
              ? 'border-[#12233D] bg-slate-50'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="max-w-md mx-auto flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mb-3">
              <UploadCloud className="w-6 h-6 text-[#12233D]" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              Drag and drop customer CSV dataset
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Supported formats: .csv, .tsv with standard churn schema (tenure, contract, support calls, charges)
            </p>

            <div className="flex items-center gap-3">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".csv,.tsv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleSimulateUpload(file);
                  }}
                />
                <Button
                  size="sm"
                  variant="outline"
                  isLoading={isUploading}
                  leftIcon={<FileSpreadsheet className="w-4 h-4 text-slate-600" />}
                >
                  Browse Files
                </Button>
              </label>

              <Button
                size="sm"
                variant="secondary"
                isLoading={isUploading}
                onClick={() => handleSimulateUpload()}
              >
                Load Sample Telecom Churn Data (7,043 rows)
              </Button>
            </div>
          </div>
        </div>

        {/* Quality Audit Profile */}
        {isLoadingQuality ? (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
            <TableSkeleton rows={6} columns={5} />
          </div>
        ) : dataQuality ? (
          <div className="space-y-6">
            {/* Top KPI Audit Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="text-[11px] font-semibold uppercase text-slate-500">
                  Total Records
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {dataQuality.total_rows.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Across {dataQuality.total_features} feature columns
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="text-[11px] font-semibold uppercase text-slate-500">
                  Data Cleanliness Score
                </div>
                <div className="text-2xl font-bold text-[#2E6B4E] mt-1 flex items-center gap-2">
                  {dataQuality.health_score}/100
                  <ShieldCheck className="w-5 h-5 text-[#2E6B4E]" />
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Production ready for training
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="text-[11px] font-semibold uppercase text-slate-500">
                  Missing Cell Ratio
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {dataQuality.missing_cells_pct}%
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  11 null cells auto-imputed
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="text-[11px] font-semibold uppercase text-slate-500">
                  Churn Rate in Data
                </div>
                <div className="text-2xl font-bold text-[#C77D2E] mt-1">
                  {dataQuality.class_distribution.churn_rate_pct}%
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {dataQuality.class_distribution.churned.toLocaleString()} churned vs{' '}
                  {dataQuality.class_distribution.retained.toLocaleString()} retained
                </div>
              </div>
            </div>

            {/* Health Flags */}
            <Card>
              <CardHeader>
                <CardTitle>Automated Health & Preprocessing Flags</CardTitle>
                <CardDescription>
                  Validation checks performed by the feature pipeline
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {dataQuality.health_flags.map((flag, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-md text-xs border ${
                      flag.level === 'warning'
                        ? 'bg-[#FEF7ED] border-[#F8D29F] text-slate-800'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    {flag.level === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-[#C77D2E] shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-[#2E6B4E] shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-semibold">{flag.code}: </span>
                      <span>{flag.message}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Column Schema & Summary Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Column Schema & Distribution Profile</CardTitle>
                <CardDescription>
                  Identified data types and feature bounds
                </CardDescription>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Column Name</th>
                      <th className="py-2.5 px-4">Data Type</th>
                      <th className="py-2.5 px-4">Missing</th>
                      <th className="py-2.5 px-4">Statistics / Unique Values</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-normal">
                    {dataQuality.columns.map((col) => (
                      <tr key={col.name} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-4 font-mono font-medium text-slate-900">
                          {col.name}
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-mono">
                            {col.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">
                          {col.missing_count === 0 ? (
                            <span className="text-[#2E6B4E] font-medium">0 nulls (100% complete)</span>
                          ) : (
                            <span className="text-[#C77D2E] font-medium">{col.missing_count} nulls</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">
                          {col.mean !== undefined && (
                            <span>Mean: {col.mean} (Min: {col.min}, Max: {col.max})</span>
                          )}
                          {col.categories && (
                            <span>Categories: {col.categories.join(', ')}</span>
                          )}
                          {col.sample_values && (
                            <span>Samples: {col.sample_values.join(', ')}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
