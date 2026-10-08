'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  Box,
  Wrench,
  Calendar,
  ShieldCheck,
  FolderOpen,
  Receipt,
  Bell,
  Settings,
  Home,
  CheckCircle2,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { stats, settings } = useApp();

  const navItems = [
    {
      label: 'แดชบอร์ด',
      labelEn: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      active: pathname === '/',
    },
    {
      label: 'ทรัพย์สิน',
      labelEn: 'Assets',
      href: '/assets',
      icon: Box,
      badge: stats.totalAssets > 0 ? stats.totalAssets : undefined,
      active: pathname.startsWith('/assets'),
    },
    {
      label: 'การบำรุงรักษา',
      labelEn: 'Maintenance',
      href: '/maintenance',
      icon: Wrench,
      alertCount: stats.overdueCount > 0 ? stats.overdueCount : undefined,
      warningCount: stats.dueSoonCount > 0 ? stats.dueSoonCount : undefined,
      active: pathname.startsWith('/maintenance'),
    },
    {
      label: 'ปฏิทิน',
      labelEn: 'Calendar',
      href: '/calendar',
      icon: Calendar,
      active: pathname.startsWith('/calendar'),
    },
    {
      label: 'รับประกัน & ประกันภัย',
      labelEn: 'Warranty & Insurance',
      href: '/warranty',
      icon: ShieldCheck,
      warningCount:
        stats.expiringWarrantyCount + stats.expiringInsuranceCount > 0
          ? stats.expiringWarrantyCount + stats.expiringInsuranceCount
          : undefined,
      active: pathname.startsWith('/warranty'),
    },
    {
      label: 'คลังเอกสาร',
      labelEn: 'Documents',
      href: '/documents',
      icon: FolderOpen,
      active: pathname.startsWith('/documents'),
    },
    {
      label: 'ค่าใช้จ่าย',
      labelEn: 'Expenses',
      href: '/expenses',
      icon: Receipt,
      active: pathname.startsWith('/expenses'),
    },
    {
      label: 'การแจ้งเตือน',
      labelEn: 'Notifications',
      href: '/notifications',
      icon: Bell,
      badge:
        stats.unreadNotificationsCount > 0
          ? stats.unreadNotificationsCount
          : undefined,
      active: pathname.startsWith('/notifications'),
    },
    {
      label: 'ตั้งค่า',
      labelEn: 'Settings',
      href: '/settings',
      icon: Settings,
      active: pathname.startsWith('/settings'),
    },
  ];

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6 dark:border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/20">
          <Home className="h-5 w-5" />
        </div>
        <div className="overflow-hidden">
          <div className="font-bold text-slate-900 dark:text-white text-base tracking-tight truncate">
            HomeTrack
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            Asset & Maintenance
          </div>
        </div>
      </div>

      {/* Household Badge */}
      <div className="mx-4 mt-3 mb-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          พื้นที่จัดการ
        </div>
        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
          {settings.householdName}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                item.active
                  ? 'bg-brand-50 text-brand-700 shadow-xs font-semibold dark:bg-brand-950/60 dark:text-brand-300'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon
                  className={`h-4.5 w-4.5 transition-colors ${
                    item.active
                      ? 'text-brand-500 dark:text-brand-400'
                      : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-1.5 ml-2">
                {item.alertCount !== undefined && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-danger-500 px-1.5 text-[10px] font-bold text-white shadow-xs">
                    {item.alertCount}
                  </span>
                )}
                {item.warningCount !== undefined && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-warning-500 px-1.5 text-[10px] font-bold text-white shadow-xs">
                    {item.warningCount}
                  </span>
                )}
                {item.badge !== undefined && !item.alertCount && !item.warningCount && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="border-t border-slate-200 p-4 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">สถานะระบบ</span>
          <span className="flex items-center gap-1 text-success-600 dark:text-success-400 font-medium">
            <CheckCircle2 className="h-3 w-3" /> ออนไลน์
          </span>
        </div>
        <div className="text-[10px] text-slate-400">
          Design System: Core v1.0
        </div>
      </div>
    </aside>
  );
}
