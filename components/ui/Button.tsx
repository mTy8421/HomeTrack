'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'destructive' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  // Base styles
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer';

  // Variant styles based on Design System Core Colors
  const variants = {
    // Primary Blue: #0099E5
    primary:
      'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-sm shadow-brand-500/20 focus-visible:ring-brand-500',
    // Success Green: #34BF49
    success:
      'bg-success-500 text-white hover:bg-success-600 active:bg-success-700 shadow-sm shadow-success-500/20 focus-visible:ring-success-500',
    // Destructive Red: #FF4C4C
    destructive:
      'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700 shadow-sm shadow-danger-500/20 focus-visible:ring-danger-500',
    // Secondary Neutral
    secondary:
      'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 focus-visible:ring-slate-400',
    // Outline
    outline:
      'border border-slate-200 bg-transparent text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800/60 focus-visible:ring-slate-400',
    // Ghost
    ghost:
      'bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 focus-visible:ring-slate-400',
  };

  // Size styles
  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-xs px-4 py-2 gap-2 sm:text-sm sm:py-2.5',
    lg: 'text-sm px-5 py-3 gap-2.5 sm:text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
