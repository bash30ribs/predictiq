'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { MonthlyTrendPoint } from '@/lib/types';

interface ChurnTrendChartProps {
  data: MonthlyTrendPoint[];
}

export const ChurnTrendChart: React.FC<ChurnTrendChartProps> = ({ data }) => {
  return (
    <div className="w-full h-64 select-none">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#E2E8F0' }}
          />
          <YAxis
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            unit="%"
            domain={[18, 32]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#12233D',
              border: 'none',
              borderRadius: '6px',
              color: '#FFFFFF',
              fontSize: '11px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            formatter={(value: any, name: any) => [
              value !== null && value !== undefined ? `${value}%` : 'N/A',
              name === 'actual_churn_rate' ? 'Actual Churn Rate' : 'ML Forecast',
            ]}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ fontSize: '11px', paddingBottom: '12px' }}
            formatter={(val) => (val === 'actual_churn_rate' ? 'Actual Churn' : 'ML Forecast (XGBoost)')}
          />
          <Line
            type="monotone"
            dataKey="actual_churn_rate"
            stroke="#12233D"
            strokeWidth={2.2}
            dot={{ r: 3, fill: '#12233D' }}
            activeDot={{ r: 5 }}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="predicted_churn_rate"
            stroke="#C77D2E"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 2.5, fill: '#C77D2E' }}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
