import React from 'react';
import { RiskLevel, ConfidenceLevel } from '@/lib/types';
import { RiskBadge, ConfidenceBadge } from '@/components/ui/Badge';
import { getRiskColorStyles } from '@/lib/utils';

interface RiskGaugeProps {
  probability: number; // 0.0 - 1.0
  riskLevel: RiskLevel;
  confidence: ConfidenceLevel;
  size?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  probability,
  riskLevel,
  confidence,
  size = 180,
}) => {
  const percentage = Math.round(probability * 100);
  const styles = getRiskColorStyles(riskLevel);

  // SVG Gauge calculations (semi-circle)
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-3">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size / 1.7 }}>
        <svg
          width={size}
          height={size / 1.6}
          viewBox={`0 0 ${size} ${size / 1.6}`}
          className="overflow-visible"
        >
          {/* Background track arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Value active arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke={styles.hex}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Text inside gauge */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <span className="text-3xl font-bold tracking-tight text-slate-900 leading-none">
            {percentage}%
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 mt-1">
            Churn Probability
          </span>
        </div>
      </div>

      {/* Badges footer */}
      <div className="flex items-center gap-2 mt-3">
        <RiskBadge level={riskLevel} />
        <ConfidenceBadge level={confidence} />
      </div>
    </div>
  );
};
