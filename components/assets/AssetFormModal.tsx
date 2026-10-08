'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Asset } from '@/types';
import { X, Box, Car, Shield } from 'lucide-react';
import { CURRENT_DATE_STR } from '@/lib/constants';

interface AssetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetToEdit?: Asset | null;
}

const PRESET_IMAGES = [
  { label: 'รถยนต์', url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop&q=80' },
  { label: 'แอร์ห้องนั่งเล่น', url: 'https://images.unsplash.com/photo-1614633833026-258055c5dfb5?w=800&auto=format&fit=crop&q=80' },
  { label: 'แอร์ห้องนอน', url: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&auto=format&fit=crop&q=80' },
  { label: 'ตู้เย็น', url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80' },
  { label: 'เครื่องซักผ้า', url: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=80' },
  { label: 'เครื่องทำน้ำอุ่น', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80' },
  { label: 'บ้านเดี่ยว', url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80' },
  { label: 'Smart TV', url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80' },
];

export function AssetFormModal({ isOpen, onClose, assetToEdit }: AssetFormModalProps) {
  if (!isOpen) return null;

  return (
    <AssetFormDialog
      key={assetToEdit ? assetToEdit.id : 'new'}
      onClose={onClose}
      assetToEdit={assetToEdit}
    />
  );
}

function AssetFormDialog({
  onClose,
  assetToEdit,
}: {
  onClose: () => void;
  assetToEdit?: Asset | null;
}) {
  const { categories, addAsset, updateAsset, showToast } = useApp();

  const [categoryId, setCategoryId] = useState(assetToEdit?.categoryId || 'cat-ac');
  const [name, setName] = useState(assetToEdit?.name || '');
  const [brand, setBrand] = useState(assetToEdit?.brand || '');
  const [model, setModel] = useState(assetToEdit?.model || '');
  const [serialNumber, setSerialNumber] = useState(assetToEdit?.serialNumber || '');
  const [purchaseDate, setPurchaseDate] = useState(assetToEdit?.purchaseDate || CURRENT_DATE_STR);
  const [purchasePrice, setPurchasePrice] = useState(String(assetToEdit?.purchasePrice || 0));
  const [location, setLocation] = useState(assetToEdit?.location || '');
  const [vendor, setVendor] = useState(assetToEdit?.vendor || '');
  const [warrantyStart, setWarrantyStart] = useState(assetToEdit?.warrantyStart || (assetToEdit ? '' : CURRENT_DATE_STR));
  const [warrantyEnd, setWarrantyEnd] = useState(assetToEdit?.warrantyEnd || '');
  const [warrantyProvider, setWarrantyProvider] = useState(assetToEdit?.warrantyProvider || '');
  const [insuranceStart, setInsuranceStart] = useState(assetToEdit?.insuranceStart || '');
  const [insuranceEnd, setInsuranceEnd] = useState(assetToEdit?.insuranceEnd || '');
  const [insuranceProvider, setInsuranceProvider] = useState(assetToEdit?.insuranceProvider || '');
  const [notes, setNotes] = useState(assetToEdit?.notes || '');
  const [imageUrl, setImageUrl] = useState(assetToEdit?.imageUrl || PRESET_IMAGES[1].url);

  // Vehicle specific
  const [licensePlate, setLicensePlate] = useState(assetToEdit?.licensePlate || '');
  const [vin, setVin] = useState(assetToEdit?.vin || '');
  const [vehicleYear, setVehicleYear] = useState(String(assetToEdit?.vehicleYear || '2024'));
  const [currentMileage, setCurrentMileage] = useState(String(assetToEdit?.currentMileage || '0'));

  const isVehicle = categoryId === 'cat-car';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('กรุณาระบุชื่อทรัพย์สิน', 'โปรดใส่ชื่อทรัพย์สินก่อนทำการบันทึก', 'warning');
      return;
    }

    const payload = {
      categoryId,
      name: name.trim(),
      brand: brand.trim(),
      model: model.trim(),
      serialNumber: serialNumber.trim() || undefined,
      purchaseDate,
      purchasePrice: parseFloat(purchasePrice) || 0,
      location: location.trim() || 'ไม่ระบุสถานที่',
      vendor: vendor.trim() || undefined,
      warrantyStart: warrantyStart || undefined,
      warrantyEnd: warrantyEnd || undefined,
      warrantyProvider: warrantyProvider.trim() || undefined,
      insuranceStart: insuranceStart || undefined,
      insuranceEnd: insuranceEnd || undefined,
      insuranceProvider: insuranceProvider.trim() || undefined,
      notes: notes.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      isVehicle,
      licensePlate: isVehicle ? licensePlate.trim() || undefined : undefined,
      vin: isVehicle ? vin.trim() || undefined : undefined,
      vehicleYear: isVehicle ? parseInt(vehicleYear) || undefined : undefined,
      currentMileage: isVehicle ? parseInt(currentMileage) || 0 : undefined,
      mileageUpdatedAt: isVehicle ? CURRENT_DATE_STR : undefined,
    };

    if (assetToEdit) {
      updateAsset({
        ...assetToEdit,
        ...payload,
      });
      showToast('แก้ไขข้อมูลสำเร็จ', `อัปเดตข้อมูล "${payload.name}" เรียบร้อยแล้ว`, 'success');
    } else {
      addAsset(payload);
      showToast('เพิ่มทรัพย์สินสำเร็จ', `บันทึกรายการ "${payload.name}" เข้าสู่ระบบแล้ว`, 'success');
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Box className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {assetToEdit ? 'แก้ไขข้อมูลทรัพย์สิน' : 'เพิ่มทรัพย์สินใหม่ (Add Asset)'}
              </h2>
              <p className="text-xs text-slate-500">
                บันทึกบ้าน รถยนต์ และเครื่องใช้ต่าง ๆ เพื่อติดตามการดูแลรักษา
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
          {/* Category & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                หมวดหมู่ทรัพย์สิน *
              </label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  if (e.target.value === 'cat-car' && !imageUrl) {
                    setImageUrl(PRESET_IMAGES[0].url);
                  }
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                ชื่อทรัพย์สิน / รายการ *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น Daikin Inverter ห้องนั่งเล่น, Toyota Camry"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Brand & Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                ยี่ห้อ (Brand)
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="เช่น Daikin, Toyota, Samsung, LG"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                รุ่น (Model)
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="เช่น FTKZ18WV2S, Camry 2.5 HV"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Vehicle Specific Fields */}
          {isVehicle && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 dark:border-blue-900/60 dark:bg-blue-950/30 space-y-3">
              <div className="flex items-center gap-1.5 font-semibold text-blue-700 dark:text-blue-300">
                <Car className="h-4 w-4" />
                <span>ข้อมูลเฉพาะสำหรับรถยนต์ (Vehicle Details)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    ทะเบียนรถ
                  </label>
                  <input
                    type="text"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    placeholder="เช่น 9กข 4567 กทม."
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    เลขไมล์ปัจจุบัน (กม.)
                  </label>
                  <input
                    type="number"
                    value={currentMileage}
                    onChange={(e) => setCurrentMileage(e.target.value)}
                    placeholder="เช่น 48500"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    ปีผลิต (Year)
                  </label>
                  <input
                    type="number"
                    value={vehicleYear}
                    onChange={(e) => setVehicleYear(e.target.value)}
                    placeholder="2024"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  หมายเลขตัวถัง (VIN)
                </label>
                <input
                  type="text"
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  placeholder="เช่น MR0BA3FK8P1239988"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-blue-200/60 dark:border-blue-900/40">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    เริ่มประกันภัยรถยนต์
                  </label>
                  <input
                    type="date"
                    value={insuranceStart}
                    onChange={(e) => setInsuranceStart(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    สิ้นสุดประกันภัยรถยนต์
                  </label>
                  <input
                    type="date"
                    value={insuranceEnd}
                    onChange={(e) => setInsuranceEnd(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    บริษัทประกันภัย
                  </label>
                  <input
                    type="text"
                    value={insuranceProvider}
                    onChange={(e) => setInsuranceProvider(e.target.value)}
                    placeholder="เช่น วิริยะประกันภัย"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Location & Vendor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                สถานที่ติดตั้ง / จัดเก็บ
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="เช่น ห้องนั่งเล่น ชั้น 1, โรงจอดรถ, ห้องครัว"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                ผู้ขาย / ร้านค้าที่ซื้อ
              </label>
              <input
                type="text"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                placeholder="เช่น HomePro พระราม 9, Power Buy"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Purchase Date & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                วันที่ซื้อ
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                ราคาซื้อ (บาท)
              </label>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Warranty Section */}
          <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
              <Shield className="h-4 w-4 text-emerald-600" />
              <span>การรับประกัน (Warranty)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                  เริ่มประกัน
                </label>
                <input
                  type="date"
                  value={warrantyStart}
                  onChange={(e) => setWarrantyStart(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                  หมดประกัน
                </label>
                <input
                  type="date"
                  value={warrantyEnd}
                  onChange={(e) => setWarrantyEnd(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                  ศูนย์ที่รับประกัน
                </label>
                <input
                  type="text"
                  value={warrantyProvider}
                  onChange={(e) => setWarrantyProvider(e.target.value)}
                  placeholder="เช่น สยามไดกิ้น, Toyota Buzz"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Serial Number & Image URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                หมายเลขซีเรียล (Serial Number)
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="เช่น DK-2024-99812-LR"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                URL รูปภาพทรัพย์สิน
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Image Presets Picker */}
          <div>
            <div className="font-medium text-slate-600 dark:text-slate-400 mb-1 text-[11px]">
              เลือกรูปภาพตัวอย่างด่วน:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium border transition-colors ${
                    imageUrl === preset.url
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
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
              placeholder="ข้อควรระวัง รอบการเช็ก หรือรายละเอียดสำคัญ..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-hidden focus:border-blue-500 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Action Buttons */}
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
              {assetToEdit ? 'บันทึกการแก้ไข' : 'บันทึกทรัพย์สิน'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
