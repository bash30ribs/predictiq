'use client';

import React from 'react';
import Link from 'next/link';
import { CustomerListItem, RiskLevel } from '@/lib/types';
import { RiskBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowUpDown, ArrowRight, Search, Filter } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

interface CustomerTableProps {
  customers: CustomerListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedRisk: string;
  onRiskChange: (risk: string) => void;
  sortBy: string;
  sortDir: 'asc' | 'desc';
  onSort: (column: string) => void;
  onPageChange: (newPage: number) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  total,
  page,
  totalPages,
  isLoading,
  searchQuery,
  onSearchChange,
  selectedRisk,
  onRiskChange,
  sortBy,
  sortDir,
  onSort,
  onPageChange,
}) => {
  const riskFilters = [
    { label: 'All Risks', value: 'ALL' },
    { label: 'High Risk', value: 'HIGH' },
    { label: 'Medium Risk', value: 'MEDIUM' },
    { label: 'Low Risk', value: 'LOW' },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-lg overflow-hidden shadow-xs">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
        {/* Search */}
        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search account name or ID (e.g. C1024)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#12233D] focus:border-[#12233D] transition-colors"
          />
        </div>

        {/* Risk Level Filter Chips */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {riskFilters.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onRiskChange(tab.value)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                selectedRisk === tab.value
                  ? 'bg-[#12233D] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Content */}
      {isLoading ? (
        <TableSkeleton rows={8} columns={7} />
      ) : customers.length === 0 ? (
        <EmptyState
          title="No customers match your criteria"
          description="Try broadening your search query or switching the risk filter to 'All Risks'."
          actionLabel="Reset Filters"
          onAction={() => {
            onSearchChange('');
            onRiskChange('ALL');
          }}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Account Name</th>
                <th className="py-3 px-4">Contract</th>
                <th
                  className="py-3 px-4 cursor-pointer select-none hover:text-slate-900"
                  onClick={() => onSort('tenure')}
                >
                  <div className="flex items-center gap-1">
                    Tenure
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer select-none hover:text-slate-900"
                  onClick={() => onSort('monthly_charges')}
                >
                  <div className="flex items-center gap-1">
                    MRR
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Support Calls</th>
                <th
                  className="py-3 px-4 cursor-pointer select-none hover:text-slate-900"
                  onClick={() => onSort('probability')}
                >
                  <div className="flex items-center gap-1">
                    Churn Probability
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {customers.map((c) => (
                <tr
                  key={c.customer_id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="py-3 px-4 font-mono font-medium text-slate-700">
                    {c.customer_id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900">{c.name}</div>
                    <div className="text-[11px] text-slate-400">{c.segment}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {c.contract}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {c.tenure} mos
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {formatCurrency(c.monthly_charges)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium ${
                        c.support_calls >= 5
                          ? 'bg-[#FDF2F2] text-[#9E2A2B]'
                          : 'text-slate-600 bg-slate-100'
                      }`}
                    >
                      {c.support_calls} calls
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {formatPercent(c.probability)}
                  </td>
                  <td className="py-3 px-4">
                    <RiskBadge level={c.risk_level} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link href={`/customers/${c.customer_id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        rightIcon={<ArrowRight className="w-3 h-3 text-slate-500" />}
                        className="text-xs group-hover:border-[#12233D] group-hover:text-[#12233D]"
                      >
                        Inspect
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
        <div>
          Showing <span className="font-semibold text-slate-900">{customers.length}</span> of{' '}
          <span className="font-semibold text-slate-900">{total}</span> accounts
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page <= 1 || isLoading}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <span className="px-2 text-slate-700 font-medium">
            Page {page} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= totalPages || isLoading}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
