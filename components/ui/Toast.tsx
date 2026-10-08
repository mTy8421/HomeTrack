'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'danger' | 'warning' | 'info';

export type ToastMessage = {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
};

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isDanger = toast.type === 'danger';
        const isWarning = toast.type === 'warning';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-lg backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 fade-in duration-200 ${
              isSuccess
                ? 'bg-white/95 border-success-200 text-slate-800 shadow-success-500/5'
                : isDanger
                ? 'bg-white/95 border-danger-200 text-slate-800 shadow-danger-500/5'
                : isWarning
                ? 'bg-white/95 border-warning-200 text-slate-800 shadow-warning-500/5'
                : 'bg-white/95 border-brand-200 text-slate-800 shadow-brand-500/5'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="h-5 w-5 text-success-500" />}
              {isDanger && <AlertCircle className="h-5 w-5 text-danger-500" />}
              {isWarning && <AlertTriangle className="h-5 w-5 text-warning-500" />}
              {isInfo && <Info className="h-5 w-5 text-brand-500" />}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-xs font-bold text-slate-900 leading-snug">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="mt-0.5 text-[11px] text-slate-500 leading-normal">
                  {toast.message}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 rounded-lg p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="ปิดการแจ้งเตือน"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
