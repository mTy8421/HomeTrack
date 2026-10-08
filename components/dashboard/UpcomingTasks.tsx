'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { MaintenanceRecord } from '@/types';
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Gauge,
} from 'lucide-react';
import {
  CURRENT_DATE_STR,
  formatDateThai,
  getDaysDifference,
  formatCurrency,
} from '@/lib/constants';
import { CompleteMaintenanceModal } from '@/components/maintenance/CompleteMaintenanceModal';

export function UpcomingTasks() {
  const { assets, maintenance, warranties } = useApp();
  const [completeRecord, setCompleteRecord] = useState<MaintenanceRecord | null>(null);

  // Collect scheduled maintenance records
  const scheduledMaintenance = maintenance
    .filter((m) => m.status !== 'completed' && m.status !== 'cancelled')
    .map((m) => {
      const asset = assets.find((a) => a.id === m.assetId);
      const daysLeft = getDaysDifference(m.scheduledDate, CURRENT_DATE_STR);

      let colorStatus: 'green' | 'yellow' | 'red' = 'green';
      let statusLabel = `อีก ${daysLeft} วัน`;

      if (daysLeft < 0) {
        colorStatus = 'red';
        statusLabel = `เลยกำหนด ${Math.abs(daysLeft)} วัน`;
      } else if (daysLeft === 0) {
        colorStatus = 'yellow';
        statusLabel = 'ถึงกำหนดวันนี้';
      } else if (daysLeft <= 14) {
        colorStatus = 'yellow';
        statusLabel = `อีก ${daysLeft} วัน`;
      } else {
        colorStatus = 'green';
        statusLabel = `อีก ${daysLeft} วัน`;
      }

      return {
        id: m.id,
        kind: 'maintenance' as const,
        title: m.title,
        dueDate: m.scheduledDate,
        daysLeft,
        colorStatus,
        statusLabel,
        asset,
        record: m,
        cost: m.cost,
        dueMileage: m.dueMileage,
      };
    });

  // Collect warranties & insurance expiring soon
  const expiringWarranties = warranties
    .map((w) => {
      const asset = assets.find((a) => a.id === w.assetId);
      const daysLeft = getDaysDifference(w.endDate, CURRENT_DATE_STR);

      let colorStatus: 'green' | 'yellow' | 'red' = 'green';
      let statusLabel = `อีก ${daysLeft} วัน`;

      if (daysLeft < 0) {
        colorStatus = 'red';
        statusLabel = `หมดอายุแล้ว (${Math.abs(daysLeft)} วัน)`;
      } else if (daysLeft <= 30) {
        colorStatus = 'yellow';
        statusLabel = `หมดอายุใน ${daysLeft} วัน`;
      } else {
        colorStatus = 'green';
        statusLabel = `อีก ${daysLeft} วัน`;
      }

      return {
        id: w.id,
        kind: 'warranty' as const,
        title: `${w.type === 'insurance' ? '🛡️ ต่อประกันภัย: ' : '🛡️ สิ้นสุดประกัน: '}${w.title}`,
        dueDate: w.endDate,
        daysLeft,
        colorStatus,
        statusLabel,
        asset,
        warrantyRecord: w,
        provider: w.provider,
      };
    })
    .filter((w) => w.daysLeft <= 60); // Show next 60 days

  // Merge and sort by urgency (daysLeft ascending)
  const allUpcoming = [...scheduledMaintenance, ...expiringWarranties].sort(
    (a, b) => a.daysLeft - b.daysLeft
  );

  const getStatusColorClass = (color: 'green' | 'yellow' | 'red') => {
    switch (color) {
      case 'red':
        return 'bg-danger-50 text-danger-700 border-danger-200 dark:bg-danger-950/50 dark:text-danger-300 dark:border-danger-800';
      case 'yellow':
        return 'bg-warning-50 text-warning-700 border-warning-200 dark:bg-warning-950/50 dark:text-warning-300 dark:border-warning-800';
      case 'green':
      default:
        return 'bg-success-50 text-success-700 border-success-200 dark:bg-success-950/50 dark:text-success-300 dark:border-success-800';
    }
  };

  const getEmojiForTask = (title: string, kind: string) => {
    if (title.includes('แอร์')) return '❄️';
    if (title.includes('น้ำมันเครื่อง') || title.includes('รถ') || title.includes('ยาง')) return '🚗';
    if (title.includes('ปั๊มน้ำ') || title.includes('บ้าน')) return '🏠';
    if (title.includes('ประกัน') || title.includes('พรบ') || title.includes('ภาษี')) return '🛡️';
    if (title.includes('ซักผ้า')) return '🧺';
    if (title.includes('ตู้เย็น') || title.includes('กรอง')) return '🧊';
    return kind === 'warranty' ? '🛡️' : '🔧';
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              งานและกำหนดการที่กำลังจะถึง (Upcoming Tasks)
            </h3>
            <p className="text-[11px] text-slate-400">
              สถานะสี: <span className="text-emerald-600 font-medium">Green = ปกติ</span>,{' '}
              <span className="text-amber-600 font-medium">Yellow = ใกล้ถึงกำหนด</span>,{' '}
              <span className="text-rose-600 font-medium">Red = เลยกำหนด</span>
            </p>
          </div>
        </div>

        <Link
          href="/maintenance"
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          <span>ดูทั้งหมด</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800/80">
        {allUpcoming.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            ไม่มีงานที่ใกล้ถึงกำหนดในขณะนี้
          </div>
        ) : (
          allUpcoming.slice(0, 6).map((item) => {
            const emoji = getEmojiForTask(item.title, item.kind);
            return (
              <div
                key={`${item.kind}-${item.id}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 rounded-xl px-2 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="text-xl shrink-0 pt-0.5">{emoji}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={item.asset ? `/assets/${item.asset.id}` : '#'}
                        className="font-bold text-slate-900 dark:text-white text-xs hover:text-blue-600 truncate"
                      >
                        {item.title}
                      </Link>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColorClass(
                          item.colorStatus
                        )}`}
                      >
                        {item.statusLabel}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                      {item.asset && (
                        <span>
                          {item.asset.name} ({item.asset.location})
                        </span>
                      )}
                      <span>•</span>
                      <span>กำหนด: {formatDateThai(item.dueDate)}</span>
                      {item.kind === 'maintenance' && item.dueMileage && item.asset?.currentMileage && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                            <Gauge className="h-3 w-3 inline" />
                            {item.asset.currentMileage.toLocaleString()} / {item.dueMileage.toLocaleString()} km
                          </span>
                        </>
                      )}
                      {item.kind === 'maintenance' && item.cost ? (
                        <>
                          <span>•</span>
                          <span>~{formatCurrency(item.cost)}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {item.kind === 'maintenance' && item.record ? (
                    <button
                      type="button"
                      onClick={() => setCompleteRecord(item.record!)}
                      className="flex items-center gap-1.5 rounded-xl border border-success-200 bg-success-50 px-3 py-1.5 text-xs font-semibold text-success-700 hover:bg-success-100 dark:border-success-800 dark:bg-success-950/60 dark:text-success-300 transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>บันทึกทำเสร็จ</span>
                    </button>
                  ) : (
                    <Link
                      href="/warranty"
                      className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <span>ดูรายละเอียด</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <CompleteMaintenanceModal
        isOpen={Boolean(completeRecord)}
        onClose={() => setCompleteRecord(null)}
        record={completeRecord}
      />
    </div>
  );
}
