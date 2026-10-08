'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import { Asset } from '@/types';
import {
  Box,
  Plus,
  Search,
  LayoutGrid,
  Table as TableIcon,
  Trash2,
  Edit,
  MapPin,
  Gauge,
  ArrowUpDown,
} from 'lucide-react';
import { CategoryIcon } from '@/components/common/CategoryIcon';
import { AssetFormModal } from '@/components/assets/AssetFormModal';
import { getWarrantyStatus } from '@/lib/storage';
import { CURRENT_DATE_STR, formatDateThai, formatCurrency } from '@/lib/constants';
import { EmptyState } from '@/components/ui/EmptyState';

export default function AssetsPage() {
  const { assets, categories, maintenance, deleteAsset, addCategory, showToast, confirmModal, isLoading } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'purchaseDate' | 'price'>('name');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState<Asset | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Filter & Search
  const filteredAssets = assets
    .filter((a) => {
      if (selectedCategory !== 'all' && a.categoryId !== selectedCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = a.name.toLowerCase().includes(q);
        const matchBrand = a.brand.toLowerCase().includes(q);
        const matchModel = a.model.toLowerCase().includes(q);
        const matchLoc = a.location.toLowerCase().includes(q);
        const matchSerial = a.serialNumber?.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchModel && !matchLoc && !matchSerial) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'purchaseDate') return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
      if (sortBy === 'price') return (b.purchasePrice || 0) - (a.purchasePrice || 0);
      return 0;
    });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName.trim(), 'Box');
    showToast('เพิ่มหมวดหมู่สำเร็จ', `เพิ่มหมวดหมู่ "${newCategoryName.trim()}" เรียบร้อยแล้ว`, 'success');
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  const handleDelete = (id: string, name: string) => {
    confirmModal({
      title: 'ยืนยันการลบทรัพย์สิน',
      message: `คุณต้องการลบทรัพย์สิน "${name}" ใช่หรือไม่? ประวัติการซ่อมบำรุงและข้อมูลที่เกี่ยวข้องจะถูกลบไปด้วย และไม่สามารถย้อนกลับได้`,
      confirmLabel: 'ลบทรัพย์สิน',
      cancelLabel: 'ยกเลิก',
      variant: 'danger',
      onConfirm: () => {
        deleteAsset(id);
        showToast('ลบทรัพย์สินสำเร็จ', `ลบรายการ "${name}" เรียบร้อยแล้ว`, 'success');
      },
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl flex items-center gap-2">
              <Box className="h-6 w-6 text-brand-500" />
              <span>จัดการทรัพย์สินทั้งหมด (Asset Management)</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              รวม {assets.length} รายการ (บ้าน รถยนต์ แอร์ ตู้เย็น เครื่องซักผ้า เครื่องใช้ไฟฟ้า)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setAssetToEdit(null);
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-brand-600 transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>+ เพิ่มทรัพย์สินใหม่</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`rounded-xl px-3 py-1.5 text-xs font-medium shrink-0 transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            }`}
          >
            ทั้งหมด ({assets.length})
          </button>
          {categories.map((c) => {
            const count = assets.filter((a) => a.categoryId === c.id).length;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium shrink-0 transition-all ${
                  selectedCategory === c.id
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                }`}
              >
                <CategoryIcon name={c.icon} className="h-3.5 w-3.5" />
                <span>{c.name}</span>
                <span className="opacity-70 text-[10px]">({count})</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setIsAddingCategory(true)}
            className="flex items-center gap-1 rounded-xl border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-500 hover:border-slate-400 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400 shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>สร้างหมวดหมู่ใหม่</span>
          </button>
        </div>

        {/* Add Category Dialog */}
        {isAddingCategory && (
          <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3 dark:border-blue-900/60 dark:bg-blue-950/40 flex items-center gap-3">
            <span className="text-xs font-medium text-blue-900 dark:text-blue-300">
              ชื่อหมวดหมู่ใหม่:
            </span>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="เช่น อุปกรณ์ไอที, เครื่องมือช่าง"
              className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs outline-hidden dark:border-slate-800 dark:bg-slate-800"
            />
            <button
              type="button"
              onClick={handleCreateCategory}
              className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
            >
              เพิ่ม
            </button>
            <button
              type="button"
              onClick={() => setIsAddingCategory(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              ยกเลิก
            </button>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อ, แบรนด์, รุ่น, ห้อง..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-1.5 pl-9 pr-3 text-xs outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>เรียงตาม:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'purchaseDate' | 'price')}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs outline-hidden dark:border-slate-800 dark:bg-slate-800"
              >
                <option value="name">ชื่อ (ก-ฮ / A-Z)</option>
                <option value="purchaseDate">วันที่ซื้อ (ล่าสุด)</option>
                <option value="price">ราคาซื้อ (มากไปน้อย)</option>
              </select>
            </div>

            <div className="flex rounded-lg border border-slate-200 p-0.5 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`rounded p-1 ${
                  viewMode === 'grid'
                    ? 'bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400'
                    : 'text-slate-400'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`rounded p-1 ${
                  viewMode === 'table'
                    ? 'bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400'
                    : 'text-slate-400'
                }`}
                title="Table View"
              >
                <TableIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content: Grid or Table */}
        {isLoading && assets.length === 0 ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : filteredAssets.length === 0 ? (
          <EmptyState
            icon={Box}
            title="ไม่พบรายการทรัพย์สิน"
            description={search ? 'ลองเปลี่ยนคำค้นหา หรือเลือกตัวกรองหมวดหมู่อื่น' : 'เริ่มต้นบันทึกและจัดการทรัพย์สินชิ้นแรกของบ้าน'}
            actionLabel="เพิ่มทรัพย์สินใหม่"
            onAction={() => {
              setAssetToEdit(null);
              setIsAddModalOpen(true);
            }}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAssets.map((asset) => {
              const category = categories.find((c) => c.id === asset.categoryId);
              const warStatus = asset.warrantyEnd
                ? getWarrantyStatus(asset.warrantyEnd, CURRENT_DATE_STR)
                : 'active';

              const nextMaint = maintenance
                .filter((m) => m.assetId === asset.id && m.status !== 'completed' && m.status !== 'cancelled')
                .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())[0];

              return (
                <div
                  key={asset.id}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div>
                    {/* Top image */}
                    <div className="relative h-36 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 mb-3">
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
                        <span>{category?.name}</span>
                      </div>

                      {/* Action buttons on hover */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setAssetToEdit(asset);
                            setIsAddModalOpen(true);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-slate-700 shadow-sm hover:bg-white dark:bg-slate-800 dark:text-slate-200"
                          title="แก้ไข"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(asset.id, asset.name);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-rose-600 shadow-sm hover:bg-white dark:bg-slate-800"
                          title="ลบ"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <Link href={`/assets/${asset.id}`}>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                        {asset.name}
                      </h3>
                    </Link>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {asset.brand} {asset.model}
                    </div>

                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{asset.location}</span>
                    </div>

                    {asset.isVehicle && (
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                        <Gauge className="h-3.5 w-3.5 shrink-0" />
                        <span>{asset.currentMileage?.toLocaleString()} km</span>
                        {asset.licensePlate && <span>({asset.licensePlate})</span>}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] space-y-2">
                    {/* Next Maintenance */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">รอบดูแลถัดไป:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {nextMaint ? formatDateThai(nextMaint.scheduledDate) : '-'}
                      </span>
                    </div>

                    {/* Warranty Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">การรับประกัน:</span>
                      <span>
                        {asset.warrantyEnd ? (
                          warStatus === 'expiring_soon' ? (
                            <span className="font-semibold text-amber-600">ใกล้หมด</span>
                          ) : warStatus === 'expired' ? (
                            <span className="font-semibold text-rose-600">หมดอายุ</span>
                          ) : (
                            <span className="font-semibold text-emerald-600">มีประกัน</span>
                          )
                        ) : (
                          <span className="text-slate-400">ไม่มี</span>
                        )}
                      </span>
                    </div>

                    {/* Button */}
                    <Link
                      href={`/assets/${asset.id}`}
                      className="block w-full rounded-xl bg-slate-50 py-2 text-center text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:bg-slate-800/60 dark:text-blue-400 dark:hover:bg-slate-800"
                    >
                      ดูข้อมูลฉบับเต็ม & ประวัติ →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50/70 font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
                  <tr>
                    <th className="px-4 py-3">ทรัพย์สิน</th>
                    <th className="px-4 py-3">หมวดหมู่</th>
                    <th className="px-4 py-3">สถานที่</th>
                    <th className="px-4 py-3">วันที่ซื้อ</th>
                    <th className="px-4 py-3">ราคาซื้อ</th>
                    <th className="px-4 py-3">ประกัน</th>
                    <th className="px-4 py-3 text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredAssets.map((asset) => {
                    const category = categories.find((c) => c.id === asset.categoryId);
                    const warStatus = asset.warrantyEnd
                      ? getWarrantyStatus(asset.warrantyEnd, CURRENT_DATE_STR)
                      : 'active';

                    return (
                      <tr
                        key={asset.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/assets/${asset.id}`}
                            className="font-bold text-slate-900 hover:text-blue-600 dark:text-white"
                          >
                            {asset.name}
                          </Link>
                          <div className="text-[11px] text-slate-400">
                            {asset.brand} {asset.model}
                            {asset.licensePlate && ` • ${asset.licensePlate}`}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            <CategoryIcon name={category?.icon || 'Home'} className="h-3 w-3" />
                            {category?.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                          {asset.location}
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {formatDateThai(asset.purchaseDate)}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(asset.purchasePrice || 0)}
                        </td>
                        <td className="px-4 py-3">
                          {asset.warrantyEnd ? (
                            <span
                              className={`text-[11px] font-semibold ${
                                warStatus === 'expiring_soon'
                                  ? 'text-amber-600'
                                  : warStatus === 'expired'
                                  ? 'text-rose-600'
                                  : 'text-emerald-600'
                              }`}
                            >
                              {formatDateThai(asset.warrantyEnd)}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setAssetToEdit(asset);
                                setIsAddModalOpen(true);
                              }}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(asset.id, asset.name)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AssetFormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setAssetToEdit(null);
        }}
        assetToEdit={assetToEdit}
      />
    </AppLayout>
  );
}
