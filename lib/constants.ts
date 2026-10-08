import { AssetCategory, DocumentCategory, MaintenanceType, ExpenseCategory } from '@/types';

export const CURRENT_DATE_STR = '2026-10-06';

export const DEFAULT_CATEGORIES: AssetCategory[] = [
  { id: 'cat-home', name: 'บ้าน / ที่อยู่อาศัย', nameEn: 'House & Property', icon: 'Home' },
  { id: 'cat-car', name: 'รถยนต์ / ยานพาหนะ', nameEn: 'Vehicles', icon: 'Car' },
  { id: 'cat-ac', name: 'เครื่องปรับอากาศ', nameEn: 'Air Conditioner', icon: 'Wind' },
  { id: 'cat-fridge', name: 'ตู้เย็น', nameEn: 'Refrigerator', icon: 'Refrigerator' },
  { id: 'cat-washer', name: 'เครื่องซักผ้า / อบผ้า', nameEn: 'Washing Machine', icon: 'WashingMachine' },
  { id: 'cat-water-heater', name: 'เครื่องทำน้ำอุ่น', nameEn: 'Water Heater', icon: 'Flame' },
  { id: 'cat-tv', name: 'TV & เครื่องเสียง', nameEn: 'TV & Audio', icon: 'Tv' },
  { id: 'cat-computer', name: 'Computer / Laptop', nameEn: 'Computer & IT', icon: 'Laptop' },
  { id: 'cat-appliance', name: 'เครื่องใช้ไฟฟ้า', nameEn: 'Home Appliances', icon: 'Zap' },
  { id: 'cat-other', name: 'อื่น ๆ', nameEn: 'Others', icon: 'Wrench' },
];

export const DOCUMENT_CATEGORIES: { id: DocumentCategory; label: string; icon: string }[] = [
  { id: 'manual', label: '📄 คู่มือสินค้า (Manual)', icon: 'BookOpen' },
  { id: 'receipt', label: '🧾 ใบเสร็จ / ใบกำกับภาษี', icon: 'Receipt' },
  { id: 'warranty_card', label: '🛡️ ใบรับประกัน (Warranty)', icon: 'ShieldCheck' },
  { id: 'insurance_policy', label: '🚗 กรมธรรม์ประกันภัย', icon: 'FileText' },
  { id: 'inspection_sheet', label: '📋 ใบตรวจเช็ก / รายงานสภาพ', icon: 'ClipboardCheck' },
  { id: 'repair_invoice', label: '🔧 ใบเสร็จค่าซ่อม / อะไหล่', icon: 'Wrench' },
  { id: 'vehicle_doc', label: '📑 เล่มทะเบียน / ภาษีรถ', icon: 'Car' },
  { id: 'other', label: '📁 เอกสารอื่น ๆ', icon: 'File' },
];

export const MAINTENANCE_TYPES: { id: MaintenanceType; label: string }[] = [
  { id: 'maintenance', label: 'บำรุงรักษาตามรอบ (Maintenance)' },
  { id: 'cleaning', label: 'ทำความสะอาด / ล้าง (Cleaning)' },
  { id: 'inspection', label: 'ตรวจเช็กสภาพ (Inspection)' },
  { id: 'oil_change', label: 'เปลี่ยนถ่ายของเหลว / น้ำมันเครื่อง' },
  { id: 'repair', label: 'ซ่อมแซม / แก้ไขปัญหา (Repair)' },
  { id: 'tire', label: 'สลับยาง / เปลี่ยนยาง (Tires)' },
  { id: 'battery', label: 'แบตเตอรี่ (Battery)' },
  { id: 'tax', label: 'ต่อภาษี / ทะเบียนรถ (Tax)' },
  { id: 'insurance', label: 'ต่อประกันภัย (Insurance)' },
  { id: 'other', label: 'งานอื่น ๆ (Other)' },
];

export const EXPENSE_CATEGORIES: { id: ExpenseCategory; label: string; color: string }[] = [
  { id: 'maintenance', label: 'บำรุงรักษาตามรอบ', color: '#0099E5' }, // Core Brand Blue
  { id: 'repair', label: 'งานซ่อมแซม', color: '#FF4C4C' }, // Core Brand Danger Red
  { id: 'fuel', label: 'น้ำมัน / เชื้อเพลิง', color: '#34BF49' }, // Core Brand Success Green
  { id: 'parts', label: 'อะไหล่ / อุปกรณ์', color: '#F59E0B' }, // Warning Amber
  { id: 'insurance', label: 'ประกันภัย', color: '#8B5CF6' }, // Purple
  { id: 'tax', label: 'ภาษี / พ.ร.บ.', color: '#6366F1' }, // Indigo
  { id: 'cleaning', label: 'ทำความสะอาด', color: '#06B6D4' }, // Cyan
  { id: 'other', label: 'ค่าใช้จ่ายอื่น ๆ', color: '#64748B' }, // Slate
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateThai(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return dateStr;
    const monthsThai = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    return `${day} ${monthsThai[month - 1]} ${year + 543}`;
  } catch {
    return dateStr;
  }
}

export function formatDateEn(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return dateStr;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function getDaysDifference(targetDate: string, baseDate = CURRENT_DATE_STR): number {
  if (!targetDate) return 0;
  const d1 = new Date(targetDate).getTime();
  const d2 = new Date(baseDate).getTime();
  const diffTime = d1 - d2;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
