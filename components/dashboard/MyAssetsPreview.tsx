'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Box, ArrowRight, Wrench, Gauge } from 'lucide-react';
import { CategoryIcon } from '@/components/common/CategoryIcon';
import { getWarrantyStatus } from '@/lib/storage';
import { CURRENT_DATE_STR, formatDateThai, formatCurrency } from '@/lib/constants';

export function MyAssetsPreview() {
  const { assets, categories, maintenance, expenses } = useApp();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
            <Box className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              ทรัพย์สินที่สำคัญของบ้าน (My Assets)
            </h3>
            <p className="text-[11px] text-slate-400">
              ติดตามประวัติ สภาพการใช้งาน และค่าใช้จ่ายของแต่ละชิ้น
            </p>
          </div>
        </div>

        <Link
          href="/assets"
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          <span>ดูทั้งหมด ({assets.length})</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.slice(0, 6).map((asset) => {
          const category = categories.find((c) => c.id === asset.categoryId);

          // Find next scheduled maintenance
          const nextMaint = maintenance
            .filter((m) => m.assetId === asset.id && m.status !== 'completed' && m.status !== 'cancelled')
            .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())[0];

          // Warranty status
          const warStatus = asset.warrantyEnd
            ? getWarrantyStatus(asset.warrantyEnd, CURRENT_DATE_STR)
            : 'active';

          // Total expense on this asset
          const totalSpent = expenses
            .filter((e) => e.assetId === asset.id)
            .reduce((sum, e) => sum + e.amount, 0);

          return (
            <Link
              key={asset.id}
              href={`/assets/${asset.id}`}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 hover:border-blue-300 dark:hover:border-blue-900"
            >
              <div>
                {/* Image & Category badge */}
                <div className="relative h-32 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 mb-3">
                  {asset.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset.imageUrl}
                      alt={asset.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                      <CategoryIcon name={category?.icon || 'Home'} className="h-12 w-12" />
                    </div>
                  )}

                  {/* Category Chip */}
                  <div className="absolute top-2 left-2 rounded-lg bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs flex items-center gap-1">
                    <CategoryIcon name={category?.icon || 'Home'} className="h-3 w-3" />
                    <span>{category?.name || 'ทั่วไป'}</span>
                  </div>

                  {/* Warranty Badge */}
                  {asset.warrantyEnd && (
                    <div className="absolute top-2 right-2">
                      {warStatus === 'expiring_soon' && (
                        <span className="rounded-lg bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                          ประกันใกล้หมด
                        </span>
                      )}
                      {warStatus === 'expired' && (
                        <span className="rounded-lg bg-rose-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                          หมดประกัน
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Info */}
                <h4 className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-blue-600 transition-colors line-clamp-1">
                  {asset.name}
                </h4>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {asset.brand} {asset.model} • {asset.location}
                </div>

                {/* Vehicle Mileage */}
                {asset.isVehicle && asset.currentMileage !== undefined && (
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                    <Gauge className="h-3 w-3" />
                    <span>{asset.currentMileage.toLocaleString()} km</span>
                    {asset.licensePlate && <span>({asset.licensePlate})</span>}
                  </div>
                )}
              </div>

              {/* Bottom Footer Details */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-[11px]">
                {/* Next Maintenance */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Wrench className="h-3 w-3 text-slate-400" />
                    รอบดูแลถัดไป:
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {nextMaint ? formatDateThai(nextMaint.scheduledDate) : 'ยังไม่มีกำหนด'}
                  </span>
                </div>

                {/* Total Cost */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">ค่าดูแลสะสม:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatCurrency(totalSpent)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
