'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { DocumentCategory } from '@/types';
import { X, UploadCloud, CheckCircle2 } from 'lucide-react';
import { DOCUMENT_CATEGORIES } from '@/lib/constants';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAssetId?: string;
}

export function DocumentUploadModal({
  isOpen,
  onClose,
  defaultAssetId,
}: DocumentUploadModalProps) {
  const { assets, addDocument, showToast } = useApp();

  const [assetId, setAssetId] = useState(defaultAssetId || (assets[0]?.id || ''));
  const [category, setCategory] = useState<DocumentCategory>('receipt');
  const [name, setName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState<'pdf' | 'jpg' | 'png' | 'webp'>('pdf');
  const [fileSize, setFileSize] = useState('1.2 MB');
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (!name) {
        setName(file.name.replace(/\.[^/.]+$/, ''));
      }
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setFileSize(`${sizeMB} MB`);

      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'pdf') setFileType('pdf');
      else if (ext === 'jpg' || ext === 'jpeg') setFileType('jpg');
      else if (ext === 'png') setFileType('png');
      else if (ext === 'webp') setFileType('webp');

      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFileUrl((uploadEvent.target?.result as string) || '');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('กรุณาระบุชื่อเอกสาร', 'โปรดใส่ชื่อหรือหัวข้อเอกสารก่อนทำการอัปโหลด', 'warning');
      return;
    }

    addDocument({
      assetId: assetId || undefined,
      category,
      name: name.trim(),
      invoiceNumber: invoiceNumber.trim() || undefined,
      notes: notes.trim() || undefined,
      fileType,
      fileSize: fileSize || '800 KB',
      fileUrl:
        fileUrl ||
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    });

    showToast('อัปโหลดเอกสารสำเร็จ', `บันทึกเอกสาร "${name.trim()}" เข้าสู่คลังเรียบร้อยแล้ว`, 'success');

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                อัปโหลดเอกสารเข้าคลัง (Document Vault)
              </h2>
              <p className="text-xs text-slate-500">
                รองรับ PDF, JPG, PNG, WEBP สำหรับคู่มือ ใบเสร็จ และกรมธรรม์
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* File Picker Zone */}
          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-5 text-center dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 transition-colors bg-slate-50/50 dark:bg-slate-800/30">
            <input
              type="file"
              id="file-upload"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer block">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 mb-2">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                {fileName ? `ไฟล์ที่เลือก: ${fileName}` : 'คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                รองรับ PDF, JPG, PNG, WEBP (ขนาดไฟล์ไม่เกิน 25 MB)
              </p>
            </label>
          </div>

          {/* Linked Asset */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              ผูกกับทรัพย์สิน (Linked Asset)
            </label>
            <select
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-purple-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            >
              <option value="">-- เอกสารทั่วไปของบ้าน (ไม่ระบุเฉพาะชิ้น) --</option>
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.brand} - {a.location})
                </option>
              ))}
            </select>
          </div>

          {/* Document Category & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                ประเภทเอกสาร *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-purple-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              >
                {DOCUMENT_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                ชื่อเอกสาร *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น กรมธรรม์วิริยะ 2569, ใบเสร็จซื้อแอร์"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-purple-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Invoice / Reference Number */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              เลขที่ใบเสร็จ / เลขที่กรมธรรม์ (Invoice / Policy #)
            </label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="เช่น INV-2026-991, VRY-AUTO-8991204"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-purple-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              บันทึกช่วยจำ (Notes)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="เช่น ตัวจริงเก็บไว้ที่ตู้เซฟชั้น 2 หรือมีสำเนาในรถ"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-purple-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-purple-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>บันทึกเอกสาร</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
