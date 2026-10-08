'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { UpcomingTasks } from '@/components/dashboard/UpcomingTasks';
import { ExpenseCharts } from '@/components/dashboard/ExpenseCharts';
import { MyAssetsPreview } from '@/components/dashboard/MyAssetsPreview';
import { useApp } from '@/context/AppContext';
import { Plus, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, setIsQuickActionOpen } = useApp();

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome & Quick Action Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 relative overflow-hidden">
          <div className="relative z-10 space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-0.5 text-[11px] font-semibold text-brand-700 border border-brand-200/80 dark:bg-brand-950/60 dark:text-brand-300 dark:border-brand-900">
              <Sparkles className="h-3.5 w-3.5 text-warning-500" />
              <span>ภาพรวมการดูแลรักษาบ้านและทรัพย์สิน</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              สวัสดีคุณ {user.name} 👋
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              ติดตามรอบการบำรุงรักษา ประกันภัย เอกสารสำคัญ และค่าใช้จ่ายทั้งหมดของครอบครัวในระบบเดียว
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsQuickActionOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-brand-600 active:bg-brand-700 transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>+ เพิ่มข้อมูลด่วน</span>
            </button>
            <Link
              href="/calendar"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-all"
            >
              <span>ดูปฏิทินงาน</span>
            </Link>
          </div>
        </div>

        {/* 1. Summary Cards (7 metrics) */}
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              สถานะภาพรวม (Overview Status)
            </h2>
          </div>
          <SummaryCards />
        </section>

        {/* 2. Middle Row: Upcoming Tasks & Expense Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UpcomingTasks />
          <ExpenseCharts />
        </section>

        {/* 3. My Assets Preview Grid */}
        <section>
          <MyAssetsPreview />
        </section>
      </div>
    </AppLayout>
  );
}
