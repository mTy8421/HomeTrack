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
  Receipt,
  Bell,
} from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();
  const { stats } = useApp();

  const links = [
    { label: 'แดชบอร์ด', href: '/', icon: LayoutDashboard },
    { label: 'ทรัพย์สิน', href: '/assets', icon: Box },
    {
      label: 'บำรุงรักษา',
      href: '/maintenance',
      icon: Wrench,
      badge: stats.overdueCount > 0 ? stats.overdueCount : undefined,
    },
    { label: 'ปฏิทิน', href: '/calendar', icon: Calendar },
    { label: 'ค่าใช้จ่าย', href: '/expenses', icon: Receipt },
    {
      label: 'เตือน',
      href: '/notifications',
      icon: Bell,
      badge: stats.unreadNotificationsCount > 0 ? stats.unreadNotificationsCount : undefined,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-2 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 md:hidden">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive =
          link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative flex flex-col items-center justify-center py-1 px-2 text-[10px] font-medium transition-colors ${
              isActive
                ? 'text-brand-500 font-bold dark:text-brand-400'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className="h-5 w-5" />
              {link.badge !== undefined && (
                <span className="absolute -top-1 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger-500 px-1 text-[9px] font-bold text-white shadow-xs">
                  {link.badge}
                </span>
              )}
            </div>
            <span className="mt-1 truncate max-w-[50px]">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
