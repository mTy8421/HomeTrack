'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MaintenanceRecord } from '@/types';
import { CheckCircle2, X, Sparkles } from 'lucide-react';
import { CURRENT_DATE_STR } from '@/lib/constants';

interface CompleteMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MaintenanceRecord | null;
}

export function CompleteMaintenanceModal({
  isOpen,
  onClose,
  record,
}: CompleteMaintenanceModalProps) {
  if (!isOpen || !record) return null;

  return (
    <CompleteMaintenanceDialog
      key={record.id}
      record={record}
      onClose={onClose}
    />
  );
}

function CompleteMaintenanceDialog({
  record,
  onClose,
}: {
  record: MaintenanceRecord;
  onClose: () => void;
}) {
  const { assets, completeMaintenance, showToast } = useApp();

  const [completedDate, setCompletedDate] = useState(CURRENT_DATE_STR);
  const [actualCost, setActualCost] = useState(record.cost ? String(record.cost) : '0');
  const [provider, setProvider] = useState(record.provider || '');
  const [currentMileage, setCurrentMileage] = useState('');
  const [parts, setParts] = useState('');
  const [notes, setNotes] = useState('');

  const asset = assets.find((a) => a.id === record.assetId);
  const isVehicle = asset?.isVehicle;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const partsList = parts
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    completeMaintenance(record.id, {
      completedDate,
      cost: parseFloat(actualCost) || 0,
      provider: provider.trim() || undefined,
      mileage: isVehicle && currentMileage ? parseInt(currentMileage) : undefined,
      partsReplaced: partsList.length > 0 ? partsList : undefined,
      notes: notes.trim() || undefined,
    });

    showToast(
      'บันทึกงานเสร็จสิ้น',
      `บันทึกประวัติการบำรุงรักษา "${record.title}" สำเร็จ และคำนวณรอบถัดไปอัตโนมัติแล้ว`,
      'success'
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-50 text-success-600 dark:bg-success-950 dark:text-success-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                บันทึกการทำสำเร็จ (Mark Completed)
              </h2>
              <p className="text-xs text-slate-500">
                ระบบจะบันทึกประวัติ อัปเดตค่าใช้จ่าย และคำนวณรอบถัดไปอัตโนมัติ
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

        {/* Task Summary Banner */}
        <div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="font-semibold text-slate-900 dark:text-white text-xs">
            {record.title}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            ทรัพย์สิน: {asset?.name} ({asset?.location})
          </div>
          {record.isRecurring && (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              <span>
                รอบถัดไปจะถูกสร้างอัตโนมัติ: ทุก {record.intervalValue} {record.intervalUnit}
                {record.mileageInterval && ` หรือทุก ${record.mileageInterval} km`}
              </span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Completed Date */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              วันที่ทำเสร็จจริง *
            </label>
            <input
              type="date"
              required
              value={completedDate}
              onChange={(e) => setCompletedDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Actual Cost */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              ค่าใช้จ่ายจริง (บาท) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={actualCost}
              onChange={(e) => setActualCost(e.target.value)}
              placeholder="0"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              ระบบจะบันทึกเป็นรายการค่าใช้จ่าย (Expense) ของทรัพย์สินนี้ให้อัตโนมัติ
            </span>
          </div>

          {/* Vehicle Mileage */}
          {isVehicle && (
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                เลขไมล์ ณ วันที่ทำ (กม.)
              </label>
              <input
                type="number"
                value={currentMileage}
                onChange={(e) => setCurrentMileage(e.target.value)}
                placeholder={asset?.currentMileage ? `ไมล์เดิม: ${asset.currentMileage}` : 'เช่น 49200'}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                ไมล์จะถูกอัปเดตไปยังตัวรถเพื่อคำนวณรอบถัดไปทันที
              </span>
            </div>
          )}

          {/* Service Provider */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              ช่าง / อู่ / ผู้ให้บริการที่ทำ
            </label>
            <input
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="เช่น ช่างสมหมาย, B-Quik, ศูนย์ Toyota"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Replaced Parts */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              อะไหล่ที่เปลี่ยน (บรรทัดละ 1 รายการ)
            </label>
            <textarea
              rows={2}
              value={parts}
              onChange={(e) => setParts(e.target.value)}
              placeholder="เช่น น้ำมันเครื่องสังเคราะห์ 0W-20&#10;ไส้กรองน้ำมันเครื่อง&#10;แหวนรองน็อตถ่าย"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              บันทึกผลการเช็ก / ข้อสังเกต
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="เช่น ตรวจสอบแล้วระบบปกติ แอร์เย็นฉ่ำ ไม่มีกลิ่นอับ"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            />
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
              className="flex items-center gap-1.5 rounded-xl bg-success-500 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-success-600 active:bg-success-700 transition-all"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>ยืนยันทำเสร็จสิ้น</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
