'use client';

import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  Clock,
} from 'lucide-react';

export interface BadgeProps {
  variant: 'primary' | 'success' | 'danger' | 'warning' | 'neutral';
  children: React.ReactNode;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  variant,
  children,
  icon,
  size = 'md',
  className = '',
}: BadgeProps) {
  // Styles based on Core Brand Tokens
  const variantStyles = {
    // Primary Blue: #0099E5
    primary:
      'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-950/40 dark:text-brand-300 dark:border-brand-800',
    // Success Green: #34BF49
    success:
      'bg-success-50 text-success-700 border-success-200 dark:bg-success-950/40 dark:text-success-300 dark:border-success-800',
    // Danger Red: #FF4C4C
    danger:
      'bg-danger-50 text-danger-700 border-danger-200 dark:bg-danger-950/40 dark:text-danger-300 dark:border-danger-800',
    // Warning Amber: #F59E0B
    warning:
      'bg-warning-50 text-warning-700 border-warning-200 dark:bg-warning-950/40 dark:text-warning-300 dark:border-warning-800',
    // Neutral Slate
    neutral:
      'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };

  // Default accessible icons to avoid relying on color alone!
  const defaultIcons = {
    primary: <Info className="h-3 w-3 shrink-0" />,
    success: <CheckCircle2 className="h-3 w-3 shrink-0" />,
    danger: <AlertCircle className="h-3 w-3 shrink-0" />,
    warning: <Clock className="h-3 w-3 shrink-0" />,
    neutral: null,
  };

  const currentIcon = icon !== undefined ? icon : defaultIcons[variant];

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {currentIcon}
      <span>{children}</span>
    </span>
  );
}
