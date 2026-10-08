export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
};

export type AssetCategory = {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  isCustom?: boolean;
};

export type Asset = {
  id: string;
  userId: string;
  categoryId: string;
  name: string;
  brand: string;
  model: string;
  serialNumber?: string;
  purchaseDate: string; // YYYY-MM-DD
  purchasePrice: number;
  location: string;
  vendor?: string;
  installationDate?: string;
  warrantyStart?: string;
  warrantyEnd?: string;
  warrantyProvider?: string;
  insuranceStart?: string;
  insuranceEnd?: string;
  insuranceProvider?: string;
  notes?: string;
  imageUrl?: string;
  // Vehicle specific fields
  isVehicle?: boolean;
  licensePlate?: string;
  vin?: string;
  vehicleYear?: number;
  currentMileage?: number;
  mileageUpdatedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type MaintenanceType =
  | 'maintenance'
  | 'repair'
  | 'inspection'
  | 'cleaning'
  | 'oil_change'
  | 'tire'
  | 'battery'
  | 'tax'
  | 'insurance'
  | 'other';

export type IntervalUnit = 'days' | 'weeks' | 'months' | 'years';

export type MaintenanceRecord = {
  id: string;
  userId: string;
  assetId: string;
  title: string;
  type: MaintenanceType;
  description?: string;
  scheduledDate: string; // YYYY-MM-DD
  completedDate?: string; // YYYY-MM-DD
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  // Recurring
  isRecurring: boolean;
  intervalValue?: number;
  intervalUnit?: IntervalUnit;
  // Vehicle dual-trigger
  mileageInterval?: number; // e.g. 10000 km
  dualTrigger?: boolean; // Time OR Mileage whichever first
  lastMileage?: number;
  dueMileage?: number;
  // Details
  cost: number;
  provider?: string;
  mileage?: number;
  partsReplaced?: string[];
  notes?: string;
  receiptDocumentId?: string;
  imageUrl?: string;
  nextDueDate?: string;
  createdAt: string;
};

export type WarrantyType = 'warranty' | 'insurance' | 'tax' | 'registration';

export type WarrantyStatus = 'active' | 'expiring_soon' | 'expired';

export type WarrantyRecord = {
  id: string;
  userId: string;
  assetId: string;
  type: WarrantyType;
  title: string;
  provider: string;
  policyNumber?: string;
  startDate: string;
  endDate: string;
  cost?: number;
  coverageDetails?: string;
  contactNumber?: string;
  notes?: string;
  documentId?: string;
  createdAt: string;
};

export type DocumentCategory =
  | 'manual'
  | 'receipt'
  | 'warranty_card'
  | 'insurance_policy'
  | 'inspection_sheet'
  | 'repair_invoice'
  | 'vehicle_doc'
  | 'other';

export type DocumentRecord = {
  id: string;
  userId: string;
  assetId?: string;
  name: string;
  category: DocumentCategory;
  fileType: 'pdf' | 'jpg' | 'png' | 'webp';
  fileSize: string;
  fileUrl: string; // Data URL or URL
  invoiceNumber?: string;
  notes?: string;
  uploadedAt: string;
};

export type ExpenseCategory =
  | 'maintenance'
  | 'repair'
  | 'insurance'
  | 'tax'
  | 'parts'
  | 'fuel'
  | 'cleaning'
  | 'other';

export type ExpenseRecord = {
  id: string;
  userId: string;
  assetId: string;
  category: ExpenseCategory;
  amount: number;
  date: string; // YYYY-MM-DD
  description: string;
  provider?: string;
  receiptDocumentId?: string;
  maintenanceRecordId?: string;
  createdAt: string;
};

export type NotificationType =
  | 'maintenance'
  | 'warranty'
  | 'insurance'
  | 'tax'
  | 'vehicle_registration'
  | 'mileage'
  | 'document_expiry';

export type NotificationStatus = 'upcoming' | 'due_today' | 'overdue' | 'completed';

export type AppNotification = {
  id: string;
  userId: string;
  assetId?: string;
  type: NotificationType;
  title: string;
  message: string;
  dueDate: string;
  status: NotificationStatus;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
};

export type AppSettings = {
  userId: string;
  householdName: string;
  currency: string;
  reminderDays: number[];
  language: 'th' | 'en';
  theme?: 'light' | 'dark';
};

export type GlobalSearchResult = {
  id: string;
  type: 'asset' | 'maintenance' | 'document' | 'expense' | 'warranty';
  title: string;
  subtitle: string;
  date?: string;
  amount?: number;
  url: string;
  badge?: string;
};
