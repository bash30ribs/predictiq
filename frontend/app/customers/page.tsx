'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { apiClient } from '@/lib/api';
import { CustomerListItem } from '@/lib/types';
import { CustomerTable } from '@/components/customer/CustomerTable';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Button } from '@/components/ui/Button';
import { Download, Sliders } from 'lucide-react';
import Link from 'next/link';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [sortBy, setSortBy] = useState('probability');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.getCustomers({
        page,
        pageSize,
        search: searchQuery,
        riskLevel: selectedRisk,
        sortBy,
        sortDir,
      });
      setCustomers(res.customers);
      setTotal(res.total);
      setTotalPages(res.total_pages);
    } catch (err: any) {
      setError(err?.message || "Failed to load customer risk directory.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, searchQuery, selectedRisk, sortBy, sortDir]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('desc');
    }
  };

  const handleExportCsv = () => {
    // Generate simple CSV from current loaded customers
    const headers = "Customer ID,Account Name,Segment,Contract,Tenure,Monthly Charges,Support Calls,Probability,Risk Level\n";
    const rows = customers.map(c =>
      `"${c.customer_id}","${c.name}","${c.segment}","${c.contract}",${c.tenure},${c.monthly_charges},${c.support_calls},${c.probability},"${c.risk_level}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `predictiq_customers_risk_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Customer Risk Directory
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Filterable directory of all accounts scored by machine learning churn likelihood with full factor attribution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/simulation">
              <Button size="sm" variant="outline" leftIcon={<Sliders className="w-3.5 h-3.5" />}>
                Open What-If Sandbox
              </Button>
            </Link>
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportCsv}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export Risk CSV
            </Button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <ErrorBanner
            message={error}
            onRetry={fetchCustomers}
            isRetrying={isLoading}
          />
        )}

        {/* Sortable & Filterable Table */}
        <CustomerTable
          customers={customers}
          total={total}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setPage(1);
          }}
          selectedRisk={selectedRisk}
          onRiskChange={(r) => {
            setSelectedRisk(r);
            setPage(1);
          }}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </AppShell>
  );
}
