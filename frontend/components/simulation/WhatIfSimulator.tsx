'use client';

import React, { useState, useEffect } from 'react';
import { WhatIfSimulationResponse, ContractType } from '@/lib/types';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/Badge';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Sliders, ArrowRight, TrendingDown, Sparkles, RefreshCw, UserCheck } from 'lucide-react';
import { mockCustomersList } from '@/mocks/data';

interface WhatIfSimulatorProps {
  initialCustomerId?: string;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  initialCustomerId = 'C1024',
}) => {
  const [customerId, setCustomerId] = useState<string>(initialCustomerId);
  const [tenure, setTenure] = useState<number>(8);
  const [monthlyCharges, setMonthlyCharges] = useState<number>(1299);
  const [contract, setContract] = useState<ContractType>('Month-to-month');
  const [supportCalls, setSupportCalls] = useState<number>(6);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [simulation, setSimulation] = useState<WhatIfSimulationResponse | null>(null);

  // Sync with selected customer if customerId changes
  useEffect(() => {
    const found = mockCustomersList.find((c) => c.customer_id === customerId);
    if (found) {
      setTenure(found.tenure);
      setMonthlyCharges(found.monthly_charges);
      setContract(found.contract);
      setSupportCalls(found.support_calls);
    }
  }, [customerId]);

  const runSimulation = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.simulateWhatIf({
        customer_id: customerId,
        tenure,
        monthly_charges: monthlyCharges,
        contract,
        support_calls: supportCalls,
      });
      setSimulation(res);
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial simulation
  useEffect(() => {
    runSimulation();
  }, [customerId]);

  return (
    <div className="space-y-6">
      {/* Account Preset Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-lg">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[#12233D]" />
          <span className="text-xs font-semibold text-slate-900">Active Simulation Account:</span>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-800 font-medium focus:ring-1 focus:ring-[#12233D]"
          >
            {mockCustomersList.map((c) => (
              <option key={c.customer_id} value={c.customer_id}>
                {c.customer_id} — {c.name} ({c.risk_level} Risk, ${c.monthly_charges}/mo)
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              // Quick preset: Apply Retention Strategy (Annual + resolved tickets)
              setContract('One year');
              setSupportCalls(1);
              setMonthlyCharges(Math.round(monthlyCharges * 0.85));
            }}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#C77D2E]" />}
          >
            Apply Standard Retention Offer
          </Button>
          <Button
            size="sm"
            variant="primary"
            isLoading={isLoading}
            onClick={runSimulation}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Recalculate Churn Risk
          </Button>
        </div>
      </div>

      {/* Main Dual-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Parameter Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#12233D]" />
                  Simulated Levers
                </CardTitle>
                <CardDescription>
                  Adjust customer relationship variables to model retention impact
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Contract Type Lever */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-800">
                    Contract Agreement
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Strongest retention driver
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['Month-to-month', 'One year', 'Two year'] as ContractType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setContract(type)}
                      className={`py-2 px-2 text-xs rounded border text-center font-medium transition-colors cursor-pointer ${
                        contract === type
                          ? 'bg-[#12233D] text-white border-[#12233D] shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Support Calls Lever */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-800">
                    Support Inquiries (Last 30 Days)
                  </label>
                  <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {supportCalls} calls
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={9}
                  step={1}
                  value={supportCalls}
                  onChange={(e) => setSupportCalls(Number(e.target.value))}
                  className="w-full accent-[#12233D] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0 (Frictionless)</span>
                  <span>4 (Moderate)</span>
                  <span>9 (Critical Friction)</span>
                </div>
              </div>

              {/* Monthly Charges Lever */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-800">
                    Monthly Billing Tier (MRR)
                  </label>
                  <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {formatCurrency(monthlyCharges)}
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={2500}
                  step={25}
                  value={monthlyCharges}
                  onChange={(e) => setMonthlyCharges(Number(e.target.value))}
                  className="w-full accent-[#12233D] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>$50/mo</span>
                  <span>$1,250/mo</span>
                  <span>$2,500/mo</span>
                </div>
              </div>

              {/* Tenure Lever */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-800">
                    Account Tenure
                  </label>
                  <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {tenure} months
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={72}
                  step={1}
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full accent-[#12233D] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1 mo (New Signup)</span>
                  <span>36 mos</span>
                  <span>72 mos (Matured)</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  className="w-full"
                  variant="primary"
                  isLoading={isLoading}
                  onClick={runSimulation}
                >
                  Run Simulation Scenario
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Before vs After Delta Analysis (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {simulation && (
            <>
              {/* Comparison Header Card */}
              <div className="bg-white border border-slate-200 rounded-lg p-5">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Simulation Outcome Comparison
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Before State */}
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase mb-1">
                      Baseline Profile (Actual)
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-slate-900">
                        {formatPercent(simulation.original.probability)}
                      </span>
                      <span className="text-xs text-slate-500">churn risk</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <RiskBadge level={simulation.original.risk_level} />
                    </div>
                    <div className="space-y-1 text-xs text-slate-600">
                      <div>Contract: <span className="font-medium text-slate-900">{simulation.original.contract}</span></div>
                      <div>Support calls: <span className="font-medium text-slate-900">{simulation.original.support_calls}</span></div>
                      <div>MRR: <span className="font-medium text-slate-900">{formatCurrency(simulation.original.monthly_charges)}</span></div>
                    </div>
                  </div>

                  {/* After State */}
                  <div className="p-4 rounded-lg bg-[#EBF5F0]/60 border border-[#A3D9BE]">
                    <div className="text-[11px] font-semibold text-[#2E6B4E] uppercase mb-1 flex items-center justify-between">
                      <span>Simulated Intervention</span>
                      <span className="text-xs font-bold text-[#2E6B4E] flex items-center gap-0.5">
                        <TrendingDown className="w-3.5 h-3.5" />
                        {Math.round(simulation.probability_delta * 100)}%
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-[#2E6B4E]">
                        {formatPercent(simulation.simulated.probability)}
                      </span>
                      <span className="text-xs text-slate-600">churn risk</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <RiskBadge level={simulation.simulated.risk_level} />
                    </div>
                    <div className="space-y-1 text-xs text-slate-700">
                      <div>Contract: <span className="font-semibold text-slate-900">{simulation.simulated.contract}</span></div>
                      <div>Support calls: <span className="font-semibold text-slate-900">{simulation.simulated.support_calls}</span></div>
                      <div>MRR: <span className="font-semibold text-slate-900">{formatCurrency(simulation.simulated.monthly_charges)}</span></div>
                    </div>
                  </div>
                </div>

                {/* Net Retention Impact Callout */}
                <div className="mt-4 p-3.5 rounded-md bg-[#12233D] text-white flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-300">Protected Annual ARR under this Strategy</div>
                    <div className="text-xl font-bold mt-0.5">
                      {formatCurrency(simulation.simulated.monthly_charges * 12)} / year
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="inline-block px-2 py-0.5 rounded bg-white/10 text-white font-medium">
                      Risk Level: {simulation.original.risk_level} → {simulation.simulated.risk_level}
                    </span>
                  </div>
                </div>
              </div>

              {/* Factor Shifts Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Feature Impact Attribution Shift</CardTitle>
                  <CardDescription>
                    How the ML decision tree re-weighted each factor following intervention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2.5">
                    {simulation.factor_shifts.map((f) => {
                      const prevPct = Math.round(f.previous_impact * 100);
                      const newPct = Math.round(f.new_impact * 100);

                      return (
                        <div
                          key={f.feature}
                          className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-100 text-xs"
                        >
                          <span className="font-medium text-slate-900">{f.feature}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-500 font-mono">
                              {prevPct > 0 ? `+${prevPct}%` : `${prevPct}%`}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                            <span
                              className={`font-semibold font-mono ${
                                newPct <= 0 ? 'text-[#2E6B4E]' : 'text-[#C77D2E]'
                              }`}
                            >
                              {newPct > 0 ? `+${newPct}%` : `${newPct}%`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
