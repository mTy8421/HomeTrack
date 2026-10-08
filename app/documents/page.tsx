'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import { DocumentRecord } from '@/types';
import {
  FolderOpen,
  Search,
  UploadCloud,
  FileText,
  Eye,
  Download,
  Trash2,
  X,
} from 'lucide-react';
import {
  DOCUMENT_CATEGORIES,
  formatDateThai,
} from '@/lib/constants';
import { DocumentUploadModal } from '@/components/documents/DocumentUploadModal';
import { EmptyState } from '@/components/ui/EmptyState';

export default function DocumentsPage() {
  const { assets, documents, deleteDocument, showToast, confirmModal, isLoading } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAssetId, setSelectedAssetId] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentRecord | null>(null);

  const filteredDocs = documents.filter((d) => {
    if (selectedCategory !== 'all' && d.category !== selectedCategory) return false;
    if (selectedAssetId !== 'all' && d.assetId !== selectedAssetId) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = d.name.toLowerCase().includes(q);
      const matchInvoice = d.invoiceNumber?.toLowerCase().includes(q);
      const matchNotes = d.notes?.toLowerCase().includes(q);
      const asset = assets.find((a) => a.id === d.assetId);
      const matchAsset = asset ? asset.name.toLowerCase().includes(q) : false;
      if (!matchName && !matchInvoice && !matchNotes && !matchAsset) return false;
    }

    return true;
  });

  const handleDelete = (id: string, name: string) => {
    confirmModal({
      title: 'ยืนยันการลบเอกสาร',
      message: `คุณต้องการลบเอกสาร "${name}" ออกจากคลังเอกสารใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`,
      confirmLabel: 'ลบเอกสาร',
      cancelLabel: 'ยกเลิก',
      variant: 'danger',
      onConfirm: () => {
        deleteDocument(id);
        showToast('ลบเอกสารสำเร็จ', `ลบเอกสาร "${name}" เรียบร้อยแล้ว`, 'success');
      },
    });
  };

  const handleDownload = (doc: DocumentRecord) => {
    const link = document.createElement('a');
    link.href = doc.fileUrl;
    link.download = `${doc.name}.${doc.fileType}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl flex items-center gap-2">
              <FolderOpen className="h-6 w-6 text-purple-600" />
              <span>คลังเอกสารสำคัญ (Document Vault)</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              จัดเก็บคู่มือสินค้า ใบเสร็จ ใบรับประกัน กรมธรรม์รถ และเอกสารซ่อมบำรุง
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-purple-700 transition-all active:scale-95"
          >
            <UploadCloud className="h-4 w-4" />
            <span>+ อัปโหลดเอกสารใหม่</span>
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold shrink-0 transition-all ${
              selectedCategory === 'all'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            }`}
          >
            ทั้งหมด ({documents.length})
          </button>
          {DOCUMENT_CATEGORIES.map((cat) => {
            const count = documents.filter((d) => d.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold shrink-0 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                }`}
              >
                <span>{cat.label}</span>
                <span className="opacity-70 text-[10px] ml-1">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อเอกสาร, เลขที่ใบเสร็จ, ทรัพย์สิน..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-1.5 pl-9 pr-3 text-xs outline-hidden focus:border-purple-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400">กรองตามทรัพย์สิน:</span>
            <select
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs outline-hidden dark:border-slate-800 dark:bg-slate-800"
            >
              <option value="all">ทรัพย์สินทั้งหมด</option>
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Documents Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          </div>
        ) : filteredDocs.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="ไม่พบเอกสารในหมวดนี้"
            description={search ? 'ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่น' : 'อัปโหลดคู่มือการใช้งาน ใบเสร็จ หรือใบรับประกันเพื่อค้นหาง่ายขึ้น'}
            actionLabel="อัปโหลดเอกสารใหม่"
            onAction={() => setIsUploadOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDocs.map((doc) => {
              const asset = assets.find((a) => a.id === doc.assetId);
              const catObj = DOCUMENT_CATEGORIES.find((c) => c.id === doc.category);
              const isPdf = doc.fileType?.toLowerCase() === 'pdf' || doc.fileUrl?.startsWith('data:application/pdf');

              return (
                <div
                  key={doc.id}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div>
                    {/* Thumbnail / Preview Area */}
                    <div
                      onClick={() => setPreviewDoc(doc)}
                      className="relative h-36 w-full cursor-pointer overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 mb-3 border border-slate-100 dark:border-slate-800"
                    >
                      {doc.fileUrl ? (
                        isPdf ? (
                          <div className="flex flex-col h-full w-full items-center justify-center bg-rose-50/60 dark:bg-rose-950/20 text-rose-500">
                            <FileText className="h-12 w-12 mb-1" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">PDF Document</span>
                          </div>
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={doc.fileUrl}
                            alt={doc.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        )
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                          <FileText className="h-12 w-12" />
                        </div>
                      )}

                      {/* File type chip */}
                      <div className="absolute top-2 left-2 rounded-lg bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white uppercase backdrop-blur-xs">
                        {doc.fileType}
                      </div>

                      {/* File size */}
                      <div className="absolute top-2 right-2 rounded-lg bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
                        {doc.fileSize}
                      </div>

                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
                        <Eye className="h-4 w-4" />
                        <span>เปิดดูตัวอย่าง</span>
                      </div>
                    </div>

                    {/* Category Label */}
                    <div className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 mb-0.5">
                      {catObj?.label.split(' ')[0]} {catObj?.label.split(' ')[1]}
                    </div>

                    <h3
                      onClick={() => setPreviewDoc(doc)}
                      className="font-bold text-slate-900 dark:text-white text-xs cursor-pointer hover:text-purple-600 line-clamp-2"
                    >
                      {doc.name}
                    </h3>

                    {/* Linked Asset */}
                    {asset && (
                      <Link
                        href={`/assets/${asset.id}`}
                        className="mt-1 inline-block text-[11px] text-blue-600 hover:underline dark:text-blue-400 truncate max-w-full"
                      >
                        ผูกกับ: {asset.name}
                      </Link>
                    )}

                    {doc.invoiceNumber && (
                      <p className="text-[10px] text-slate-500 mt-1">
                        เลขที่: {doc.invoiceNumber}
                      </p>
                    )}

                    {doc.notes && (
                      <p className="text-[11px] text-slate-400 mt-1 italic line-clamp-2">
                        {doc.notes}
                      </p>
                    )}
                  </div>

                  {/* Footer & Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">
                      {formatDateThai(doc.uploadedAt)}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="เปิดดู"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownload(doc)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="ดาวน์โหลด"
                      >
                        <Download className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(doc.id, doc.name)}
                        className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="ลบเอกสาร"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Preview Modal */}
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
            <div className="fixed inset-0" onClick={() => setPreviewDoc(null)} />
            <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 z-10 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="min-w-0 pr-4">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">
                    {previewDoc.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    ขนาด {previewDoc.fileSize} • อัปโหลดเมื่อ {formatDateThai(previewDoc.uploadedAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Preview Content */}
              <div className="mt-4 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 min-h-[300px] flex items-center justify-center">
                {previewDoc.fileType?.toLowerCase() === 'pdf' || previewDoc.fileUrl?.startsWith('data:application/pdf') ? (
                  <iframe
                    src={previewDoc.fileUrl}
                    title={previewDoc.name}
                    className="w-full h-[60vh] border-0 rounded-xl"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewDoc.fileUrl}
                    alt={previewDoc.name}
                    className="max-h-[60vh] w-auto object-contain mx-auto"
                  />
                )}
              </div>

              {previewDoc.notes && (
                <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <span className="font-semibold block mb-0.5">บันทึก:</span>
                  {previewDoc.notes}
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  {previewDoc.invoiceNumber && (
                    <span className="text-xs text-slate-500 font-mono">
                      Invoice: {previewDoc.invoiceNumber}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownload(previewDoc)}
                    className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700"
                  >
                    <Download className="h-4 w-4" />
                    <span>ดาวน์โหลดไฟล์</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </AppLayout>
  );
}
