import {
  Asset,
  MaintenanceRecord,
  WarrantyRecord,
  DocumentRecord,
  ExpenseRecord,
  AppNotification,
  AssetCategory,
  AppSettings,
  User,
  WarrantyStatus,
} from '@/types';
import {
  CURRENT_DATE_STR,
  DEFAULT_CATEGORIES,
  getDaysDifference,
} from './constants';
import {
  DEMO_USER,
  DEMO_SETTINGS,
  DEMO_ASSETS,
  DEMO_MAINTENANCE,
  DEMO_WARRANTIES,
  DEMO_DOCUMENTS,
  DEMO_EXPENSES,
  DEMO_NOTIFICATIONS,
} from './seedData';

// LocalStorage Keys
const PREFIX = 'hometrack_';
const ACTIVE_USER_KEY = 'hometrack_active_user_id';

export function getStorageKey(key: string, userId: string = 'usr-demo-01'): string {
  return `${PREFIX}${userId}_${key}`;
}

export function calculateNextDueDate(
  completedDate: string,
  intervalValue: number,
  intervalUnit: 'days' | 'weeks' | 'months' | 'years'
): string {
  const [year, month, day] = completedDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  switch (intervalUnit) {
    case 'days':
      date.setDate(date.getDate() + intervalValue);
      break;
    case 'weeks':
      date.setDate(date.getDate() + intervalValue * 7);
      break;
    case 'months':
      date.setMonth(date.getMonth() + intervalValue);
      break;
    case 'years':
      date.setFullYear(date.getFullYear() + intervalValue);
      break;
  }

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getWarrantyStatus(endDate: string, baseDate = CURRENT_DATE_STR): WarrantyStatus {
  if (!endDate) return 'active';
  const diff = getDaysDifference(endDate, baseDate);
  if (diff < 0) return 'expired';
  if (diff <= 30) return 'expiring_soon';
  return 'active';
}

export function getMaintenanceStatus(
  record: MaintenanceRecord,
  baseDate = CURRENT_DATE_STR
): 'completed' | 'overdue' | 'due_today' | 'due_soon' | 'normal' {
  if (record.status === 'completed') return 'completed';
  const diff = getDaysDifference(record.scheduledDate, baseDate);
  if (diff < 0) return 'overdue';
  if (diff === 0) return 'due_today';
  if (diff <= 14) return 'due_soon';
  return 'normal';
}

export function checkVehicleDualTrigger(
  record: MaintenanceRecord,
  asset: Asset,
  baseDate = CURRENT_DATE_STR
): {
  isTriggered: boolean;
  reason: 'time' | 'mileage' | 'both' | 'none';
  remainingDays: number;
  remainingKm?: number;
} {
  const remainingDays = getDaysDifference(record.scheduledDate, baseDate);
  let remainingKm: number | undefined = undefined;

  if (record.dueMileage && asset.currentMileage) {
    remainingKm = record.dueMileage - asset.currentMileage;
  }

  const timeTriggered = remainingDays <= 7;
  const mileageTriggered = remainingKm !== undefined && remainingKm <= 500;

  let reason: 'time' | 'mileage' | 'both' | 'none' = 'none';
  if (timeTriggered && mileageTriggered) reason = 'both';
  else if (timeTriggered) reason = 'time';
  else if (mileageTriggered) reason = 'mileage';

  return {
    isTriggered: timeTriggered || mileageTriggered,
    reason,
    remainingDays,
    remainingKm,
  };
}

export class AppStorage {
  private userId: string;

  constructor(userId?: string) {
    if (userId) {
      this.userId = userId;
    } else if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem(ACTIVE_USER_KEY);
        this.userId = storedUser || DEMO_USER.id;
      } catch {
        this.userId = DEMO_USER.id;
      }
    } else {
      this.userId = DEMO_USER.id;
    }
  }

  private getItem<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const stored = localStorage.getItem(getStorageKey(key, this.userId));
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(getStorageKey(key, this.userId), JSON.stringify(value));
    } catch (e) {
      console.error('Storage write error', e);
    }
  }

  // Initialize data if fresh
  public initIfEmpty(): void {
    if (typeof window === 'undefined') return;
    const isInitialized = localStorage.getItem(getStorageKey('initialized', this.userId));
    if (!isInitialized) {
      this.resetToDemoData();
    }
  }

  public resetToDemoData(): void {
    if (typeof window === 'undefined') return;
    this.setItem('categories', DEFAULT_CATEGORIES);
    this.setItem('assets', DEMO_ASSETS);
    this.setItem('maintenance', DEMO_MAINTENANCE);
    this.setItem('warranties', DEMO_WARRANTIES);
    this.setItem('documents', DEMO_DOCUMENTS);
    this.setItem('expenses', DEMO_EXPENSES);
    this.setItem('notifications', DEMO_NOTIFICATIONS);
    this.setItem('settings', DEMO_SETTINGS);
    this.setItem('user', DEMO_USER);
    this.setItem('initialized', true);
  }

  // Users & Auth
  public getCurrentUser(): User {
    return this.getItem<User>('user', DEMO_USER);
  }

  public setCurrentUser(user: User): void {
    this.userId = user.id;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(ACTIVE_USER_KEY, user.id);
      } catch (e) {
        console.error('Storage write error', e);
      }
    }
    this.setItem('user', user);
  }

  // Settings
  public getSettings(): AppSettings {
    const s = this.getItem<AppSettings>('settings', DEMO_SETTINGS);
    return {
      ...DEMO_SETTINGS,
      ...s,
      theme: s.theme || 'light',
    };
  }

  public saveSettings(settings: AppSettings): void {
    this.setItem('settings', settings);
  }

  // Categories
  public getCategories(): AssetCategory[] {
    return this.getItem<AssetCategory[]>('categories', DEFAULT_CATEGORIES);
  }

  public saveCategories(categories: AssetCategory[]): void {
    this.setItem('categories', categories);
  }

  // Assets
  public getAssets(): Asset[] {
    return this.getItem<Asset[]>('assets', DEMO_ASSETS);
  }

  public getAssetById(id: string): Asset | undefined {
    return this.getAssets().find((a) => a.id === id);
  }

  public saveAsset(asset: Asset): void {
    const list = this.getAssets();
    const index = list.findIndex((a) => a.id === asset.id);
    if (index >= 0) {
      list[index] = { ...asset, updatedAt: new Date().toISOString() };
    } else {
      list.unshift(asset);
    }
    this.setItem('assets', list);
  }

  public deleteAsset(id: string): void {
    const list = this.getAssets().filter((a) => a.id !== id);
    this.setItem('assets', list);
    // Cascade cleanup
    const maint = this.getMaintenance().filter((m) => m.assetId !== id);
    this.setItem('maintenance', maint);
    const exp = this.getExpenses().filter((e) => e.assetId !== id);
    this.setItem('expenses', exp);
    const war = this.getWarranties().filter((w) => w.assetId !== id);
    this.setItem('warranties', war);
  }

  // Maintenance
  public getMaintenance(): MaintenanceRecord[] {
    return this.getItem<MaintenanceRecord[]>('maintenance', DEMO_MAINTENANCE);
  }

  public saveMaintenance(record: MaintenanceRecord): void {
    const list = this.getMaintenance();
    const index = list.findIndex((m) => m.id === record.id);
    if (index >= 0) {
      list[index] = record;
    } else {
      list.unshift(record);
    }
    this.setItem('maintenance', list);
  }

  public completeMaintenance(
    id: string,
    completedData: {
      completedDate: string;
      cost: number;
      provider?: string;
      mileage?: number;
      partsReplaced?: string[];
      notes?: string;
      receiptDocumentId?: string;
    }
  ): { nextRecord?: MaintenanceRecord; completedRecord: MaintenanceRecord } {
    const list = this.getMaintenance();
    const target = list.find((m) => m.id === id);
    if (!target) throw new Error('Maintenance record not found');

    // Update target as completed
    target.status = 'completed';
    target.completedDate = completedData.completedDate;
    target.cost = completedData.cost;
    target.provider = completedData.provider || target.provider;
    target.mileage = completedData.mileage;
    target.partsReplaced = completedData.partsReplaced || target.partsReplaced;
    target.notes = completedData.notes ? `${target.notes ? target.notes + '\n' : ''}${completedData.notes}` : target.notes;
    target.receiptDocumentId = completedData.receiptDocumentId || target.receiptDocumentId;

    let nextRecord: MaintenanceRecord | undefined = undefined;

    // Check if recurring -> generate next schedule
    if (target.isRecurring && target.intervalValue && target.intervalUnit) {
      const nextDue = calculateNextDueDate(
        completedData.completedDate,
        target.intervalValue,
        target.intervalUnit
      );
      target.nextDueDate = nextDue;

      let nextDueMileage: number | undefined = undefined;
      if (target.mileageInterval && completedData.mileage) {
        nextDueMileage = completedData.mileage + target.mileageInterval;
      }

      nextRecord = {
        id: `maint-${Date.now()}`,
        userId: target.userId,
        assetId: target.assetId,
        title: target.title,
        type: target.type,
        description: target.description,
        scheduledDate: nextDue,
        status: 'scheduled',
        priority: target.priority,
        isRecurring: true,
        intervalValue: target.intervalValue,
        intervalUnit: target.intervalUnit,
        mileageInterval: target.mileageInterval,
        dualTrigger: target.dualTrigger,
        lastMileage: completedData.mileage,
        dueMileage: nextDueMileage,
        cost: target.cost,
        provider: target.provider,
        partsReplaced: [],
        notes: `สร้างอัตโนมัติตามรอบหลังรอบวันที่ ${completedData.completedDate}`,
        createdAt: new Date().toISOString(),
      };
      list.unshift(nextRecord);
    }

    this.setItem('maintenance', list);

    // If cost > 0, automatically log an expense record
    if (completedData.cost > 0) {
      const expense: ExpenseRecord = {
        id: `exp-${Date.now()}`,
        userId: target.userId,
        assetId: target.assetId,
        category: target.type === 'repair' ? 'repair' : 'maintenance',
        amount: completedData.cost,
        date: completedData.completedDate,
        description: target.title,
        provider: completedData.provider || target.provider,
        receiptDocumentId: completedData.receiptDocumentId,
        maintenanceRecordId: target.id,
        createdAt: new Date().toISOString(),
      };
      this.saveExpense(expense);
    }

    // Update vehicle mileage if provided
    if (completedData.mileage) {
      const asset = this.getAssetById(target.assetId);
      if (asset && asset.isVehicle && (!asset.currentMileage || completedData.mileage > asset.currentMileage)) {
        this.saveAsset({
          ...asset,
          currentMileage: completedData.mileage,
          mileageUpdatedAt: completedData.completedDate,
        });
      }
    }

    return { completedRecord: target, nextRecord };
  }

  public deleteMaintenance(id: string): void {
    const list = this.getMaintenance().filter((m) => m.id !== id);
    this.setItem('maintenance', list);
  }

  // Warranties
  public getWarranties(): WarrantyRecord[] {
    return this.getItem<WarrantyRecord[]>('warranties', DEMO_WARRANTIES);
  }

  public saveWarranty(record: WarrantyRecord): void {
    const list = this.getWarranties();
    const index = list.findIndex((w) => w.id === record.id);
    if (index >= 0) {
      list[index] = record;
    } else {
      list.unshift(record);
    }
    this.setItem('warranties', list);
  }

  public deleteWarranty(id: string): void {
    const list = this.getWarranties().filter((w) => w.id !== id);
    this.setItem('warranties', list);
  }

  // Documents
  public getDocuments(): DocumentRecord[] {
    return this.getItem<DocumentRecord[]>('documents', DEMO_DOCUMENTS);
  }

  public saveDocument(record: DocumentRecord): void {
    const list = this.getDocuments();
    const index = list.findIndex((d) => d.id === record.id);
    if (index >= 0) {
      list[index] = record;
    } else {
      list.unshift(record);
    }
    this.setItem('documents', list);
  }

  public deleteDocument(id: string): void {
    const list = this.getDocuments().filter((d) => d.id !== id);
    this.setItem('documents', list);
  }

  // Expenses
  public getExpenses(): ExpenseRecord[] {
    return this.getItem<ExpenseRecord[]>('expenses', DEMO_EXPENSES);
  }

  public saveExpense(record: ExpenseRecord): void {
    const list = this.getExpenses();
    const index = list.findIndex((e) => e.id === record.id);
    if (index >= 0) {
      list[index] = record;
    } else {
      list.unshift(record);
    }
    this.setItem('expenses', list);
  }

  public deleteExpense(id: string): void {
    const list = this.getExpenses().filter((e) => e.id !== id);
    this.setItem('expenses', list);
  }

  // Notifications
  public getNotifications(): AppNotification[] {
    return this.getItem<AppNotification[]>('notifications', DEMO_NOTIFICATIONS);
  }

  public markNotificationAsRead(id: string): void {
    const list = this.getNotifications();
    const target = list.find((n) => n.id === id);
    if (target) {
      target.isRead = true;
      this.setItem('notifications', list);
    }
  }

  public markAllNotificationsAsRead(): void {
    const list = this.getNotifications().map((n) => ({ ...n, isRead: true }));
    this.setItem('notifications', list);
  }

  public deleteNotification(id: string): void {
    const list = this.getNotifications().filter((n) => n.id !== id);
    this.setItem('notifications', list);
  }

  // Full Export and Import
  public exportAllData(): string {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user: this.getCurrentUser(),
      settings: this.getSettings(),
      categories: this.getCategories(),
      assets: this.getAssets(),
      maintenance: this.getMaintenance(),
      warranties: this.getWarranties(),
      documents: this.getDocuments(),
      expenses: this.getExpenses(),
      notifications: this.getNotifications(),
    };
    return JSON.stringify(data, null, 2);
  }

  public importAllData(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.user) this.setCurrentUser(data.user);
      if (data.assets) this.setItem('assets', data.assets);
      if (data.maintenance) this.setItem('maintenance', data.maintenance);
      if (data.warranties) this.setItem('warranties', data.warranties);
      if (data.documents) this.setItem('documents', data.documents);
      if (data.expenses) this.setItem('expenses', data.expenses);
      if (data.notifications) this.setItem('notifications', data.notifications);
      if (data.categories) this.setItem('categories', data.categories);
      if (data.settings) this.setItem('settings', data.settings);
      this.setItem('initialized', true);
      return true;
    } catch (e) {
      console.error('Failed to import data', e);
      return false;
    }
  }
}
