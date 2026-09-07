import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-9 px-4 text-sm gap-2',
      lg: 'h-11 px-5 text-base gap-2.5',
    }[size];

    const variantClasses = {
      primary:
        'bg-[#12233D] text-white hover:bg-[#1c3459] active:bg-[#0a1424] border border-[#12233D] shadow-xs',
      secondary:
        'bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200',
      outline:
        'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 hover:border-slate-400',
      ghost:
        'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent',
      danger:
        'bg-[#9E2A2B] text-white hover:bg-[#852324] border border-[#9E2A2B]',
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-md transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12233D] focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          sizeClasses,
          variantClasses,
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
