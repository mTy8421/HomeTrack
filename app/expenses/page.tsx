'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import {
  Receipt,
  Plus,
  Search,
  FileText,
  Trash2,
} from 'lucide-react';
import {
  CURRENT_DATE_STR,
  formatDateThai,
  formatCurrency,
  EXPENSE_CATEGORIES,
} from '@/lib/constants';
import { ExpenseFormModal } from '@/components/expenses/ExpenseFormModal';

export default function ExpensesPage() {
  const { assets, expenses, documents, deleteExpense, showToast, confirmModal, isLoading } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAssetId, setSelectedAssetId] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Metrics calculation
  const [curYear, curMonth] = CURRENT_DATE_STR.split('-').map(Number);
  const monthNames = ['', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

  let monthCost = 0;
  let yearCost = 0;
  let maintCost = 0;
  let repairCost = 0;
  let insuranceCost = 0;

  expenses.forEach((e) => {
    const [y, m] = e.date.split('-').map(Number);
    if (y === curYear) {
      yearCost += e.amount;
      if (m === curMonth) {
        monthCost += e.amount;
      }
    }
    if (e.category === 'maintenance') maintCost += e.amount;
    if (e.category === 'repair') repairCost += e.amount;
    if (e.category === 'insurance') insuranceCost += e.amount;
  });

  // Filtered expenses
  const filteredExpenses = expenses
    .filter((e) => {
      if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
      if (selectedAssetId !== 'all' && e.assetId !== selectedAssetId) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchDesc = e.description.toLowerCase().includes(q);
        const matchProv = e.provider?.toLowerCase().includes(q);
        const asset = assets.find((a) => a.id === e.assetId);
        const matchAsset = asset ? asset.name.toLowerCase().includes(q) : false;
        if (!matchDesc && !matchProv && !matchAsset) return false;
      }

      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDelete = (id: string, desc: string) => {
    confirmModal({
      title: 'ยืนยันการลบค่าใช้จ่าย',
      message: `คุณต้องการลบรายการค่าใช้จ่าย "${desc}" ใช่หรือไม่? ยอดรวมค่าใช้จ่ายจะถูกคำนวณใหม่`,
      confirmLabel: 'ลบรายการ',
      cancelLabel: 'ยกเลิก',
      variant: 'danger',
      onConfirm: () => {
        deleteExpense(id);
        showToast('ลบค่าใช้จ่ายสำเร็จ', `ลบรายการ "${desc}" เรียบร้อยแล้ว`, 'success');
      },
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl flex items-center gap-2">
              <Receipt className="h-6 w-6 text-emerald-600" />
              <span>บันทึกและวิเคราะห์ค่าใช้จ่าย (Expense Tracking)</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              ติดตามค่าซ่อม บำรุงรักษา ประกันภัย อะไหล่ และน้ำมันทั้งหมด
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>+ บันทึกค่าใช้จ่ายใหม่</span>
          </button>
        </div>

        {/* Summary Metric Cards (Prompt requirement 9) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-[11px] text-slate-400 font-medium">เดือนนี้ ({monthNames[curMonth] || ''} {curYear + 543})</span>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {formatCurrency(monthCost)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">ยอดใช้จ่ายเดือนปัจจุบัน</div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-[11px] text-slate-400 font-medium">ปีนี้ ({curYear})</span>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
              {formatCurrency(yearCost)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">สะสมตั้งแต่ต้นปี</div>
          </div>

          <div className="rounded-2xl border border-sky-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-[11px] text-slate-400 font-medium">ค่า Maintenance</span>
            <div className="text-lg font-bold text-sky-600 dark:text-sky-400 mt-1">
              {formatCurrency(maintCost)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">ล้างแอร์ เช็กระยะ</div>
          </div>

          <div className="rounded-2xl border border-rose-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-[11px] text-slate-400 font-medium">ค่า Repair (งานซ่อม)</span>
            <div className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-1">
              {formatCurrency(repairCost)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">ซ่อมแซมและเปลี่ยนชิ้นส่วน</div>
          </div>

          <div className="rounded-2xl border border-purple-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-[11px] text-slate-400 font-medium">ค่า Insurance (ประกัน)</span>
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-1">
              {formatCurrency(insuranceCost)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">เบี้ยประกันบ้านและรถ</div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              ทั้งหมด
            </button>
            {EXPENSE_CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold shrink-0 transition-all ${
                  selectedCategory === c.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <select
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs outline-hidden dark:border-slate-800 dark:bg-slate-800"
            >
              <option value="all">ทรัพย์สินทั้งหมด</option>
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>

            <div className="relative w-44">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหา..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1 pl-8 pr-2 text-xs outline-hidden dark:border-slate-800 dark:bg-slate-800/60"
              />
            </div>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/70 font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3">วันที่</th>
                  <th className="px-4 py-3">ทรัพย์สิน</th>
                  <th className="px-4 py-3">รายละเอียดค่าใช้จ่าย</th>
                  <th className="px-4 py-3">หมวดหมู่</th>
                  <th className="px-4 py-3">ร้านค้า / ผู้ให้บริการ</th>
                  <th className="px-4 py-3">ใบเสร็จ</th>
                  <th className="px-4 py-3 text-right">จำนวนเงิน</th>
                  <th className="px-4 py-3 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      <div className="flex justify-center items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                        <span>กำลังโหลดข้อมูลค่าใช้จ่าย...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      ไม่พบรายการค่าใช้จ่ายตามเงื่อนไขที่เลือก
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((exp) => {
                    const asset = assets.find((a) => a.id === exp.assetId);
                    const doc = documents.find((d) => d.id === exp.receiptDocumentId);
                    const catObj = EXPENSE_CATEGORIES.find((c) => c.id === exp.category);

                    return (
                      <tr key={exp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          {formatDateThai(exp.date)}
                        </td>
                        <td className="px-4 py-3">
                          {asset ? (
                            <Link
                              href={`/assets/${asset.id}`}
                              className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                            >
                              {asset.name}
                            </Link>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                          {exp.description}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white inline-block"
                            style={{ backgroundColor: catObj?.color || '#64748b' }}
                          >
                            {catObj?.label || exp.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                          {exp.provider || '-'}
                        </td>
                        <td className="px-4 py-3">
                          {doc ? (
                            <a
                              href={doc.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-600 hover:underline"
                            >
                              <FileText className="h-3 w-3" />
                              <span>ดูใบเสร็จ</span>
                            </a>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-black text-slate-900 dark:text-white whitespace-nowrap">
                          {formatCurrency(exp.amount)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDelete(exp.id, exp.description)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ExpenseFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </AppLayout>
  );
}
