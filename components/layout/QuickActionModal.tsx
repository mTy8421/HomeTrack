'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Box, Wrench, UploadCloud, Receipt, X } from 'lucide-react';
import { AssetFormModal } from '@/components/assets/AssetFormModal';
import { MaintenanceFormModal } from '@/components/maintenance/MaintenanceFormModal';
import { DocumentUploadModal } from '@/components/documents/DocumentUploadModal';
import { ExpenseFormModal } from '@/components/expenses/ExpenseFormModal';

export function QuickActionModal() {
  const { isQuickActionOpen, setIsQuickActionOpen } = useApp();

  const [activeForm, setActiveForm] = useState<'none' | 'asset' | 'maintenance' | 'document' | 'expense'>('none');

  const handleOpenForm = (type: 'asset' | 'maintenance' | 'document' | 'expense') => {
    setIsQuickActionOpen(false);
    setActiveForm(type);
  };

  return (
    <>
      {isQuickActionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setIsQuickActionOpen(false)} />

          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-10">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                เพิ่มข้อมูลด่วน (Quick Actions)
              </h2>
              <p className="text-xs text-slate-500">
                เลือกประเภทรายการที่ต้องการบันทึกลงในระบบ
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsQuickActionOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-left">
            <button
              type="button"
              onClick={() => handleOpenForm('asset')}
              className="flex flex-col items-start gap-2.5 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 transition-all hover:bg-blue-100/70 dark:border-blue-900/40 dark:bg-blue-950/30 dark:hover:bg-blue-900/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                <Box className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold text-blue-900 dark:text-blue-300 text-xs">
                  เพิ่มทรัพย์สินใหม่
                </div>
                <div className="text-[11px] text-blue-700/80 dark:text-blue-400 mt-0.5">
                  บ้าน รถยนต์ แอร์ เครื่องใช้
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleOpenForm('maintenance')}
              className="flex flex-col items-start gap-2.5 rounded-2xl border border-amber-100 bg-amber-50/60 p-4 transition-all hover:bg-amber-100/70 dark:border-amber-900/40 dark:bg-amber-950/30 dark:hover:bg-amber-900/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold text-amber-900 dark:text-amber-300 text-xs">
                  บันทึกการบำรุงรักษา
                </div>
                <div className="text-[11px] text-amber-700/80 dark:text-amber-400 mt-0.5">
                  ล้างแอร์ เช็กระยะ น้ำมันเครื่อง
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleOpenForm('document')}
              className="flex flex-col items-start gap-2.5 rounded-2xl border border-purple-100 bg-purple-50/60 p-4 transition-all hover:bg-purple-100/70 dark:border-purple-900/40 dark:bg-purple-950/30 dark:hover:bg-purple-900/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold text-purple-900 dark:text-purple-300 text-xs">
                  อัปโหลดเอกสาร
                </div>
                <div className="text-[11px] text-purple-700/80 dark:text-purple-400 mt-0.5">
                  คู่มือ ใบเสร็จ กรมธรรม์
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleOpenForm('expense')}
              className="flex flex-col items-start gap-2.5 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 transition-all hover:bg-emerald-100/70 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold text-emerald-900 dark:text-emerald-300 text-xs">
                  บันทึกค่าใช้จ่าย
                </div>
                <div className="text-[11px] text-emerald-700/80 dark:text-emerald-400 mt-0.5">
                  ค่าซ่อม อะไหล่ ประกัน ภาษี
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    )}

      {/* Sub Modals */}
      <AssetFormModal
        isOpen={activeForm === 'asset'}
        onClose={() => setActiveForm('none')}
      />
      <MaintenanceFormModal
        isOpen={activeForm === 'maintenance'}
        onClose={() => setActiveForm('none')}
      />
      <DocumentUploadModal
        isOpen={activeForm === 'document'}
        onClose={() => setActiveForm('none')}
      />
      <ExpenseFormModal
        isOpen={activeForm === 'expense'}
        onClose={() => setActiveForm('none')}
      />
    </>
  );
}
