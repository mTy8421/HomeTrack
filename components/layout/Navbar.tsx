'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Search,
  Bell,
  Plus,
  Home,
  Wrench,
  Receipt,
  FileUp,
  UserCheck,
  ChevronDown,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';

export function Navbar() {
  const {
    user,
    stats,
    setIsSearchOpen,
    setIsQuickActionOpen,
    settings,
    resetToDemo,
    theme,
    toggleTheme,
    showToast,
    confirmModal,
  } = useApp();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
      {/* Left: Mobile Brand & Search Trigger */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 md:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm shadow-brand-500/20">
            <Home className="h-5 w-5" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-sm leading-tight">
            HomeTrack
          </span>
        </Link>

        {/* Global Search Button */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="flex h-10 w-44 items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-3 text-xs text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-800 sm:w-64 md:w-80"
        >
          <span className="flex items-center gap-2 truncate">
            <Search className="h-4 w-4 text-slate-400" />
            <span>ค้นหาทรัพย์สิน, ช่าง, เอกสาร...</span>
          </span>
          <kbd className="hidden rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 shadow-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 sm:inline-block">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Action, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action Button & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)}
            className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-3 py-2 text-xs font-semibold text-white shadow-sm shadow-brand-500/20 transition-all hover:bg-brand-600 active:bg-brand-700 sm:px-3.5 sm:text-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">เพิ่มข้อมูลด่วน</span>
            <span className="sm:hidden">เพิ่ม</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-80" />
          </button>

          {isQuickMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsQuickMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 z-50 w-56 rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  การจัดการด่วน
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsQuickMenuOpen(false);
                    setIsQuickActionOpen(true);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/80"
                >
                  <Home className="h-4 w-4 text-brand-500" />
                  <span>เพิ่มทรัพย์สินใหม่ (Asset)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsQuickMenuOpen(false);
                    setIsQuickActionOpen(true);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/80"
                >
                  <Wrench className="h-4 w-4 text-warning-500" />
                  <span>บันทึกการบำรุงรักษา / ซ่อม</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsQuickMenuOpen(false);
                    setIsQuickActionOpen(true);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/80"
                >
                  <FileUp className="h-4 w-4 text-purple-600" />
                  <span>อัปโหลดเอกสาร / ใบเสร็จ</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsQuickMenuOpen(false);
                    setIsQuickActionOpen(true);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/80"
                >
                  <Receipt className="h-4 w-4 text-success-500" />
                  <span>บันทึกค่าใช้จ่าย (Expense)</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Notifications Icon */}
        <Link
          href="/notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          title="การแจ้งเตือน"
        >
          <Bell className="h-4 w-4" />
          {stats.unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-danger-500 px-1 text-[10px] font-bold text-white shadow-xs animate-pulse">
              {stats.unreadNotificationsCount}
            </span>
          )}
        </Link>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 shadow-xs"
          title={theme === 'dark' ? 'เปลี่ยนเป็นธีมสว่าง (Switch to Light Theme)' : 'เปลี่ยนเป็นธีมมืด (Switch to Dark Theme)'}
          aria-label="สลับธีมสี"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-warning-400" />
          ) : (
            <Moon className="h-4 w-4 text-slate-600" />
          )}
        </button>

        {/* User Account / Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800"
          >
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt={user.name}
                className="h-7 w-7 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 font-bold text-blue-600 dark:bg-blue-900/40 text-xs">
                {user.name.charAt(0)}
              </div>
            )}
            <span className="hidden text-xs font-medium text-slate-700 dark:text-slate-200 md:inline-block max-w-[120px] truncate">
              {user.name}
            </span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsUserMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 z-50 w-64 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-top-2">
                <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                  <div className="font-semibold text-slate-900 dark:text-white text-xs truncate">
                    {user.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {user.email}
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                    <Sparkles className="h-3 w-3" />
                    {settings.householdName}
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href="/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <UserCheck className="h-4 w-4 text-slate-400" />
                    <span>จัดการบัญชีและการตั้งค่า</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      confirmModal({
                        title: 'รีเซ็ตข้อมูลเป็นชุดตัวอย่าง',
                        message: 'ต้องการรีเซ็ตข้อมูลทั้งหมดเป็นชุดตัวอย่างเริ่มต้น (Demo Data) หรือไม่? ข้อมูลที่แก้ไขจะถูกแทนที่',
                        confirmLabel: 'รีเซ็ตข้อมูล',
                        cancelLabel: 'ยกเลิก',
                        variant: 'primary',
                        onConfirm: () => {
                          resetToDemo();
                          showToast('รีเซ็ตข้อมูลสำเร็จ', 'โหลดชุดข้อมูลตัวอย่างเรียบร้อยแล้ว', 'info');
                        },
                      });
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>โหลดข้อมูลตัวอย่าง (Demo)</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
