'use client';

import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { QuickActionModal } from './QuickActionModal';
import { GlobalSearchModal } from '@/components/search/GlobalSearchModal';

import { useApp } from '@/context/AppContext';
import { ToastContainer } from '@/components/ui/Toast';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { toasts, dismissToast, confirmConfig, closeConfirmModal } = useApp();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-4 pb-24 md:p-8 md:pb-12 max-w-7xl w-full mx-auto">
          {children}
        </main>
        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>

      {/* Global Floating Modals */}
      <QuickActionModal />
      <GlobalSearchModal />

      {/* Global Feedback & Confirmation */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmLabel={confirmConfig.confirmLabel}
        cancelLabel={confirmConfig.cancelLabel}
        variant={confirmConfig.variant}
        onConfirm={confirmConfig.onConfirm}
        onCancel={closeConfirmModal}
      />
    </div>
  );
}
