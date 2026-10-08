'use client';

import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Search,
  X,
  Box,
  Wrench,
  FileText,
  Receipt,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { formatCurrency } from '@/lib/constants';

export function GlobalSearchModal() {
  const router = useRouter();
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery, searchResults } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const handleSelect = (url: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    router.push(url);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'asset':
        return <Box className="h-4 w-4 text-blue-600" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4 text-amber-600" />;
      case 'document':
        return <FileText className="h-4 w-4 text-purple-600" />;
      case 'expense':
        return <Receipt className="h-4 w-4 text-emerald-600" />;
      default:
        return <ShieldCheck className="h-4 w-4 text-indigo-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="fixed inset-0"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden z-10">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาทรัพย์สิน, ยี่ห้อ, รุ่น, รายการซ่อม, ใบเสร็จ, ทะเบียน..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-hidden dark:text-white"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="rounded-lg border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-2">
          {searchQuery.trim() === '' ? (
            <div className="p-6 text-center text-xs text-slate-400">
              <p className="font-medium text-slate-600 dark:text-slate-300 mb-1">
                ค้นหาข้อมูลครอบคลุมทั้งระบบ
              </p>
              <p>
                ลองค้นหา: <span className="font-semibold text-blue-600 cursor-pointer" onClick={() => setSearchQuery('Camry')}>Camry</span>,{' '}
                <span className="font-semibold text-blue-600 cursor-pointer" onClick={() => setSearchQuery('Daikin')}>Daikin</span>,{' '}
                <span className="font-semibold text-blue-600 cursor-pointer" onClick={() => setSearchQuery('น้ำมันเครื่อง')}>น้ำมันเครื่อง</span>,{' '}
                <span className="font-semibold text-blue-600 cursor-pointer" onClick={() => setSearchQuery('ประกัน')}>ประกัน</span>
              </p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              <p className="font-medium text-slate-600 dark:text-slate-300">
                ไม่พบข้อมูลที่ตรงกับ &quot;{searchQuery}&quot;
              </p>
              <p className="mt-1">ลองเปลี่ยนคำค้นหาเป็นชื่อแบรนด์ รุ่น หรือประเภทงาน</p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                ผลการค้นหา ({searchResults.length} รายการ)
              </div>
              {searchResults.map((item) => (
                <button
                  key={`${item.type}-${item.id}`}
                  type="button"
                  onClick={() => handleSelect(item.url)}
                  className="flex w-full items-center justify-between rounded-xl p-2.5 text-left text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                      {getIcon(item.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {item.amount !== undefined && item.amount > 0 && (
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {formatCurrency(item.amount)}
                      </span>
                    )}
                    {item.badge && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {item.badge}
                      </span>
                    )}
                    <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-blue-600 dark:text-slate-600" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
