import React from 'react';
import { cn } from '@/lib/utils';
import { RiskLevel, ConfidenceLevel } from '@/lib/types';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
  showDot?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, className, showDot = true }) => {
  const styles = {
    LOW: {
      wrapper: "bg-[#EBF5F0] text-[#2E6B4E] border-[#A3D9BE]",
      dot: "bg-[#2E6B4E]",
      label: "Low Risk",
    },
    MEDIUM: {
      wrapper: "bg-[#FEF7ED] text-[#C77D2E] border-[#F8D29F]",
      dot: "bg-[#C77D2E]",
      label: "Med Risk",
    },
    HIGH: {
      wrapper: "bg-[#FDF2F2] text-[#9E2A2B] border-[#F5B8B9]",
      dot: "bg-[#9E2A2B]",
      label: "High Risk",
    },
  }[level] || {
    wrapper: "bg-slate-100 text-slate-700 border-slate-300",
    dot: "bg-slate-500",
    label: level,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-tight",
        styles.wrapper,
        className
      )}
    >
      {showDot && <span className={cn("w-1.5 h-1.5 rounded-full", styles.dot)} />}
      {styles.label}
    </span>
  );
};

export const ConfidenceBadge: React.FC<{ level: ConfidenceLevel; className?: string }> = ({
  level,
  className,
}) => {
  const color = {
    HIGH: "text-slate-700 bg-slate-100 border-slate-200",
    MEDIUM: "text-slate-600 bg-slate-50 border-slate-200",
    LOW: "text-slate-500 bg-slate-50 border-slate-200",
  }[level];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border uppercase tracking-wider",
        color,
        className
      )}
    >
      {level} Conf.
    </span>
  );
};

export const StatusPill: React.FC<{
  status: string;
  variant?: 'neutral' | 'success' | 'warning' | 'danger';
  className?: string;
}> = ({ status, variant = 'neutral', className }) => {
  const variantStyles = {
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-[#EBF5F0] text-[#2E6B4E] border-[#A3D9BE]",
    warning: "bg-[#FEF7ED] text-[#C77D2E] border-[#F8D29F]",
    danger: "bg-[#FDF2F2] text-[#9E2A2B] border-[#F5B8B9]",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
        variantStyles,
        className
      )}
    >
      {status}
    </span>
  );
};
