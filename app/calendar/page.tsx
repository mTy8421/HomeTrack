'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  ArrowRight,
} from 'lucide-react';
import {
  CURRENT_DATE_STR,
  formatDateThai,
  formatCurrency,
} from '@/lib/constants';
import { MaintenanceRecord, WarrantyRecord } from '@/types';
import { CompleteMaintenanceModal } from '@/components/maintenance/CompleteMaintenanceModal';

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  type: 'maintenance' | 'warranty' | 'insurance' | 'tax';
  assetName: string;
  assetId?: string;
  cost?: number;
  rawMaint?: MaintenanceRecord;
  rawWarranty?: WarrantyRecord;
};

export function CalendarPage() {
  const { assets, maintenance, warranties } = useApp();

  // Current calendar view month (Default from CURRENT_DATE_STR)
  const [initYear, initMonth] = CURRENT_DATE_STR.split('-').map(Number);
  const [currentYear, setCurrentYear] = useState(initYear || 2026);
  const [currentMonth, setCurrentMonth] = useState(initMonth ? initMonth - 1 : 9); // 0-indexed: 9 = October
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');

  // Selected event modal
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [completeRecord, setCompleteRecord] = useState<MaintenanceRecord | null>(null);

  // Compile all events
  const events: CalendarEvent[] = [];

  // 1. Maintenance events
  maintenance.forEach((m) => {
    const asset = assets.find((a) => a.id === m.assetId);
    events.push({
      id: `maint-${m.id}`,
      title: m.title,
      date: m.scheduledDate,
      type: 'maintenance',
      assetName: asset?.name || 'ทรัพย์สินทั่วไป',
      assetId: m.assetId,
      cost: m.cost,
      rawMaint: m,
    });
  });

  // 2. Warranty & Insurance expiry events
  warranties.forEach((w) => {
    const asset = assets.find((a) => a.id === w.assetId);
    events.push({
      id: `war-${w.id}`,
      title: `หมดอายุ: ${w.title}`,
      date: w.endDate,
      type: w.type === 'insurance' ? 'insurance' : w.type === 'tax' ? 'tax' : 'warranty',
      assetName: asset?.name || 'ทรัพย์สินทั่วไป',
      assetId: w.assetId,
      rawWarranty: w,
    });
  });

  // Month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const jumpToToday = () => {
    setCurrentYear(initYear || 2026);
    setCurrentMonth(initMonth ? initMonth - 1 : 9);
  };

  const monthNamesThai = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  // Calendar Grid generation
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  const getEventBadgeClass = (type: string) => {
    switch (type) {
      case 'maintenance':
        return 'bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 dark:bg-brand-950 dark:text-brand-300 dark:border-brand-900';
      case 'insurance':
        return 'bg-warning-50 text-warning-700 hover:bg-warning-100 border border-warning-200 dark:bg-warning-950 dark:text-warning-300 dark:border-warning-900';
      case 'tax':
        return 'bg-success-50 text-success-700 hover:bg-success-100 border border-success-200 dark:bg-success-950 dark:text-success-300 dark:border-success-900';
      case 'warranty':
      default:
        return 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-900';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl flex items-center gap-2">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
              <span>ปฏิทินงานและการแจ้งเตือน (Calendar)</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              ตารางกำหนดการบำรุงรักษา วันหมดอายุประกัน และภาษีประจำปี
            </p>
          </div>

          {/* Month Navigator & Views */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('month')}
                className={`rounded-lg px-3 py-1.5 transition-all ${
                  viewMode === 'month'
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Month View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`rounded-lg px-3 py-1.5 transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                List View
              </button>
            </div>

            <button
              type="button"
              onClick={jumpToToday}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
            >
              วันนี้ (Today)
            </button>
          </div>
        </div>

        {/* Month Navigation Bar */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevMonth}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {monthNamesThai[currentMonth]} {currentYear + 543} ({currentYear})
            </h2>
            <button
              type="button"
              onClick={nextMonth}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Color legend */}
          <div className="hidden sm:flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500 inline-block" />
              <span>บำรุงรักษา</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500 inline-block" />
              <span>หมดประกัน (Warranty)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block" />
              <span>ประกันภัย (Insurance)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>ภาษีรถ (Tax)</span>
            </span>
          </div>
        </div>

        {/* Month Calendar Grid */}
        {viewMode === 'month' ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            {/* Days of week header */}
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/70 text-center text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
              <div className="py-2.5 text-rose-500">อา.</div>
              <div className="py-2.5">จ.</div>
              <div className="py-2.5">อ.</div>
              <div className="py-2.5">พ.</div>
              <div className="py-2.5">พฤ.</div>
              <div className="py-2.5">ศ.</div>
              <div className="py-2.5 text-blue-500">ส.</div>
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800">
              {daysArray.map((dayNum, idx) => {
                if (dayNum === null) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="min-h-[105px] bg-slate-50/40 p-2 dark:bg-slate-900/40"
                    />
                  );
                }

                const currentDayStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const isToday = currentDayStr === CURRENT_DATE_STR;
                const dayEvents = events.filter((e) => e.date === currentDayStr);

                return (
                  <div
                    key={`day-${dayNum}`}
                    className={`min-h-[105px] p-2 transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40 ${
                      isToday ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          isToday
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {dayNum}
                      </span>
                      {isToday && (
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                          วันนี้
                        </span>
                      )}
                    </div>

                    {/* Events list in cell */}
                    <div className="mt-1 space-y-1">
                      {dayEvents.map((evt) => (
                        <button
                          key={evt.id}
                          type="button"
                          onClick={() => setSelectedEvent(evt)}
                          className={`w-full text-left truncate rounded-md px-1.5 py-0.5 text-[10px] font-semibold transition-all block ${getEventBadgeClass(
                            evt.type
                          )}`}
                          title={`${evt.title} (${evt.assetName})`}
                        >
                          {evt.title}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {events
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className="cursor-pointer flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center justify-center rounded-xl bg-slate-100 p-2 dark:bg-slate-800 min-w-[56px]">
                      <span className="text-[10px] text-slate-400">
                        {new Date(evt.date).toLocaleDateString('th-TH', { month: 'short' })}
                      </span>
                      <span className="text-base font-black text-slate-800 dark:text-white">
                        {new Date(evt.date).getDate()}
                      </span>
                    </div>

                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs">
                        {evt.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        ทรัพย์สิน: {evt.assetName} • {formatDateThai(evt.date)}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${getEventBadgeClass(
                      evt.type
                    )}`}
                  >
                    {evt.type}
                  </span>
                </div>
              ))}
          </div>
        )}

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="fixed inset-0" onClick={() => setSelectedEvent(null)} />
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 z-10">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${getEventBadgeClass(
                    selectedEvent.type
                  )}`}
                >
                  {selectedEvent.type}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {selectedEvent.title}
                </h3>
                <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                  <div>
                    <span className="text-slate-400">ทรัพย์สิน:</span>{' '}
                    <strong className="text-slate-800 dark:text-slate-200">
                      {selectedEvent.assetName}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400">กำหนดวันที่:</span>{' '}
                    <strong>{formatDateThai(selectedEvent.date)}</strong>
                  </div>
                  {selectedEvent.cost ? (
                    <div>
                      <span className="text-slate-400">ประมาณการค่าใช้จ่าย:</span>{' '}
                      <strong>{formatCurrency(selectedEvent.cost)}</strong>
                    </div>
                  ) : null}
                  {selectedEvent.rawMaint?.provider && (
                    <div>
                      <span className="text-slate-400">ช่าง / ร้านค้า:</span>{' '}
                      <strong>{selectedEvent.rawMaint.provider}</strong>
                    </div>
                  )}
                  {selectedEvent.rawMaint?.description && (
                    <div className="pt-2 text-slate-500 bg-slate-50 p-2.5 rounded-xl dark:bg-slate-800">
                      {selectedEvent.rawMaint.description}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                {selectedEvent.assetId && (
                  <Link
                    href={`/assets/${selectedEvent.assetId}`}
                    onClick={() => setSelectedEvent(null)}
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>ดูทรัพย์สินนี้</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}

                {selectedEvent.rawMaint && selectedEvent.rawMaint.status !== 'completed' && (
                  <button
                    type="button"
                    onClick={() => {
                      setCompleteRecord(selectedEvent.rawMaint!);
                      setSelectedEvent(null);
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>บันทึกทำเสร็จแล้ว</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <CompleteMaintenanceModal
          isOpen={Boolean(completeRecord)}
          onClose={() => setCompleteRecord(null)}
          record={completeRecord}
        />
      </div>
    </AppLayout>
  );
}

export default CalendarPage;
