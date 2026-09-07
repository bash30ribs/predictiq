import React from 'react';
import { LucideIcon, FolderSearch, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FolderSearch,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={`border border-dashed border-slate-200 rounded-lg p-8 text-center flex flex-col items-center justify-center bg-white/60 ${
        className || ''
      }`}
    >
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-slate-900 mb-1">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

interface ErrorBannerProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  title = "Data Retrieval Error",
  message,
  onRetry,
  isRetrying = false,
  className,
}) => {
  return (
    <div
      className={`border border-[#F5B8B9] bg-[#FDF2F2] rounded-lg p-4 flex items-start justify-between gap-4 ${
        className || ''
      }`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[#9E2A2B] shrink-0 mt-0.5" />
        <div>
          <h5 className="text-sm font-semibold text-[#9E2A2B]">{title}</h5>
          <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">{message}</p>
        </div>
      </div>
      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          isLoading={isRetrying}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          onClick={onRetry}
          className="border-[#F5B8B9] text-[#9E2A2B] hover:bg-[#fae8e8] shrink-0 bg-white"
        >
          Retry
        </Button>
      )}
    </div>
  );
};
