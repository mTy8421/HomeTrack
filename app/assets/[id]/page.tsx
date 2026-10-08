'use client';

import React, { useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import {
  Box,
  Wrench,
  Receipt,
  ShieldCheck,
  FolderOpen,
  FileText,
  CheckCircle2,
  Plus,
  Edit,
  Trash2,
  Gauge,
  MapPin,
  ArrowLeft,
  UploadCloud,
  Eye,
} from 'lucide-react';
import { CategoryIcon } from '@/components/common/CategoryIcon';
import {
  CURRENT_DATE_STR,
  formatDateThai,
  formatCurrency,
  getDaysDifference,
} from '@/lib/constants';
import { getWarrantyStatus, checkVehicleDualTrigger } from '@/lib/storage';
import { AssetFormModal } from '@/components/assets/AssetFormModal';
import { MaintenanceFormModal } from '@/components/maintenance/MaintenanceFormModal';
import { CompleteMaintenanceModal } from '@/components/maintenance/CompleteMaintenanceModal';
import { ExpenseFormModal } from '@/components/expenses/ExpenseFormModal';
import { DocumentUploadModal } from '@/components/documents/DocumentUploadModal';
import { MaintenanceRecord } from '@/types';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

function AssetDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const assetId = params?.id as string;

  const {
    assets,
    categories,
    maintenance,
    warranties,
    documents,
    expenses,
    updateAsset,
    deleteAsset,
    showToast,
    confirmModal,
    isLoading,
  } = useApp();

  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMaintOpen, setIsAddMaintOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [completeRecord, setCompleteRecord] = useState<MaintenanceRecord | null>(null);

  // Mileage Update Modal for Vehicle
  const [isUpdatingMileage, setIsUpdatingMileage] = useState(false);
  const [newMileageInput, setNewMileageInput] = useState('');

  // Find Asset
  const asset = assets.find((a) => a.id === assetId);

  if (isLoading && assets.length === 0) {
    return (
      <AppLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      </AppLayout>
    );
  }

  if (!asset) {
    return (
      <AppLayout>
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <Box className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-base font-bold text-slate-800 dark:text-white">
            ไม่พบข้อมูลทรัพย์สิน
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            อาจถูกลบหรือระบุรหัสทรัพย์สินไม่ถูกต้อง
          </p>
          <button
            type="button"
            onClick={() => router.push('/assets')}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>กลับหน้ารายการทรัพย์สิน</span>
          </button>
        </div>
      </AppLayout>
    );
  }

  const category = categories.find((c) => c.id === asset.categoryId);

  // Related data
  const assetMaintenance = maintenance.filter((m) => m.assetId === asset.id);
  const assetWarranties = warranties.filter((w) => w.assetId === asset.id);
  const assetDocuments = documents.filter((d) => d.assetId === asset.id);
  const assetExpenses = expenses.filter((e) => e.assetId === asset.id);

  const totalSpent = assetExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Next Maintenance calculation
  const upcomingMaint = assetMaintenance
    .filter((m) => m.status !== 'completed' && m.status !== 'cancelled')
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())[0];

  // Warranty status calculation
  const warrantyStatus = asset.warrantyEnd
    ? getWarrantyStatus(asset.warrantyEnd, CURRENT_DATE_STR)
    : 'active';
  const warrantyDaysLeft = asset.warrantyEnd
    ? getDaysDifference(asset.warrantyEnd, CURRENT_DATE_STR)
    : 0;

  // Insurance status calculation
  const insuranceStatus = asset.insuranceEnd
    ? getWarrantyStatus(asset.insuranceEnd, CURRENT_DATE_STR)
    : 'active';
  const insuranceDaysLeft = asset.insuranceEnd
    ? getDaysDifference(asset.insuranceEnd, CURRENT_DATE_STR)
    : 0;

  // Vehicle dual trigger check
  const vehicleDualStatus =
    asset.isVehicle && upcomingMaint
      ? checkVehicleDualTrigger(upcomingMaint, asset, CURRENT_DATE_STR)
      : null;

  const handleUpdateMileageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const km = parseInt(newMileageInput);
    if (isNaN(km) || km < 0) return;
    updateAsset({
      ...asset,
      currentMileage: km,
      mileageUpdatedAt: CURRENT_DATE_STR,
    });
    showToast('อัปเดตเลขไมล์สำเร็จ', `บันทึกเลขไมล์ปัจจุบัน ${km.toLocaleString()} กม. เรียบร้อยแล้ว`, 'success');
    setIsUpdatingMileage(false);
  };

  const handleDelete = () => {
    confirmModal({
      title: 'ยืนยันการลบทรัพย์สิน',
      message: `คุณต้องการลบ "${asset.name}" ออกจากระบบใช่หรือไม่? ข้อมูลการซ่อมบำรุงและค่าใช้จ่ายทั้งหมดจะถูกลบไปด้วย และไม่สามารถย้อนกลับได้`,
      confirmLabel: 'ลบทรัพย์สิน',
      cancelLabel: 'ยกเลิก',
      variant: 'danger',
      onConfirm: () => {
        deleteAsset(asset.id);
        showToast('ลบทรัพย์สินสำเร็จ', `ลบรายการ "${asset.name}" เรียบร้อยแล้ว`, 'success');
        router.push('/assets');
      },
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb & Actions Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Breadcrumbs
            items={[
              { label: 'ทรัพย์สิน', href: '/assets' },
              { label: asset.name },
            ]}
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddMaintOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-amber-600"
            >
              <Wrench className="h-3.5 w-3.5" />
              <span>+ เพิ่มรอบซ่อม</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddExpenseOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
            >
              <Receipt className="h-3.5 w-3.5" />
              <span>+ บันทึกค่าใช้จ่าย</span>
            </button>
            <button
              type="button"
              onClick={() => setIsUploadDocOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-purple-700"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>+ อัปโหลดเอกสาร</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
              title="แก้ไขข้อมูลทรัพย์สิน"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-xl border border-slate-200 bg-white p-2 text-rose-600 hover:bg-rose-50 dark:border-slate-800 dark:bg-slate-800"
              title="ลบทรัพย์สินนี้"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 1. Master Header Card with Image + Highlights */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Asset Image */}
            <div className="relative h-48 w-full lg:w-72 shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
              {asset.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset.imageUrl}
                  alt={asset.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-300">
                  <CategoryIcon name={category?.icon || 'Home'} className="h-16 w-16" />
                </div>
              )}
              <div className="absolute top-3 left-3 rounded-xl bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-xs flex items-center gap-1.5">
                <CategoryIcon name={category?.icon || 'Home'} className="h-3.5 w-3.5" />
                <span>{category?.name}</span>
              </div>
            </div>

            {/* Asset Header Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {asset.brand}
                  </span>
                  <span className="text-xs text-slate-400">• รุ่น {asset.model}</span>
                  {asset.serialNumber && (
                    <span className="text-xs text-slate-400">
                      • S/N: {asset.serialNumber}
                    </span>
                  )}
                </div>

                <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                  {asset.name}
                </h1>

                <div className="mt-2 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {asset.location}
                  </span>
                  <span>•</span>
                  <span>ซื้อเมื่อ: {formatDateThai(asset.purchaseDate)}</span>
                  <span>•</span>
                  <span>ราคาซื้อ: {formatCurrency(asset.purchasePrice || 0)}</span>
                </div>

                {/* Vehicle Quick Bar */}
                {asset.isVehicle && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl bg-blue-50/70 p-2.5 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-xs flex-wrap">
                    <Gauge className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-blue-900 dark:text-blue-300">
                      ทะเบียน: {asset.licensePlate || '-'}
                    </span>
                    <span>•</span>
                    <span className="text-blue-800 dark:text-blue-300">
                      ไมล์ปัจจุบัน: <strong>{asset.currentMileage?.toLocaleString()} km</strong>
                    </span>
                    {vehicleDualStatus?.isTriggered && (
                      <span className="rounded-full bg-amber-500 text-white font-bold px-2 py-0.5 text-[10px]">
                        ถึงรอบเช็กระยะ ({vehicleDualStatus.reason === 'both' ? 'เวลาและระยะทาง' : vehicleDualStatus.reason === 'mileage' ? 'ตามระยะทาง' : 'ตามเวลา'})
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setNewMileageInput(String(asset.currentMileage || ''));
                        setIsUpdatingMileage(true);
                      }}
                      className="ml-auto rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-blue-700"
                    >
                      อัปเดตไมล์
                    </button>
                  </div>
                )}
              </div>

              {/* Requirement: Next Maintenance & Warranty Expiry highlighted at top! */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                {/* Highlight 1: Next Maintenance */}
                <div className="flex items-start gap-3 rounded-2xl bg-amber-50/70 p-3.5 border border-amber-200/80 dark:bg-amber-950/30 dark:border-amber-900">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shrink-0 shadow-xs">
                    <Wrench className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold text-amber-900 dark:text-amber-300">
                      NEXT MAINTENANCE (รอบดูแลถัดไป)
                    </div>
                    {upcomingMaint ? (
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-xs truncate">
                          {upcomingMaint.title}
                        </div>
                        <div className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                          กำหนด: {formatDateThai(upcomingMaint.scheduledDate)}
                          {upcomingMaint.dueMileage && (
                            <span> (หรือ {upcomingMaint.dueMileage.toLocaleString()} km)</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 mt-0.5">
                        ไม่มีงานบำรุงรักษาที่ค้างอยู่
                      </div>
                    )}
                  </div>
                </div>

                {/* Highlight 2: Warranty & Insurance Expiry */}
                <div className="flex items-start gap-3 rounded-2xl bg-emerald-50/70 p-3.5 border border-emerald-200/80 dark:bg-emerald-950/30 dark:border-emerald-900">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shrink-0 shadow-xs">
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold text-emerald-900 dark:text-emerald-300">
                      {asset.isVehicle && asset.insuranceEnd ? 'INSURANCE & WARRANTY (สถานะความคุ้มครอง)' : 'WARRANTY EXPIRY (สถานะการรับประกัน)'}
                    </div>
                    {asset.isVehicle && asset.insuranceEnd ? (
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-xs">
                            ประกันภัยหมด: {formatDateThai(asset.insuranceEnd)}
                          </span>
                          {insuranceStatus === 'expiring_soon' && (
                            <span className="rounded-full bg-amber-500 px-2 py-0.2 text-[10px] font-bold text-white">
                              เหลือ {insuranceDaysLeft} วัน
                            </span>
                          )}
                          {insuranceStatus === 'expired' && (
                            <span className="rounded-full bg-rose-500 px-2 py-0.2 text-[10px] font-bold text-white">
                              หมดอายุแล้ว
                            </span>
                          )}
                          {insuranceStatus === 'active' && (
                            <span className="rounded-full bg-emerald-600 px-2 py-0.2 text-[10px] font-bold text-white">
                              คุ้มครองปกติ
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-emerald-700 dark:text-emerald-400 truncate">
                          {asset.insuranceProvider || 'ประกันภัยรถยนต์'}
                        </div>
                      </div>
                    ) : asset.warrantyEnd ? (
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-xs">
                            หมดอายุ: {formatDateThai(asset.warrantyEnd)}
                          </span>
                          {warrantyStatus === 'expiring_soon' && (
                            <span className="rounded-full bg-amber-500 px-2 py-0.2 text-[10px] font-bold text-white">
                              เหลือ {warrantyDaysLeft} วัน
                            </span>
                          )}
                          {warrantyStatus === 'expired' && (
                            <span className="rounded-full bg-rose-500 px-2 py-0.2 text-[10px] font-bold text-white">
                              หมดอายุแล้ว
                            </span>
                          )}
                          {warrantyStatus === 'active' && (
                            <span className="rounded-full bg-emerald-600 px-2 py-0.2 text-[10px] font-bold text-white">
                              คุ้มครองปกติ
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-emerald-700 dark:text-emerald-400 truncate">
                          {asset.warrantyProvider || 'ศูนย์รับประกันมาตรฐาน'}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 mt-0.5">
                        ไม่ได้บันทึกข้อมูลการรับประกัน
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Update Mileage Modal */}
        {isUpdatingMileage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                อัปเดตเลขไมล์ปัจจุบัน (Update Odometer)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                ระบบจะใช้คำนวณรอบบำรุงรักษาถัดไป เช่น เช็กระยะ 50,000 km
              </p>
              <form onSubmit={handleUpdateMileageSubmit} className="mt-4 space-y-3">
                <input
                  type="number"
                  required
                  value={newMileageInput}
                  onChange={(e) => setNewMileageInput(e.target.value)}
                  placeholder="เช่น 49200"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsUpdatingMileage(false)}
                    className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    บันทึกเลขไมล์
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2. Navigation Tabs (Requirement: 6 Tabs)
            1. Overview
            2. Maintenance
            3. Expenses
            4. Warranty
            5. Documents
            6. Notes */}
        <div className="border-b border-slate-200 dark:border-slate-800">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto">
            {[
              { id: 'overview', label: '1. ภาพรวม (Overview)', icon: Box, count: null },
              { id: 'maintenance', label: '2. การบำรุงรักษา (Maintenance)', icon: Wrench, count: assetMaintenance.length },
              { id: 'expenses', label: '3. ค่าใช้จ่าย (Expenses)', icon: Receipt, count: assetExpenses.length },
              { id: 'warranty', label: '4. ประกัน & คุ้มครอง (Warranty)', icon: ShieldCheck, count: assetWarranties.length },
              { id: 'documents', label: '5. คลังเอกสาร (Documents)', icon: FolderOpen, count: assetDocuments.length },
              { id: 'notes', label: '6. บันทึกช่วยจำ (Notes)', icon: FileText, count: null },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-semibold transition-all shrink-0 ${
                    isActive
                      ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                        isActive
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* 3. Tab Contents */}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <span className="text-[11px] text-slate-400">ค่าดูแลและซ่อมแซมสะสม</span>
                <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(totalSpent)}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  จากทั้งหมด {assetExpenses.length} รายการค่าใช้จ่าย
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <span className="text-[11px] text-slate-400">ประวัติการดูแลที่ทำแล้ว</span>
                <div className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {assetMaintenance.filter((m) => m.status === 'completed').length} ครั้ง
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  รอทำอีก {assetMaintenance.filter((m) => m.status !== 'completed').length} รายการ
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <span className="text-[11px] text-slate-400">เอกสารในคลัง</span>
                <div className="mt-1 text-xl font-bold text-purple-600 dark:text-purple-400">
                  {assetDocuments.length} ฉบับ
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  คู่มือ ใบเสร็จ และกรมธรรม์
                </div>
              </div>
            </div>

            {/* Detailed Spec Grid */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                ข้อมูลจำเพาะและประวัติการจัดซื้อ (Specifications)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs">
                <div>
                  <span className="text-slate-400 block">หมวดหมู่:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {category?.name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">ยี่ห้อ (Brand):</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {asset.brand}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">รุ่น (Model):</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {asset.model}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">หมายเลขเครื่อง (Serial Number):</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {asset.serialNumber || '-'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">สถานที่ติดตั้ง / จัดเก็บ:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {asset.location}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">ผู้ขาย / ร้านค้า:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {asset.vendor || '-'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">วันที่ซื้อ:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatDateThai(asset.purchaseDate)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">ราคาซื้อ:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatCurrency(asset.purchasePrice || 0)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">วันที่เริ่มใช้งาน:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {asset.installationDate ? formatDateThai(asset.installationDate) : '-'}
                  </span>
                </div>
              </div>

              {/* Vehicle specific panel if car */}
              {asset.isVehicle && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-blue-900 dark:text-blue-300 text-xs mb-3 flex items-center gap-1.5">
                    <Gauge className="h-4 w-4 text-blue-600" />
                    ข้อมูลเฉพาะรถยนต์
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">ทะเบียนรถ:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {asset.licensePlate || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">เลขไมล์ปัจจุบัน:</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {asset.currentMileage?.toLocaleString()} km
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">ปีผลิต (Year):</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {asset.vehicleYear || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">เลขตัวถัง (VIN):</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {asset.vin || '-'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MAINTENANCE */}
        {activeTab === 'maintenance' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                บันทึกประวัติและรอบการบำรุงรักษา ({assetMaintenance.length} รายการ)
              </h3>
              <button
                type="button"
                onClick={() => setIsAddMaintOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-amber-600"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ เพิ่มรายการบำรุงรักษา</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs">
              {assetMaintenance.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  ยังไม่มีรายการบำรุงรักษาสำหรับทรัพย์สินนี้
                </div>
              ) : (
                assetMaintenance.map((m) => {
                  const isCompleted = m.status === 'completed';
                  return (
                    <div
                      key={m.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white text-xs">
                            {m.title}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              isCompleted
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {isCompleted ? '✓ เสร็จสิ้นแล้ว' : 'รอทำ'}
                          </span>
                          {m.isRecurring && (
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                              รอบทุก {m.intervalValue} {m.intervalUnit}
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-3 flex-wrap">
                          <span>
                            {isCompleted
                              ? `ทำเมื่อ: ${formatDateThai(m.completedDate || m.scheduledDate)}`
                              : `กำหนด: ${formatDateThai(m.scheduledDate)}`}
                          </span>
                          {m.cost > 0 && <span>• ค่าใช้จ่าย: {formatCurrency(m.cost)}</span>}
                          {m.provider && <span>• ผู้ให้บริการ: {m.provider}</span>}
                          {m.mileage && <span>• เลขไมล์: {m.mileage.toLocaleString()} km</span>}
                        </div>

                        {m.description && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 pt-1">
                            {m.description}
                          </p>
                        )}

                        {m.partsReplaced && m.partsReplaced.length > 0 && (
                          <div className="text-[10px] text-slate-500 pt-1 flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold">อะไหล่ที่เปลี่ยน:</span>
                            {m.partsReplaced.map((part, idx) => (
                              <span
                                key={idx}
                                className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800"
                              >
                                {part}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {!isCompleted && (
                        <button
                          type="button"
                          onClick={() => setCompleteRecord(m)}
                          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 self-start sm:self-center shrink-0"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>บันทึกทำเสร็จ</span>
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 3: EXPENSES */}
        {activeTab === 'expenses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  ประวัติค่าใช้จ่ายทั้งหมด ({formatCurrency(totalSpent)})
                </h3>
                <p className="text-xs text-slate-400">
                  “อะไรเคยทำอะไรไป เมื่อไหร่ และเสียเงินเท่าไหร่”
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddExpenseOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ บันทึกค่าใช้จ่าย</span>
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50/70 font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
                  <tr>
                    <th className="px-4 py-3">วันที่</th>
                    <th className="px-4 py-3">รายการ</th>
                    <th className="px-4 py-3">หมวดหมู่</th>
                    <th className="px-4 py-3">ร้านค้า / ผู้ให้บริการ</th>
                    <th className="px-4 py-3 text-right">จำนวนเงิน</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {assetExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        ยังไม่มีรายการค่าใช้จ่ายสำหรับทรัพย์สินนี้
                      </td>
                    </tr>
                  ) : (
                    assetExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3 text-slate-500">{formatDateThai(exp.date)}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                          {exp.description}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {exp.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                          {exp.provider || '-'}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">
                          {formatCurrency(exp.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: WARRANTY & INSURANCE */}
        {activeTab === 'warranty' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              สัญญาการรับประกันและประกันภัย (Warranty & Insurance Policies)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assetWarranties.map((w) => {
                const status = getWarrantyStatus(w.endDate, CURRENT_DATE_STR);
                const days = getDaysDifference(w.endDate, CURRENT_DATE_STR);
                return (
                  <div
                    key={w.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300 uppercase">
                        {w.type}
                      </span>
                      {status === 'active' && (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          Active (คุ้มครอง)
                        </span>
                      )}
                      {status === 'expiring_soon' && (
                        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                          ใกล้หมดอายุ (อีก {days} วัน)
                        </span>
                      )}
                      {status === 'expired' && (
                        <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                          หมดอายุแล้ว
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                        {w.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">{w.provider}</p>
                    </div>

                    <div className="text-[11px] space-y-1 text-slate-600 dark:text-slate-400">
                      <div>เลขที่กรมธรรม์: {w.policyNumber || '-'}</div>
                      <div>เริ่ม: {formatDateThai(w.startDate)} • หมดอายุ: {formatDateThai(w.endDate)}</div>
                      {w.contactNumber && <div>เบอร์ติดต่อฉุกเฉิน: {w.contactNumber}</div>}
                      {w.coverageDetails && (
                        <div className="pt-1 text-slate-500 italic">{w.coverageDetails}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  คลังเอกสารของ {asset.name} ({assetDocuments.length} รายการ)
                </h3>
                <p className="text-xs text-slate-400">
                  คู่มือสินค้า ใบเสร็จ ใบรับประกัน และเอกสารสำคัญ
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadDocOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-purple-700"
              >
                <UploadCloud className="h-3.5 w-3.5" />
                <span>+ อัปโหลดเอกสาร</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {assetDocuments.length === 0 ? (
                <div className="col-span-full p-8 text-center text-xs text-slate-400 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  ยังไม่มีเอกสารแนบสำหรับทรัพย์สินนี้
                </div>
              ) : (
                assetDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="rounded-lg bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300 uppercase">
                          {doc.fileType}
                        </span>
                        <span className="text-[10px] text-slate-400">{doc.fileSize}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs line-clamp-2">
                        {doc.name}
                      </h4>
                      {doc.invoiceNumber && (
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          เลขที่: {doc.invoiceNumber}
                        </p>
                      )}
                      {doc.notes && (
                        <p className="text-[11px] text-slate-400 mt-1 italic line-clamp-2">
                          {doc.notes}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        {formatDateThai(doc.uploadedAt)}
                      </span>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>เปิดดู</span>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 6: NOTES */}
        {activeTab === 'notes' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              บันทึกช่วยจำและข้อสังเกต (Asset Notes)
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {asset.notes || 'ไม่มีบันทึกข้อความเพิ่มเติม'}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300"
              >
                <Edit className="h-3.5 w-3.5" />
                <span>แก้ไขบันทึก</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sub modals */}
      <AssetFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        assetToEdit={asset}
      />
      <MaintenanceFormModal
        isOpen={isAddMaintOpen}
        onClose={() => setIsAddMaintOpen(false)}
        defaultAssetId={asset.id}
      />
      <ExpenseFormModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        defaultAssetId={asset.id}
      />
      <DocumentUploadModal
        isOpen={isUploadDocOpen}
        onClose={() => setIsUploadDocOpen(false)}
        defaultAssetId={asset.id}
      />
      <CompleteMaintenanceModal
        isOpen={Boolean(completeRecord)}
        onClose={() => setCompleteRecord(null)}
        record={completeRecord}
      />
    </AppLayout>
  );
}

export default function AssetDetailPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">กำลังโหลดข้อมูลทรัพย์สิน...</div>}>
      <AssetDetailContent />
    </Suspense>
  );
}

