'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MaintenanceRecord, MaintenanceType, IntervalUnit } from '@/types';
import { X, Wrench, RefreshCw, Gauge } from 'lucide-react';
import { CURRENT_DATE_STR, MAINTENANCE_TYPES } from '@/lib/constants';

interface MaintenanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordToEdit?: MaintenanceRecord | null;
  defaultAssetId?: string;
}

export function MaintenanceFormModal({
  isOpen,
  onClose,
  recordToEdit,
  defaultAssetId,
}: MaintenanceFormModalProps) {
  if (!isOpen) return null;

  return (
    <MaintenanceFormDialog
      key={recordToEdit ? recordToEdit.id : `new-${defaultAssetId || 'default'}`}
      onClose={onClose}
      recordToEdit={recordToEdit}
      defaultAssetId={defaultAssetId}
    />
  );
}

function MaintenanceFormDialog({
  onClose,
  recordToEdit,
  defaultAssetId,
}: {
  onClose: () => void;
  recordToEdit?: MaintenanceRecord | null;
  defaultAssetId?: string;
}) {
  const { assets, addMaintenance, updateMaintenance, showToast } = useApp();

  const [assetId, setAssetId] = useState(
    recordToEdit?.assetId || defaultAssetId || (assets[0]?.id || '')
  );
  const [title, setTitle] = useState(recordToEdit?.title || '');
  const [type, setType] = useState<MaintenanceType>(recordToEdit?.type || 'maintenance');
  const [description, setDescription] = useState(recordToEdit?.description || '');
  const [scheduledDate, setScheduledDate] = useState(recordToEdit?.scheduledDate || CURRENT_DATE_STR);
  const [priority, setPriority] = useState<MaintenanceRecord['priority']>(
    recordToEdit?.priority || 'medium'
  );
  const [cost, setCost] = useState(String(recordToEdit?.cost || 0));
  const [provider, setProvider] = useState(recordToEdit?.provider || '');
  const [notes, setNotes] = useState(recordToEdit?.notes || '');

  // Recurring settings
  const [isRecurring, setIsRecurring] = useState(recordToEdit ? recordToEdit.isRecurring : true);
  const [intervalValue, setIntervalValue] = useState(String(recordToEdit?.intervalValue || 6));
  const [intervalUnit, setIntervalUnit] = useState<IntervalUnit>(
    recordToEdit?.intervalUnit || 'months'
  );
  const [mileageInterval, setMileageInterval] = useState(
    String(recordToEdit?.mileageInterval || 10000)
  );
  const [dualTrigger, setDualTrigger] = useState(Boolean(recordToEdit?.dualTrigger));

  const selectedAsset = assets.find((a) => a.id === assetId);
  const isVehicle = selectedAsset?.isVehicle;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetId) {
      showToast('กรุณาเลือกทรัพย์สิน', 'โปรดระบุทรัพย์สินที่เกี่ยวข้องกับงานบำรุงรักษานี้', 'warning');
      return;
    }
    if (!title.trim()) {
      showToast('กรุณาระบุชื่องาน', 'โปรดใส่ชื่องานบำรุงรักษาก่อนบันทึก', 'warning');
      return;
    }

    const payload = {
      assetId,
      title: title.trim(),
      type,
      description: description.trim() || undefined,
      scheduledDate,
      status: (recordToEdit?.status || 'scheduled') as 'scheduled' | 'in_progress' | 'completed' | 'cancelled',
      priority,
      isRecurring,
      intervalValue: isRecurring ? parseInt(intervalValue) || undefined : undefined,
      intervalUnit: isRecurring ? intervalUnit : undefined,
      mileageInterval: isVehicle && isRecurring ? parseInt(mileageInterval) || undefined : undefined,
      dualTrigger: isVehicle && isRecurring ? dualTrigger : false,
      dueMileage:
        isVehicle && isRecurring && selectedAsset?.currentMileage
          ? selectedAsset.currentMileage + (parseInt(mileageInterval) || 10000)
          : undefined,
      lastMileage: isVehicle ? selectedAsset?.currentMileage : undefined,
      cost: parseFloat(cost) || 0,
      provider: provider.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    if (recordToEdit) {
      updateMaintenance({
        ...recordToEdit,
        ...payload,
      });
      showToast('แก้ไขงานสำเร็จ', `อัปเดตงานบำรุงรักษา "${payload.title}" เรียบร้อยแล้ว`, 'success');
    } else {
      addMaintenance(payload);
      showToast('สร้างงานสำเร็จ', `บันทึกงานบำรุงรักษา "${payload.title}" เรียบร้อยแล้ว`, 'success');
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {recordToEdit ? 'แก้ไขงานบำรุงรักษา' : 'ตั้งรายการบำรุงรักษา (Add Maintenance)'}
              </h2>
              <p className="text-xs text-slate-500">
                กำหนดรอบการเช็ก ล้าง หรือเปลี่ยนอะไหล่เพื่อรับการแจ้งเตือนอัตโนมัติ
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
          {/* Asset Selection */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              ทรัพย์สินที่ต้องการดูแล *
            </label>
            <select
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            >
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.brand} - {a.location})
                </option>
              ))}
            </select>
          </div>

          {/* Title & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                ชื่องานบำรุงรักษา *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="เช่น ล้างแอร์ประจำรอบ, เปลี่ยนน้ำมันเครื่อง 50,000 km"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                ประเภทงาน
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as MaintenanceType)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              >
                {MAINTENANCE_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                วันที่กำหนดทำ (Due Date) *
              </label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                ความสำคัญ (Priority)
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as MaintenanceRecord['priority'])}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              >
                <option value="low">ต่ำ (Low)</option>
                <option value="medium">ปกติ (Medium)</option>
                <option value="high">สูง (High)</option>
                <option value="urgent">เร่งด่วน (Urgent)</option>
              </select>
            </div>
          </div>

          {/* Recurring Interval Block */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-3.5 dark:border-blue-900/60 dark:bg-blue-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded border-blue-400 text-blue-600 focus:ring-blue-500"
                />
                <RefreshCw className="h-4 w-4" />
                <span>งานประจำรอบอัตโนมัติ (Recurring Maintenance)</span>
              </label>
            </div>

            {isRecurring && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 dark:text-slate-400">ทำซ้ำทุก:</span>
                  <input
                    type="number"
                    min="1"
                    value={intervalValue}
                    onChange={(e) => setIntervalValue(e.target.value)}
                    className="w-20 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                  <select
                    value={intervalUnit}
                    onChange={(e) => setIntervalUnit(e.target.value as IntervalUnit)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="days">วัน (Days)</option>
                    <option value="weeks">สัปดาห์ (Weeks)</option>
                    <option value="months">เดือน (Months)</option>
                    <option value="years">ปี (Years)</option>
                  </select>
                </div>

                {/* Vehicle Mileage & Dual Trigger */}
                {isVehicle && (
                  <div className="border-t border-blue-200/80 pt-3 dark:border-blue-900/60 space-y-2">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-blue-900 dark:text-blue-300">
                        เงื่อนไขระยะทางรถยนต์:
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-600 dark:text-slate-400">หรือทุก:</span>
                      <input
                        type="number"
                        step="1000"
                        value={mileageInterval}
                        onChange={(e) => setMileageInterval(e.target.value)}
                        className="w-28 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                      />
                      <span className="text-slate-600 dark:text-slate-400">กิโลเมตร (km)</span>
                    </div>

                    <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={dualTrigger}
                        onChange={(e) => setDualTrigger(e.target.checked)}
                        className="rounded border-blue-400 text-blue-600"
                      />
                      <span className="font-medium">
                        เปิดระบบ Dual Trigger (ระยะเวลา OR ระยะทาง เงื่อนไขใดถึงก่อนให้แจ้งเตือน)
                      </span>
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cost & Provider */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                ประมาณการค่าใช้จ่าย (บาท)
              </label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                ผู้ให้บริการ / ช่าง / ศูนย์บริการ
              </label>
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="เช่น ช่างสมหมาย 081-xxx, ศูนย์ Toyota"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              รายละเอียดงาน / จุดที่ต้องเช็ก
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="เช่น ล้างคอยล์เย็น คอยล์ร้อน เช็กน้ำยาแอร์ R32..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              หมายเหตุเพิ่มเติม
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="หมายเหตุเพิ่มเติม เช่น อะไหล่สำรอง หรือการรับประกันงานซ่อม..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
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
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              {recordToEdit ? 'บันทึกการแก้ไข' : 'สร้างรายการบำรุงรักษา'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
