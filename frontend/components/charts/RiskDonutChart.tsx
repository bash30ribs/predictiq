'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface RiskDonutChartProps {
  distribution: {
    high: number;
    medium: number;
    low: number;
  };
}

export const RiskDonutChart: React.FC<RiskDonutChartProps> = ({ distribution }) => {
  const total = distribution.high + distribution.medium + distribution.low;

  const data = [
    { name: 'High Risk', value: distribution.high, color: '#9E2A2B' },
    { name: 'Medium Risk', value: distribution.medium, color: '#C77D2E' },
    { name: 'Low Risk', value: distribution.low, color: '#2E6B4E' },
  ];

  return (
    <div className="w-full flex items-center justify-between select-none">
      <div className="w-48 h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={52}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
              stroke="#FFFFFF"
              strokeWidth={1.5}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#12233D',
                border: 'none',
                borderRadius: '6px',
                color: '#FFFFFF',
                fontSize: '11px',
              }}
              formatter={(value: any, name: any) => [
                `${Number(value).toLocaleString()} (${((Number(value) / total) * 100).toFixed(1)}%)`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            {total.toLocaleString()}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
            Accounts
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="flex-1 pl-4 space-y-2.5">
        {data.map((item) => {
          const pct = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 font-medium">{item.name}</span>
              </div>
              <div className="font-semibold text-slate-900">
                {item.value.toLocaleString()} <span className="text-slate-400 font-normal">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
