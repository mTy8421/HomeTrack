'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Box,
  Clock,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  CalendarDays,
  TrendingUp,
} from 'lucide-react';
import { formatCurrency } from '@/lib/constants';
import Link from 'next/link';

export function SummaryCards() {
  const { stats } = useApp();

  const cards = [
    {
      title: 'ทรัพย์สินทั้งหมด',
      value: stats.totalAssets,
      unit: 'รายการ',
      icon: Box,
      href: '/assets',
      color: 'blue',
      badgeBg: 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300',
      iconBg: 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400',
    },
    {
      title: 'งานใกล้ถึงกำหนด',
      value: stats.dueSoonCount,
      unit: 'งาน (ใน 14 วัน)',
      icon: Clock,
      href: '/maintenance?tab=upcoming',
      color: 'yellow',
      highlight: stats.dueSoonCount > 0,
      badgeBg: 'bg-warning-50 text-warning-700 dark:bg-warning-950/60 dark:text-warning-300',
      iconBg: 'bg-warning-100 text-warning-600 dark:bg-warning-900/40 dark:text-warning-400',
    },
    {
      title: 'งานที่เลยกำหนด',
      value: stats.overdueCount,
      unit: 'งาน (ต้องทำด่วน)',
      icon: AlertTriangle,
      href: '/maintenance?tab=overdue',
      color: 'red',
      highlight: stats.overdueCount > 0,
      badgeBg: 'bg-danger-50 text-danger-700 dark:bg-danger-950/60 dark:text-danger-300',
      iconBg: 'bg-danger-100 text-danger-600 dark:bg-danger-900/40 dark:text-danger-400',
    },
    {
      title: 'Warranty ใกล้หมด',
      value: stats.expiringWarrantyCount,
      unit: 'ชิ้น (ใน 30 วัน)',
      icon: ShieldCheck,
      href: '/warranty?tab=warranty',
      color: 'purple',
      badgeBg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
      iconBg: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
    },
    {
      title: 'Insurance ใกล้หมด',
      value: stats.expiringInsuranceCount,
      unit: 'กรมธรรม์',
      icon: ShieldAlert,
      href: '/warranty?tab=insurance',
      color: 'indigo',
      badgeBg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
      iconBg: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400',
    },
    {
      title: 'ค่าใช้จ่ายเดือนนี้',
      value: formatCurrency(stats.monthExpense),
      unit: 'ต.ค. 2569',
      icon: CalendarDays,
      href: '/expenses',
      color: 'emerald',
      badgeBg: 'bg-success-50 text-success-700 dark:bg-success-950/60 dark:text-success-300',
      iconBg: 'bg-success-100 text-success-600 dark:bg-success-900/40 dark:text-success-400',
    },
    {
      title: 'ค่าใช้จ่ายปีนี้ (2026)',
      value: formatCurrency(stats.yearExpense),
      unit: 'รวมทั้งปี',
      icon: TrendingUp,
      href: '/expenses',
      color: 'sky',
      badgeBg: 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300',
      iconBg: 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Link
            key={c.title}
            href={c.href}
            className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900 ${
              c.highlight && c.color === 'red'
                ? 'border-danger-300 dark:border-danger-900 ring-1 ring-danger-200 dark:ring-danger-900/50'
                : c.highlight && c.color === 'yellow'
                ? 'border-warning-300 dark:border-warning-900'
                : 'border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1">
                {c.title}
              </span>
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${c.iconBg}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="mt-2">
              <div className="text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate">
                {c.value}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                {c.unit}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
