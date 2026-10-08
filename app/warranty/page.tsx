'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import { WarrantyRecord, WarrantyType } from '@/types';
import {
  ShieldCheck,
  Plus,
  Search,
  Eye,
  Trash2,
  Edit,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  CURRENT_DATE_STR,
  formatDateThai,
  getDaysDifference,
} from '@/lib/constants';
import { getWarrantyStatus } from '@/lib/storage';

type StatusFilterType = 'all' | 'active' | 'expiring_soon' | 'expired';

function WarrantyContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'all';

  const {
    assets,
    warranties,
    documents,
    addWarranty,
    updateWarranty,
    deleteWarranty,
    showToast,
    confirmModal,
  } = useApp();

  const [activeType, setActiveType] = useState<string>(initialTab);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expiring_soon' | 'expired'>('all');
  const [search, setSearch] = useState('');

  // Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<WarrantyRecord | null>(null);

  // Form state
  const [assetId, setAssetId] = useState('');
  const [type, setType] = useState<WarrantyType>('warranty');
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [startDate, setStartDate] = useState(CURRENT_DATE_STR);
  const [endDate, setEndDate] = useState('');
  const [cost, setCost] = useState('0');
  const [coverageDetails, setCoverageDetails] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [documentId, setDocumentId] = useState('');

  const openAddModal = (item?: WarrantyRecord) => {
    if (item) {
      setRecordToEdit(item);
      setAssetId(item.assetId);
      setType(item.type);
      setTitle(item.title);
      setProvider(item.provider);
      setPolicyNumber(item.policyNumber || '');
      setStartDate(item.startDate);
      setEndDate(item.endDate);
      setCost(String(item.cost || 0));
      setCoverageDetails(item.coverageDetails || '');
      setContactNumber(item.contactNumber || '');
      setNotes(item.notes || '');
      setDocumentId(item.documentId || '');
    } else {
      setRecordToEdit(null);
      setAssetId(assets[0]?.id || '');
      setType('warranty');
      setTitle('');
      setProvider('');
      setPolicyNumber('');
      setStartDate(CURRENT_DATE_STR);
      setEndDate('');
      setCost('0');
      setCoverageDetails('');
      setContactNumber('');
      setNotes('');
      setDocumentId('');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetId || !title.trim() || !endDate) {
      showToast('ข้อมูลไม่ครบถ้วน', 'กรุณาระบุทรัพย์สิน ชื่องาน และวันสิ้นสุดความคุ้มครองให้ครบถ้วน', 'warning');
      return;
    }

    const payload = {
      assetId,
      type,
      title: title.trim(),
      provider: provider.trim(),
      policyNumber: policyNumber.trim() || undefined,
      startDate,
      endDate,
      cost: parseFloat(cost) || 0,
      coverageDetails: coverageDetails.trim() || undefined,
      contactNumber: contactNumber.trim() || undefined,
      notes: notes.trim() || undefined,
      documentId: documentId || undefined,
    };

    if (recordToEdit) {
      updateWarranty({
        ...recordToEdit,
        ...payload,
      });
      showToast('แก้ไขข้อมูลสำเร็จ', `อัปเดตข้อมูล "${payload.title}" เรียบร้อยแล้ว`, 'success');
    } else {
      addWarranty(payload);
      showToast('บันทึกข้อมูลสำเร็จ', `เพิ่มข้อมูล "${payload.title}" เรียบร้อยแล้ว`, 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    confirmModal({
      title: 'ยืนยันการลบข้อมูลประกันภัย',
      message: `คุณต้องการลบข้อมูล "${name}" ออกจากระบบใช่หรือไม่?`,
      confirmLabel: 'ลบข้อมูล',
      cancelLabel: 'ยกเลิก',
      variant: 'danger',
      onConfirm: () => {
        deleteWarranty(id);
        showToast('ลบข้อมูลสำเร็จ', `ลบข้อมูล "${name}" เรียบร้อยแล้ว`, 'success');
      },
    });
  };

  // Filtered Warranties
  const filteredList = warranties.filter((w) => {
    if (activeType !== 'all') {
      if (activeType === 'warranty' && w.type !== 'warranty') return false;
      if (activeType === 'insurance' && w.type !== 'insurance') return false;
      if (activeType === 'tax' && w.type !== 'tax' && w.type !== 'registration') return false;
    }

    const status = getWarrantyStatus(w.endDate, CURRENT_DATE_STR);
    if (statusFilter !== 'all' && status !== statusFilter) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = w.title.toLowerCase().includes(q);
      const matchProvider = w.provider.toLowerCase().includes(q);
      const matchPolicy = w.policyNumber?.toLowerCase().includes(q);
      const asset = assets.find((a) => a.id === w.assetId);
      const matchAsset = asset ? asset.name.toLowerCase().includes(q) : false;
      if (!matchTitle && !matchProvider && !matchPolicy && !matchAsset) return false;
    }

    return true;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
              <span>การรับประกัน & ประกันภัย (Warranty & Insurance)</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              ติดตามวันหมดอายุสัญญาประกันภัย กรมธรรม์รถยนต์ และการรับประกันสินค้าภายในบ้าน
            </p>
          </div>

          <button
            type="button"
            onClick={() => openAddModal()}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>+ บันทึกประกัน / กรมธรรม์</span>
          </button>
        </div>

        {/* Status Count Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                Active (กำลังคุ้มครอง)
              </span>
              <div className="text-2xl font-black text-emerald-900 dark:text-emerald-200 mt-1">
                {warranties.filter((w) => getWarrantyStatus(w.endDate, CURRENT_DATE_STR) === 'active').length}
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/60 dark:bg-amber-950/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                Expiring Soon (หมดอายุใน 30 วัน)
              </span>
              <div className="text-2xl font-black text-amber-900 dark:text-amber-200 mt-1">
                {warranties.filter((w) => getWarrantyStatus(w.endDate, CURRENT_DATE_STR) === 'expiring_soon').length}
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white">
              <Clock className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 dark:border-rose-900/60 dark:bg-rose-950/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400">
                Expired (สิ้นสุดความคุ้มครองแล้ว)
              </span>
              <div className="text-2xl font-black text-rose-900 dark:text-rose-200 mt-1">
                {warranties.filter((w) => getWarrantyStatus(w.endDate, CURRENT_DATE_STR) === 'expired').length}
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 text-white">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {[
              { id: 'all', label: 'ทั้งหมด' },
              { id: 'warranty', label: 'การรับประกันสินค้า (Warranty)' },
              { id: 'insurance', label: 'ประกันภัย / พ.ร.บ. (Insurance)' },
              { id: 'tax', label: 'ภาษีประจำปี (Tax)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveType(tab.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold shrink-0 transition-all ${
                  activeType === tab.id
                    ? 'bg-brand-500 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilterType)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs outline-hidden dark:border-slate-800 dark:bg-slate-800"
            >
              <option value="all">ทุกสถานะ</option>
              <option value="active">Active (คุ้มครอง)</option>
              <option value="expiring_soon">Expiring Soon (ใกล้หมด)</option>
              <option value="expired">Expired (หมดอายุ)</option>
            </select>

            <div className="relative w-48 sm:w-56">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหา..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1 pl-8 pr-2 text-xs outline-hidden dark:border-slate-800 dark:bg-slate-800/60"
              />
            </div>
          </div>
        </div>

        {/* Requirement 7: Exactly the requested Table Schema! */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/70 font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3">Asset (ทรัพย์สิน)</th>
                  <th className="px-4 py-3">Type (ประเภท)</th>
                  <th className="px-4 py-3">Provider (ผู้ให้บริการ)</th>
                  <th className="px-4 py-3">Start (เริ่มต้น)</th>
                  <th className="px-4 py-3">Expiry (หมดอายุ)</th>
                  <th className="px-4 py-3">Status (สถานะ)</th>
                  <th className="px-4 py-3 text-right">เอกสาร & จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      ไม่พบข้อมูลการรับประกันตามเงื่อนไขที่เลือก
                    </td>
                  </tr>
                ) : (
                  filteredList.map((w) => {
                    const asset = assets.find((a) => a.id === w.assetId);
                    const status = getWarrantyStatus(w.endDate, CURRENT_DATE_STR);
                    const days = getDaysDifference(w.endDate, CURRENT_DATE_STR);
                    const doc = documents.find((d) => d.id === w.documentId);

                    return (
                      <tr key={w.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        {/* Asset */}
                        <td className="px-4 py-3">
                          {asset ? (
                            <Link
                              href={`/assets/${asset.id}`}
                              className="font-bold text-slate-900 hover:text-blue-600 dark:text-white"
                            >
                              {asset.name}
                            </Link>
                          ) : (
                            <span className="font-bold text-slate-900 dark:text-white">-</span>
                          )}
                          <div className="text-[11px] text-slate-400">
                            {w.title}
                            {w.policyNumber && ` (${w.policyNumber})`}
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-4 py-3">
                          <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 uppercase">
                            {w.type}
                          </span>
                        </td>

                        {/* Provider */}
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                          <div className="font-medium">{w.provider}</div>
                          {w.contactNumber && (
                            <div className="text-[10px] text-slate-400">โทร: {w.contactNumber}</div>
                          )}
                        </td>

                        {/* Start Date */}
                        <td className="px-4 py-3 text-slate-500">
                          {formatDateThai(w.startDate)}
                        </td>

                        {/* Expiry Date */}
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {formatDateThai(w.endDate)}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {status === 'expired'
                              ? `เลยกำหนด ${Math.abs(days)} วัน`
                              : `เหลืออีก ${days} วัน`}
                          </div>
                        </td>

                        {/* Status (Requirement: Active, Expiring Soon, Expired) */}
                        <td className="px-4 py-3">
                          {status === 'active' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                              <CheckCircle2 className="h-3 w-3" />
                              Active
                            </span>
                          )}
                          {status === 'expiring_soon' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
                              <Clock className="h-3 w-3" />
                              Expiring Soon
                            </span>
                          )}
                          {status === 'expired' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800">
                              <AlertTriangle className="h-3 w-3" />
                              Expired
                            </span>
                          )}
                        </td>

                        {/* Document & Actions */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {doc ? (
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>ดูเอกสาร</span>
                              </a>
                            ) : null}

                            <button
                              type="button"
                              onClick={() => openAddModal(w)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(w.id, w.title)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
            <div className="fixed inset-0" onClick={() => setIsModalOpen(false)} />
            <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 z-10 max-h-[90vh] overflow-y-auto">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4">
                {recordToEdit ? 'แก้ไขประกัน / กรมธรรม์' : 'เพิ่มการรับประกัน / ประกันภัย (Add Policy)'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    ทรัพย์สินที่คุ้มครอง *
                  </label>
                  <select
                    value={assetId}
                    onChange={(e) => setAssetId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    {assets.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      ประเภทความคุ้มครอง
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as WarrantyType)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="warranty">การรับประกันสินค้า (Warranty)</option>
                      <option value="insurance">ประกันภัย / พ.ร.บ. (Insurance)</option>
                      <option value="tax">ภาษีรถยนต์ประจำปี (Tax)</option>
                      <option value="registration">การจดทะเบียน (Registration)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      ชื่อสัญญา / กรมธรรม์ *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="เช่น ประกันภัยรถยนต์ชั้น 1"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      บริษัท / ผู้รับประกัน *
                    </label>
                    <input
                      type="text"
                      required
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                      placeholder="เช่น วิริยะประกันภัย, สยามไดกิ้น"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      เลขที่กรมธรรม์ / เลขรับประกัน
                    </label>
                    <input
                      type="text"
                      value={policyNumber}
                      onChange={(e) => setPolicyNumber(e.target.value)}
                      placeholder="VRY-POL-8812"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      วันที่เริ่มต้น
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      วันที่สิ้นสุด / หมดอายุ *
                    </label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    เบอร์ติดต่อฉุกเฉิน / เคลม
                  </label>
                  <input
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="เช่น 1557"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    รายละเอียดความคุ้มครอง
                  </label>
                  <textarea
                    rows={2}
                    value={coverageDetails}
                    onChange={(e) => setCoverageDetails(e.target.value)}
                    placeholder="เช่น ทุนประกัน 1,100,000 บาท มีรถใช้ระหว่างซ่อม..."
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 px-5 py-2 font-semibold text-white hover:bg-emerald-700"
                  >
                    บันทึกข้อมูล
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default function WarrantyPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">กำลังโหลดข้อมูล...</div>}>
      <WarrantyContent />
    </Suspense>
  );
}

