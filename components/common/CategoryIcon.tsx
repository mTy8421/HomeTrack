'use client';

import React from 'react';
import {
  Home,
  Car,
  Wind,
  Flame,
  Tv,
  Laptop,
  Zap,
  Wrench,
  Shield,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
}

export function CategoryIcon({ name, className = 'w-5 h-5', size }: CategoryIconProps) {
  const iconProps = { className, ...(size ? { size } : {}) };

  switch (name?.toLowerCase()) {
    case 'home':
    case 'cat-home':
      return <Home {...iconProps} />;
    case 'car':
    case 'cat-car':
      return <Car {...iconProps} />;
    case 'wind':
    case 'cat-ac':
    case 'airvent':
      return <Wind {...iconProps} />;
    case 'refrigerator':
    case 'cat-fridge':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
          <path d="M3 10h18" />
          <path d="M7 6v2" />
          <path d="M7 14v4" />
        </svg>
      );
    case 'washingmachine':
    case 'cat-washer':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M3 6h18v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" />
          <path d="M3 6V4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" />
          <circle cx="12" cy="14" r="4" />
          <path d="M12 12a2 2 0 0 1 2 2" />
        </svg>
      );
    case 'flame':
    case 'cat-water-heater':
    case 'water':
      return <Flame {...iconProps} />;
    case 'tv':
    case 'cat-tv':
      return <Tv {...iconProps} />;
    case 'laptop':
    case 'cat-computer':
      return <Laptop {...iconProps} />;
    case 'zap':
    case 'cat-appliance':
      return <Zap {...iconProps} />;
    case 'shield':
      return <Shield {...iconProps} />;
    case 'document':
      return <FileText {...iconProps} />;
    case 'wrench':
    case 'cat-other':
      return <Wrench {...iconProps} />;
    default:
      return <Sparkles {...iconProps} />;
  }
}

export function StatusBadge({
  status,
  label,
  className = '',
}: {
  status: 'green' | 'yellow' | 'red' | 'gray' | 'blue' | 'purple';
  label: string;
  className?: string;
}) {
  const styles = {
    green: 'bg-success-50 text-success-700 border-success-200 dark:bg-success-950/40 dark:text-success-300 dark:border-success-800',
    yellow: 'bg-warning-50 text-warning-700 border-warning-200 dark:bg-warning-950/40 dark:text-warning-300 dark:border-warning-800',
    red: 'bg-danger-50 text-danger-700 border-danger-200 dark:bg-danger-950/40 dark:text-danger-300 dark:border-danger-800',
    gray: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    blue: 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-950/40 dark:text-brand-300 dark:border-brand-800',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800',
  };

  const icons = {
    green: <CheckCircle2 className="w-3.5 h-3.5 inline mr-1 text-success-500" />,
    yellow: <Clock className="w-3.5 h-3.5 inline mr-1 text-warning-500" />,
    red: <AlertCircle className="w-3.5 h-3.5 inline mr-1 text-danger-500" />,
    gray: null,
    blue: <Sparkles className="w-3.5 h-3.5 inline mr-1 text-brand-500" />,
    purple: null,
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]} ${className}`}
    >
      {icons[status]}
      {label}
    </span>
  );
}
