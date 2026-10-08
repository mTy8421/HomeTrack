'use client';

import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export interface FormFieldProps {
  label?: string;
  state?: 'normal' | 'valid' | 'invalid';
  helperText?: string;
  errorMessage?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  state = 'normal',
  helperText,
  errorMessage,
  required,
  children,
  className = '',
}: FormFieldProps) {
  return (
    <div className={`space-y-1.5 text-xs ${className}`}>
      {label && (
        <label className="block font-medium text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-danger-500 font-bold">*</span>}
        </label>
      )}

      <div className="relative">{children}</div>

      {/* State Feedback messages */}
      {state === 'invalid' && (
        <div className="flex items-center gap-1.5 text-danger-500 font-medium text-[11px] animate-in fade-in">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{errorMessage || 'ข้อมูลไม่ถูกต้อง'}</span>
        </div>
      )}

      {state === 'valid' && (
        <div className="flex items-center gap-1.5 text-success-500 font-medium text-[11px] animate-in fade-in">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <span>ข้อมูลถูกต้อง</span>
        </div>
      )}

      {state === 'normal' && helperText && (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      )}
    </div>
  );
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  state?: 'normal' | 'valid' | 'invalid';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ state = 'normal', className = '', ...props }, ref) => {
    // Style by state
    const stateStyles = {
      // Normal: Neutral, Focus: Blue #0099E5
      normal:
        'border-slate-200 bg-white text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-brand-500',
      // Valid: Green #34BF49
      valid:
        'border-success-500 bg-success-50/20 text-slate-900 focus:border-success-600 focus:ring-2 focus:ring-success-500/20 dark:border-success-500 dark:bg-slate-900 dark:text-white',
      // Invalid: Red #FF4C4C
      invalid:
        'border-danger-500 bg-danger-50/20 text-slate-900 focus:border-danger-600 focus:ring-2 focus:ring-danger-500/20 dark:border-danger-500 dark:bg-slate-900 dark:text-white',
    };

    return (
      <input
        ref={ref}
        className={`w-full rounded-xl border px-3 py-2 text-xs outline-hidden transition-all duration-150 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed dark:disabled:bg-slate-800 ${stateStyles[state]} ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
