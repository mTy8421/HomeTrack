'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import { MaintenanceRecord } from '@/types';
import {
  Wrench,
  Plus,
  Search,
  CheckCircle2,
  RefreshCw,
  Gauge,
  Edit,
  Trash2,
  Sparkles,
} from 'lucide-react';
import {
  CURRENT_DATE_STR,
  formatDateThai,
  formatCurrency,
  getDaysDifference,
} from '@/lib/constants';
import { getMaintenanceStatus } from '@/lib/storage';
import { MaintenanceFormModal } from '@/components/maintenance/MaintenanceFormModal';
import { CompleteMaintenanceModal } from '@/components/maintenance/CompleteMaintenanceModal';
import { EmptyState } from '@/components/ui/EmptyState';

type MaintenanceTab = 'all' | 'upcoming' | 'overdue' | 'completed' | 'recurring';

function MaintenanceContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const validTabs: MaintenanceTab[] = ['all', 'upcoming', 'overdue', 'completed', 'recurring'];
  const initialTab: MaintenanceTab = validTabs.includes(tabParam as MaintenanceTab)
    ? (tabParam as MaintenanceTab)
    : 'all';

  const { assets, maintenance, deleteMaintenance, showToast, confirmModal } = useApp();

  const [activeTab, setActiveTab] = useState<MaintenanceTab>(initialTab);
  const [selectedAssetId, setSelectedAssetId] = useState('all');
  const [search, setSearch] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<MaintenanceRecord | null>(null);
  const [completeRecord, setCompleteRecord] = useState<MaintenanceRecord | null>(null);

  // Filter logic
  const filteredList = maintenance.filter((m) => {
    if (selectedAssetId !== 'all' && m.assetId !== selectedAssetId) return false;

    const statusType = getMaintenanceStatus(m, CURRENT_DATE_STR);
    const isCompleted = m.status === 'completed';

    if (activeTab === 'upcoming' && (isCompleted || statusType === 'overdue')) return false;
    if (activeTab === 'overdue' && (isCompleted || statusType !== 'overdue')) return false;
    if (activeTab === 'completed' && !isCompleted) return false;
    if (activeTab === 'recurring' && !m.isRecurring) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchProvider = m.provider?.toLowerCase().includes(q);
      const matchDesc = m.description?.toLowerCase().includes(q);
      const matchParts = m.partsReplaced?.some((p) => p.toLowerCase().includes(q));
      if (!matchTitle && !matchProvider && !matchDesc && !matchParts) return false;
    }

    return true;
  });

  const handleDelete = (id: string, title: string) => {
    confirmModal({
      title: 'ยืนยันการลบรายการบำรุงรักษา',
      message: `คุณต้องการลบรายการบำรุงรักษา "${title}" ใช่หรือไม่?`,
      confirmLabel: 'ลบรายการ',
      cancelLabel: 'ยกเลิก',
      variant: 'danger',
      onConfirm: () => {
        deleteMaintenance(id);
        showToast('ลบรายการสำเร็จ', `ลบรายการบำรุงรักษา "${title}" เรียบร้อยแล้ว`, 'success');
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
              <Wrench className="h-6 w-6 text-amber-500" />
              <span>ระบบการบำรุงรักษาและงานประจำรอบ (Maintenance)</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              กำหนดรอบการล้างแอร์ เช็กระยะรถยนต์ เปลี่ยนไส้กรอง และคำนวณรอบถัดไปอัตโนมัติ
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setRecordToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-600 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>+ สร้างรายการบำรุงรักษา</span>
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'ทั้งหมด (All)', count: maintenance.length },
            {
              id: 'upcoming',
              label: 'ใกล้ถึงกำหนด (Upcoming)',
              count: maintenance.filter(
                (m) => m.status !== 'completed' && getMaintenanceStatus(m, CURRENT_DATE_STR) !== 'overdue'
              ).length,
            },
            {
              id: 'overdue',
              label: 'เลยกำหนด (Overdue)',
              count: maintenance.filter(
                (m) => m.status !== 'completed' && getMaintenanceStatus(m, CURRENT_DATE_STR) === 'overdue'
              ).length,
              color: 'text-rose-600',
            },
            {
              id: 'completed',
              label: 'เสร็จสิ้นแล้ว (Completed)',
              count: maintenance.filter((m) => m.status === 'completed').length,
            },
            {
              id: 'recurring',
              label: 'งานประจำรอบ (Recurring)',
              count: maintenance.filter((m) => m.isRecurring).length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as MaintenanceTab)}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold shrink-0 transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  activeTab === tab.id
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหางาน, ช่าง, อะไหล่..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-1.5 pl-9 pr-3 text-xs outline-hidden focus:border-amber-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400">กรองตามทรัพย์สิน:</span>
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
          </div>
        </div>

        {/* List of Tasks */}
        <div className="space-y-3">
          {filteredList.length === 0 ? (
            <EmptyState
              icon={Wrench}
              title="ไม่พบรายการบำรุงรักษา"
              description={search ? 'ลองเปลี่ยนคำค้นหา หรือเลือกแท็บสถานะอื่น' : 'เริ่มต้นวางแผนและบันทึกรอบการดูแลรักษาเครื่องใช้และยานพาหนะ'}
              actionLabel="เพิ่มงานบำรุงรักษาใหม่"
              onAction={() => {
                setRecordToEdit(null);
                setIsAddModalOpen(true);
              }}
            />
          ) : (
            filteredList.map((item) => {
              const asset = assets.find((a) => a.id === item.assetId);
              const isCompleted = item.status === 'completed';
              const daysLeft = getDaysDifference(item.scheduledDate, CURRENT_DATE_STR);
              const statusType = getMaintenanceStatus(item, CURRENT_DATE_STR);

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-4.5 transition-all bg-white dark:bg-slate-900 shadow-xs ${
                    !isCompleted && statusType === 'overdue'
                      ? 'border-rose-300 dark:border-rose-900/80'
                      : !isCompleted && statusType === 'due_soon'
                      ? 'border-amber-300 dark:border-amber-900/80'
                      : 'border-slate-200/90 dark:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {item.title}
                        </span>

                        {/* Status Badges */}
                        {isCompleted ? (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            ✓ ทำเสร็จสิ้นแล้ว
                          </span>
                        ) : statusType === 'overdue' ? (
                          <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                            ⚠️ เลยกำหนด {Math.abs(daysLeft)} วัน
                          </span>
                        ) : daysLeft === 0 ? (
                          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            ⏰ ถึงกำหนดวันนี้
                          </span>
                        ) : (
                          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            อีก {daysLeft} วัน
                          </span>
                        )}

                        {/* Recurring badge */}
                        {item.isRecurring && (
                          <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            <RefreshCw className="h-3 w-3" />
                            ทุก {item.intervalValue} {item.intervalUnit}
                            {item.mileageInterval && ` / ${item.mileageInterval.toLocaleString()} km`}
                          </span>
                        )}
                      </div>

                      {/* Linked Asset */}
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
                        {asset && (
                          <Link
                            href={`/assets/${asset.id}`}
                            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                          >
                            {asset.name} ({asset.location})
                          </Link>
                        )}
                        <span>•</span>
                        <span>
                          {isCompleted
                            ? `ทำจริงเมื่อ: ${formatDateThai(item.completedDate || item.scheduledDate)}`
                            : `กำหนดทำ: ${formatDateThai(item.scheduledDate)}`}
                        </span>
                        {item.cost > 0 && <span>• ค่าใช้จ่าย: {formatCurrency(item.cost)}</span>}
                        {item.provider && <span>• ช่าง: {item.provider}</span>}
                        {item.dueMileage && (
                          <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                            <Gauge className="h-3 w-3 inline" />
                            เป้าหมาย: {item.dueMileage.toLocaleString()} km
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 pt-1">
                          {item.description}
                        </p>
                      )}

                      {/* Parts and next due date if complete */}
                      {item.nextDueDate && (
                        <div className="flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-400 pt-1 font-medium">
                          <Sparkles className="h-3 w-3" />
                          <span>รอบถัดไปอัตโนมัติ: {formatDateThai(item.nextDueDate)}</span>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                      {!isCompleted && (
                        <button
                          type="button"
                          onClick={() => setCompleteRecord(item)}
                          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span>ทำเสร็จแล้ว</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setRecordToEdit(item);
                          setIsAddModalOpen(true);
                        }}
                        className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300"
                        title="แก้ไข"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.title)}
                        className="rounded-xl border border-slate-200 p-2 text-rose-600 hover:bg-rose-50 dark:border-slate-800"
                        title="ลบ"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <MaintenanceFormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setRecordToEdit(null);
        }}
        recordToEdit={recordToEdit}
      />
      <CompleteMaintenanceModal
        isOpen={Boolean(completeRecord)}
        onClose={() => setCompleteRecord(null)}
        record={completeRecord}
      />
    </AppLayout>
  );
}

export default function MaintenancePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">กำลังโหลดข้อมูล...</div>}>
      <MaintenanceContent />
    </Suspense>
  );
}

