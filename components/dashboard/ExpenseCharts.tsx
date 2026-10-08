'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency, EXPENSE_CATEGORIES, CURRENT_DATE_STR } from '@/lib/constants';
import { TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function ExpenseCharts() {
  const { expenses, assets } = useApp();
  const [activeTab, setActiveTab] = useState<'monthly' | 'category' | 'asset'>('monthly');

  const currentYear = parseInt(CURRENT_DATE_STR.split('-')[0], 10) || new Date().getFullYear();
  const currentMonthNum = parseInt(CURRENT_DATE_STR.split('-')[1], 10) || (new Date().getMonth() + 1);

  // Month bars (Full 12 months)
  const months = [
    { num: 1, name: 'ม.ค.' },
    { num: 2, name: 'ก.พ.' },
    { num: 3, name: 'มี.ค.' },
    { num: 4, name: 'เม.ย.' },
    { num: 5, name: 'พ.ค.' },
    { num: 6, name: 'มิ.ย.' },
    { num: 7, name: 'ก.ค.' },
    { num: 8, name: 'ส.ค.' },
    { num: 9, name: 'ก.ย.' },
    { num: 10, name: 'ต.ค.' },
    { num: 11, name: 'พ.ย.' },
    { num: 12, name: 'ธ.ค.' },
  ];

  const currentMonthName = months.find((m) => m.num === currentMonthNum)?.name || 'ต.ค.';

  const monthlyTotals = months.map((m) => {
    let total = 0;
    expenses.forEach((e) => {
      const [year, month] = e.date.split('-').map(Number);
      if (year === currentYear && month === m.num) {
        total += e.amount;
      }
    });
    return { ...m, total };
  });

  const maxMonthly = Math.max(...monthlyTotals.map((m) => m.total), 20000);

  // By Category Breakdown
  const categoryTotals = EXPENSE_CATEGORIES.map((cat) => {
    let total = 0;
    expenses.forEach((e) => {
      if (e.category === cat.id) {
        total += e.amount;
      }
    });
    return { ...cat, total };
  }).filter((c) => c.total > 0);

  const totalAllExpenses = categoryTotals.reduce((sum, c) => sum + c.total, 0) || 1;

  // By Asset Breakdown
  const assetTotals = assets.map((a) => {
    let total = 0;
    expenses.forEach((e) => {
      if (e.assetId === a.id) {
        total += e.amount;
      }
    });
    return { id: a.id, name: a.name, brand: a.brand, total };
  }).filter((a) => a.total > 0).sort((a, b) => b.total - a.total);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              แนวโน้มและสัดส่วนค่าใช้จ่าย (Expense Analytics)
            </h3>
            <p className="text-[11px] text-slate-400">
              วิเคราะห์ค่าดูแลรักษา บ้าน รถยนต์ และทรัพย์สิน
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('monthly')}
            className={`rounded-lg px-2.5 py-1 transition-all ${
              activeTab === 'monthly'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            รายเดือน ({currentYear})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('category')}
            className={`rounded-lg px-2.5 py-1 transition-all ${
              activeTab === 'category'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            แยกตามประเภท
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('asset')}
            className={`rounded-lg px-2.5 py-1 transition-all ${
              activeTab === 'asset'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            แยกตามทรัพย์สิน
          </button>
        </div>
      </div>

      <div className="mt-5">
        {activeTab === 'monthly' && (
          <div>
            {/* SVG / Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-44 pt-6 px-2">
              {monthlyTotals.map((m) => {
                const heightPercent = m.total > 0 ? Math.max((m.total / maxMonthly) * 100, 8) : 4;
                const isCurrent = m.num === currentMonthNum;
                return (
                  <div key={m.num} className="flex-1 flex flex-col items-center h-full justify-end group">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded px-1.5 py-0.5 mb-1 whitespace-nowrap pointer-events-none shadow-md">
                      {m.total > 0 ? formatCurrency(m.total) : '฿0'}
                    </div>

                    {/* Bar */}
                    <div className="w-full max-w-[28px] h-28 bg-slate-100 rounded-t-lg overflow-hidden flex items-end dark:bg-slate-800">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          isCurrent
                            ? 'bg-success-500 group-hover:bg-success-600'
                            : m.total > 10000
                            ? 'bg-brand-500 group-hover:bg-brand-600'
                            : m.total > 0
                            ? 'bg-brand-300 group-hover:bg-brand-400'
                            : 'bg-transparent'
                        }`}
                      />
                    </div>

                    {/* Month Label */}
                    <span
                      className={`text-[10px] mt-2 font-medium ${
                        isCurrent
                          ? 'text-success-600 font-bold dark:text-success-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {m.name}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-success-500 inline-block" />
                เดือนปัจจุบัน ({currentMonthName} {currentYear + 543})
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-500 inline-block" />
                เดือนที่มียอดสูง (เช่น เปลี่ยนยาง/ซ่อมใหญ่)
              </span>
            </div>
          </div>
        )}

        {activeTab === 'category' && (
          <div className="space-y-3">
            {categoryTotals.map((cat) => {
              const pct = Math.round((cat.total / totalAllExpenses) * 100);
              return (
                <div key={cat.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full inline-block"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">{pct}%</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(cat.total)}
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'asset' && (
          <div className="space-y-3">
            {assetTotals.map((a) => {
              const pct = Math.round((a.total / totalAllExpenses) * 100);
              return (
                <div key={a.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <Link
                      href={`/assets/${a.id}`}
                      className="font-semibold text-slate-800 hover:text-blue-600 dark:text-slate-200 truncate max-w-[240px]"
                    >
                      {a.name}
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">{pct}%</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(a.total)}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
