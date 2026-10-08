'use client';

import React from 'react';
import {
  Info,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  X,
} from 'lucide-react';

export interface AlertProps {
  variant: 'info' | 'success' | 'error' | 'warning';
  title: string;
  description?: string;
  onClose?: () => void;
  className?: string;
}

export function Alert({
  variant,
  title,
  description,
  onClose,
  className = '',
}: AlertProps) {
  const configs = {
    // Information -> Blue #0099E5
    info: {
      container:
        'border-brand-200 bg-brand-50/90 text-brand-900 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-200',
      icon: <Info className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" />,
      closeBtn: 'text-brand-500 hover:bg-brand-100 dark:hover:bg-brand-900/40',
    },
    // Success -> Green #34BF49
    success: {
      container:
        'border-success-200 bg-success-50/90 text-success-900 dark:border-success-800 dark:bg-success-950/40 dark:text-success-200',
      icon: <CheckCircle2 className="h-5 w-5 text-success-500 shrink-0 mt-0.5" />,
      closeBtn: 'text-success-500 hover:bg-success-100 dark:hover:bg-success-900/40',
    },
    // Error -> Red #FF4C4C
    error: {
      container:
        'border-danger-200 bg-danger-50/90 text-danger-900 dark:border-danger-800 dark:bg-danger-950/40 dark:text-danger-200',
      icon: <AlertCircle className="h-5 w-5 text-danger-500 shrink-0 mt-0.5" />,
      closeBtn: 'text-danger-500 hover:bg-danger-100 dark:hover:bg-danger-900/40',
    },
    // Warning -> Amber #F59E0B
    warning: {
      container:
        'border-warning-200 bg-warning-50/90 text-warning-900 dark:border-warning-800 dark:bg-warning-950/40 dark:text-warning-200',
      icon: <AlertTriangle className="h-5 w-5 text-warning-500 shrink-0 mt-0.5" />,
      closeBtn: 'text-warning-500 hover:bg-warning-100 dark:hover:bg-warning-900/40',
    },
  };

  const current = configs[variant];

  return (
    <div
      role="alert"
      className={`relative flex items-start gap-3 rounded-2xl border p-4 shadow-xs transition-all ${current.container} ${className}`}
    >
      {current.icon}
      <div className="flex-1 min-w-0 pr-2">
        <h4 className="text-xs sm:text-sm font-bold leading-tight">{title}</h4>
        {description && (
          <p className="mt-1 text-xs opacity-90 leading-relaxed">{description}</p>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={`rounded-lg p-1 transition-colors ${current.closeBtn}`}
          aria-label="ปิดการแจ้งเตือน"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
