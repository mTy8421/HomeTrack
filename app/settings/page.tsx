'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import {
  Settings as SettingsIcon,
  Home,
  Tag,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  Trash2,
  Plus,
  Shield,
  Sun,
  Moon,
} from 'lucide-react';
import { CategoryIcon } from '@/components/common/CategoryIcon';

export default function SettingsPage() {
  const {
    settings,
    updateSettings,
    categories,
    addCategory,
    deleteCategory,
    resetToDemo,
    exportDataJson,
    importDataJson,
    user,
    setUser,
    showToast,
    confirmModal,
  } = useApp();

  const [householdName, setHouseholdName] = useState(settings.householdName);
  const [userName, setUserName] = useState(user.name);
  const [userEmail, setUserEmail] = useState(user.email);
  const [reminderDays, setReminderDays] = useState<number[]>(settings.reminderDays || [30, 14, 7, 3, 1, 0]);
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark'>(settings.theme || 'light');
  const [newCatName, setNewCatName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleReminderDay = (day: number) => {
    if (reminderDays.includes(day)) {
      setReminderDays(reminderDays.filter((d) => d !== day));
    } else {
      setReminderDays([...reminderDays, day].sort((a, b) => b - a));
    }
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      householdName: householdName.trim(),
      reminderDays,
      theme: selectedTheme,
    });
    setUser({
      ...user,
      name: userName.trim(),
      email: userEmail.trim(),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim(), 'Box');
    setNewCatName('');
  };

  const handleExport = () => {
    const json = exportDataJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hometrack-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const text = uploadEvent.target?.result as string;
        if (text) {
          const success = importDataJson(text);
          if (success) {
            showToast('นำเข้าข้อมูลสำเร็จ', 'ระบบได้โหลดข้อมูลสำรองของคุณเรียบร้อยแล้ว', 'success');
          } else {
            showToast('นำเข้าข้อมูลไม่สำเร็จ', 'ไฟล์ JSON ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง', 'danger');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-slate-700 dark:text-slate-300" />
            <span>การตั้งค่าระบบ (Settings & Customization)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ปรับแต่งพื้นที่จัดการ กฎการแจ้งเตือนเตือนล่วงหน้า และสำรองข้อมูล
          </p>
        </div>

        {saveSuccess && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-xs font-semibold flex items-center gap-2 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4" />
            <span>บันทึกการตั้งค่าเรียบร้อยแล้ว</span>
          </div>
        )}

        {/* 1. General Info & User Profile */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
            <Home className="h-5 w-5 text-blue-600" />
            <h2 className="font-bold text-slate-900 dark:text-white text-sm">
              ข้อมูลพื้นที่จัดการและผู้ใช้งาน (Household & Profile)
            </h2>
          </div>

          <form onSubmit={handleSaveGeneral} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  ชื่อบ้าน / สถานที่จัดการ *
                </label>
                <input
                  type="text"
                  required
                  value={householdName}
                  onChange={(e) => setHouseholdName(e.target.value)}
                  placeholder="เช่น บ้านสุขุมวิท 71 & ทรัพย์สินครอบครัว"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  ชื่อผู้ใช้งาน *
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="เช่น สมชาย มั่นคง"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                อีเมลติดต่อ
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="somchai@hometrack.th"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Requirement 6: Reminder Intervals */}
            <div className="pt-2">
              <label className="block font-semibold text-slate-900 dark:text-white mb-2">
                ช่วงเวลาการแจ้งเตือนล่วงหน้า (Reminder Horizons):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { days: 30, label: '30 วันก่อนถึงกำหนด' },
                  { days: 14, label: '14 วันก่อนถึงกำหนด' },
                  { days: 7, label: '7 วันก่อนถึงกำหนด' },
                  { days: 3, label: '3 วันก่อนถึงกำหนด' },
                  { days: 1, label: '1 วันก่อนถึงกำหนด' },
                  { days: 0, label: 'วันที่ถึงกำหนด' },
                ].map((item) => (
                  <label
                    key={item.days}
                    className={`flex items-center gap-2 rounded-xl p-2.5 border cursor-pointer text-xs transition-colors ${
                      reminderDays.includes(item.days)
                        ? 'border-blue-500 bg-blue-50 text-blue-900 font-semibold dark:bg-blue-950 dark:text-blue-200'
                        : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={reminderDays.includes(item.days)}
                      onChange={() => toggleReminderDay(item.days)}
                      className="rounded border-blue-400 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Theme Selection */}
            <div className="pt-2">
              <label className="block font-semibold text-slate-900 dark:text-white mb-2">
                ธีมการแสดงผลของระบบ (Display Theme):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setSelectedTheme('light')}
                  className={`flex items-center gap-3 rounded-xl p-3 border text-xs font-semibold transition-all text-left ${
                    selectedTheme === 'light'
                      ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-xs dark:bg-brand-950/60 dark:text-brand-200'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning-100 text-warning-700 dark:bg-warning-950 dark:text-warning-300">
                    <Sun className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold">Light Theme (โหมดสว่าง)</div>
                    <div className="text-[10px] text-slate-500 font-normal">สว่าง สะอาดตา สบายตา (แนะนำ)</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTheme('dark')}
                  className={`flex items-center gap-3 rounded-xl p-3 border text-xs font-semibold transition-all text-left ${
                    selectedTheme === 'dark'
                      ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-xs dark:bg-brand-950/60 dark:text-brand-200'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                    <Moon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold">Dark Theme (โหมดมืด)</div>
                    <div className="text-[10px] text-slate-500 font-normal">ถนอมสายตาในที่แสงน้อย</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="rounded-xl bg-brand-500 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-600 active:bg-brand-700 shadow-sm transition-colors"
              >
                บันทึกการตั้งค่า
              </button>
            </div>
          </form>
        </div>

        {/* 2. Custom Categories Management */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
            <Tag className="h-5 w-5 text-indigo-600" />
            <h2 className="font-bold text-slate-900 dark:text-white text-sm">
              จัดการหมวดหมู่ทรัพย์สิน (Custom Asset Categories)
            </h2>
          </div>

          <div className="space-y-3">
            <form onSubmit={handleAddCategory} className="flex gap-2">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="ชื่อหมวดหมู่ที่ต้องการเพิ่ม เช่น เฟอร์นิเจอร์, กล้องวงจรปิด"
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                <span>เพิ่มหมวดหมู่</span>
              </button>
            </form>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-800/60 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <CategoryIcon name={c.icon} className="h-4 w-4 text-slate-500" />
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                      {c.name}
                    </span>
                  </div>
                  {c.isCustom && (
                    <button
                      type="button"
                      onClick={() => deleteCategory(c.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="ลบหมวดหมู่นี้"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Backup, Restore & Reset to Demo Data */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
            <Shield className="h-5 w-5 text-amber-500" />
            <h2 className="font-bold text-slate-900 dark:text-white text-sm">
              สำรองข้อมูลและกู้คืน (Data Backup & Reset)
            </h2>
          </div>

          <p className="text-xs text-slate-500">
            ระบบเก็บข้อมูลไว้ในเครื่องอย่างปลอดภัย คุณสามารถสำรองข้อมูลทั้งหมดเป็นไฟล์ JSON หรือนำข้อมูลกลับมาได้ทุกเมื่อ
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
            >
              <Download className="h-4 w-4 text-blue-600" />
              <span>ดาวน์โหลดไฟล์สำรอง (Export JSON)</span>
            </button>

            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 cursor-pointer">
              <Upload className="h-4 w-4 text-purple-600" />
              <span>นำเข้าข้อมูล (Import JSON)</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                confirmModal({
                  title: 'รีเซ็ตข้อมูลตัวอย่าง',
                  message: 'คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่า Demo ตัวอย่างใช่หรือไม่? ข้อมูลปัจจุบันทั้งหมดจะถูกแทนที่ด้วยชุดข้อมูลเริ่มต้น',
                  confirmLabel: 'รีเซ็ตข้อมูล',
                  cancelLabel: 'ยกเลิก',
                  variant: 'primary',
                  onConfirm: () => {
                    resetToDemo();
                    showToast('รีเซ็ตข้อมูลสำเร็จ', 'ระบบโหลดข้อมูลตัวอย่างเริ่มต้นเรียบร้อยแล้ว', 'info');
                  },
                });
              }}
              className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300 transition-colors"
            >
              <RefreshCw className="h-4 w-4 text-amber-600" />
              <span>รีเซ็ตข้อมูลตัวอย่าง (Reset Demo Data)</span>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
