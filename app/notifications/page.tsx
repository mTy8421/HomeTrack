'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import { NotificationStatus } from '@/types';
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  Info,
  CheckCheck,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import {
  formatDateThai,
} from '@/lib/constants';

type NotificationTab = 'all' | 'upcoming' | 'due_today' | 'overdue' | 'completed';

export default function NotificationsPage() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    assets,
  } = useApp();

  const [activeTab, setActiveTab] = useState<NotificationTab>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming' && n.status === 'upcoming') return true;
    if (activeTab === 'due_today' && n.status === 'due_today') return true;
    if (activeTab === 'overdue' && n.status === 'overdue') return true;
    if (activeTab === 'completed' && (n.status === 'completed' || n.isRead)) return true;
    return false;
  });

  const getStatusBadge = (status: NotificationStatus) => {
    switch (status) {
      case 'overdue':
        return (
          <span className="rounded-full bg-danger-50 px-2.5 py-0.5 text-[10px] font-bold text-danger-700 border border-danger-200 dark:bg-danger-950 dark:text-danger-300 dark:border-danger-900 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>เลยกำหนด</span>
          </span>
        );
      case 'due_today':
        return (
          <span className="rounded-full bg-warning-50 px-2.5 py-0.5 text-[10px] font-bold text-warning-700 border border-warning-200 dark:bg-warning-950 dark:text-warning-300 dark:border-warning-900 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>ถึงกำหนดวันนี้</span>
          </span>
        );
      case 'upcoming':
        return (
          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[10px] font-semibold text-brand-700 border border-brand-200 dark:bg-brand-950 dark:text-brand-300 dark:border-brand-900 flex items-center gap-1">
            <Info className="h-3 w-3" />
            <span>เร็วๆ นี้</span>
          </span>
        );
      case 'completed':
      default:
        return (
          <span className="rounded-full bg-success-50 px-2.5 py-0.5 text-[10px] font-semibold text-success-700 border border-success-200 dark:bg-success-950 dark:text-success-300 dark:border-success-900 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>เสร็จสิ้น</span>
          </span>
        );
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl flex items-center gap-2">
              <Bell className="h-6 w-6 text-brand-500" />
              <span>ศูนย์การแจ้งเตือน (Notification Center)</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              แจ้งเตือนรอบบำรุงรักษา วันหมดอายุประกัน กรมธรรม์ และภาษีรถยนต์
            </p>
          </div>

          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <CheckCheck className="h-4 w-4 text-brand-500" />
            <span>ทำเครื่องหมายว่าอ่านทั้งหมด</span>
          </button>
        </div>

        {/* Requirement 6: Tabs: Upcoming, Due Today, Overdue, Completed */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'ทั้งหมด', count: notifications.length },
            {
              id: 'upcoming',
              label: 'Upcoming (เร็วๆ นี้)',
              count: notifications.filter((n) => n.status === 'upcoming').length,
            },
            {
              id: 'due_today',
              label: 'Due Today (ถึงกำหนดวันนี้)',
              count: notifications.filter((n) => n.status === 'due_today').length,
            },
            {
              id: 'overdue',
              label: 'Overdue (เลยกำหนด)',
              count: notifications.filter((n) => n.status === 'overdue').length,
              isAlert: true,
            },
            {
              id: 'completed',
              label: 'Completed (อ่านแล้ว / เสร็จสิ้น)',
              count: notifications.filter((n) => n.status === 'completed' || n.isRead).length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as NotificationTab)}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold shrink-0 transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  activeTab === tab.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
              <Bell className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                ไม่มีการแจ้งเตือนในหมวดนี้
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                การแจ้งเตือนจะแสดงเมื่อถึงรอบการตั้งเตือนล่วงหน้า 30, 14, 7, 3, หรือ 1 วัน
              </p>
            </div>
          ) : (
            filteredNotifications.map((n) => {
              const asset = assets.find((a) => a.id === n.assetId);

              return (
                <div
                  key={n.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-4.5 transition-all bg-white dark:bg-slate-900 shadow-xs ${
                    !n.isRead
                      ? 'border-rose-200/90 dark:border-rose-900/60 bg-rose-50/20'
                      : 'border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                        {n.title}
                      </span>
                      {getStatusBadge(n.status)}
                      {!n.isRead && (
                        <span className="h-2 w-2 rounded-full bg-rose-500 inline-block animate-pulse" />
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {n.message}
                    </p>

                    <div className="text-[11px] text-slate-400 flex items-center gap-2 flex-wrap pt-0.5">
                      {asset && <span>ทรัพย์สิน: {asset.name}</span>}
                      <span>•</span>
                      <span>กำหนด: {formatDateThai(n.dueDate)}</span>
                      <span>•</span>
                      <span>บันทึกเมื่อ: {formatDateThai(n.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {n.actionUrl && (
                      <Link
                        href={n.actionUrl}
                        onClick={() => markNotificationRead(n.id)}
                        className="flex items-center gap-1 rounded-xl bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-100 dark:bg-brand-950 dark:text-brand-300"
                      >
                        <span>ไปที่รายการ</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}

                    {!n.isRead && (
                      <button
                        type="button"
                        onClick={() => markNotificationRead(n.id)}
                        className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-800"
                      >
                        อ่านแล้ว
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => deleteNotification(n.id)}
                      className="rounded-xl p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                      title="ลบการแจ้งเตือน"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
}
