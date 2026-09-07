'use client';

import React from 'react';
import { TopFactor } from '@/lib/types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ReferenceLine,
  Cell,
  Tooltip,
} from 'recharts';

interface FactorBarChartProps {
  factors: TopFactor[];
}

export const FactorBarChart: React.FC<FactorBarChartProps> = ({ factors }) => {
  // Format data for Recharts horizontal display
  const chartData = factors.map((f) => ({
    feature: f.feature,
    impact: Math.round(f.impact * 100) / 100,
    absImpact: Math.abs(f.impact),
    direction: f.impact >= 0 ? 'Risk Driver' : 'Retention Driver',
  }));

  return (
    <div className="w-full h-56 select-none">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            type="number"
            domain={[-0.4, 0.4]}
            tickFormatter={(v) => `${v > 0 ? '+' : ''}${Math.round(v * 100)}%`}
            stroke="#94A3B8"
            fontSize={10}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="feature"
            stroke="#475569"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={110}
          />
          <ReferenceLine x={0} stroke="#CBD5E1" strokeWidth={1.5} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#12233D',
              border: 'none',
              borderRadius: '6px',
              color: '#FFFFFF',
              fontSize: '11px',
            }}
            formatter={(value: any, name: any, item: any) => [
              `${value > 0 ? '+' : ''}${Math.round(Number(value) * 100)}% (${item.payload.direction})`,
              'Impact on Churn',
            ]}
          />
          <Bar dataKey="impact" radius={[3, 3, 3, 3]} barSize={16}>
            {chartData.map((entry, index) => {
              // Positive impact increases churn (accent amber / crimson)
              // Negative impact protects retention (muted green / dark navy)
              const color = entry.impact >= 0 ? '#C77D2E' : '#2E6B4E';
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
