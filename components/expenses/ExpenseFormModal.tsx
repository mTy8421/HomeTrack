'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ExpenseCategory } from '@/types';
import { X, Receipt, CheckCircle2 } from 'lucide-react';
import { CURRENT_DATE_STR, EXPENSE_CATEGORIES } from '@/lib/constants';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAssetId?: string;
}

export function ExpenseFormModal({
  isOpen,
  onClose,
  defaultAssetId,
}: ExpenseFormModalProps) {
  const { assets, documents, addExpense, showToast } = useApp();

  const [assetId, setAssetId] = useState(defaultAssetId || (assets[0]?.id || ''));
  const [category, setCategory] = useState<ExpenseCategory>('maintenance');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(CURRENT_DATE_STR);
  const [description, setDescription] = useState('');
  const [provider, setProvider] = useState('');
  const [receiptDocumentId, setReceiptDocumentId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetId) {
      showToast('กรุณาเลือกทรัพย์สิน', 'โปรดระบุทรัพย์สินที่เกี่ยวข้องกับค่าใช้จ่ายนี้', 'warning');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      showToast('กรุณาระบุจำนวนเงิน', 'โปรดใส่ยอดเงินที่ถูกต้องมากกว่า 0 บาท', 'warning');
      return;
    }
    if (!description.trim()) {
      showToast('กรุณาระบุรายละเอียด', 'โปรดใส่คำอธิบายค่าใช้จ่ายก่อนบันทึก', 'warning');
      return;
    }

    addExpense({
      assetId,
      category,
      amount: parseFloat(amount),
      date,
      description: description.trim(),
      provider: provider.trim() || undefined,
      receiptDocumentId: receiptDocumentId || undefined,
    });

    showToast('บันทึกค่าใช้จ่ายสำเร็จ', `บันทึกรายการ "${description.trim()}" ยอดเงิน ฿${parseFloat(amount).toLocaleString()} แล้ว`, 'success');

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                บันทึกค่าใช้จ่าย (Add Expense)
              </h2>
              <p className="text-xs text-slate-500">
                บันทึกค่าซ่อม ค่าดูแล ประกัน น้ำมัน หรือค่าอะไหล่
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* Linked Asset */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              ทรัพย์สินที่เกิดค่าใช้จ่าย *
            </label>
            <select
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            >
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.brand} - {a.location})
                </option>
              ))}
            </select>
          </div>

          {/* Category & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                หมวดหมู่ค่าใช้จ่าย *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                จำนวนเงิน (บาท) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="เช่น 2500"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Date & Provider */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                วันที่จ่าย *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                ร้านค้า / ผู้ให้บริการ
              </label>
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="เช่น B-Quik, Cockpit, ศูนย์บริการ"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              คำอธิบายรายการ *
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="เช่น เปลี่ยนน้ำมันเครื่องสังเคราะห์ 0W-20 พร้อมไส้กรอง"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Link to Document */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              แนบใบเสร็จจากคลังเอกสาร (ถ้ามี)
            </label>
            <select
              value={receiptDocumentId}
              onChange={(e) => setReceiptDocumentId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            >
              <option value="">-- ไม่ได้แนบเอกสาร --</option>
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.fileType.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>บันทึกค่าใช้จ่าย</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
