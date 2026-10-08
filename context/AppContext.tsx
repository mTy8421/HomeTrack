'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
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
  GlobalSearchResult,
} from '@/types';
import { AppStorage, getMaintenanceStatus, getWarrantyStatus } from '@/lib/storage';
import { CURRENT_DATE_STR } from '@/lib/constants';
import { ToastMessage, ToastType } from '@/components/ui/Toast';

export type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void;
};

type AppContextType = {
  user: User;
  setUser: (u: User) => void;
  assets: Asset[];
  maintenance: MaintenanceRecord[];
  warranties: WarrantyRecord[];
  documents: DocumentRecord[];
  expenses: ExpenseRecord[];
  notifications: AppNotification[];
  categories: AssetCategory[];
  settings: AppSettings;
  isLoading: boolean;

  // Stats
  stats: {
    totalAssets: number;
    dueSoonCount: number;
    overdueCount: number;
    expiringWarrantyCount: number;
    expiringInsuranceCount: number;
    monthExpense: number;
    yearExpense: number;
    unreadNotificationsCount: number;
  };

  // Actions
  addAsset: (asset: Omit<Asset, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Asset;
  updateAsset: (asset: Asset) => void;
  deleteAsset: (id: string) => void;

  addMaintenance: (
    record: Omit<MaintenanceRecord, 'id' | 'userId' | 'createdAt'>
  ) => MaintenanceRecord;
  updateMaintenance: (record: MaintenanceRecord) => void;
  completeMaintenance: (
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
  ) => void;
  deleteMaintenance: (id: string) => void;

  addWarranty: (record: Omit<WarrantyRecord, 'id' | 'userId' | 'createdAt'>) => WarrantyRecord;
  updateWarranty: (record: WarrantyRecord) => void;
  deleteWarranty: (id: string) => void;

  addDocument: (doc: Omit<DocumentRecord, 'id' | 'userId' | 'uploadedAt'>) => DocumentRecord;
  deleteDocument: (id: string) => void;

  addExpense: (expense: Omit<ExpenseRecord, 'id' | 'userId' | 'createdAt'>) => ExpenseRecord;
  deleteExpense: (id: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;

  addCategory: (name: string, icon: string) => void;
  deleteCategory: (id: string) => void;

  updateSettings: (newSettings: Partial<AppSettings>) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  resetToDemo: () => void;
  exportDataJson: () => string;
  importDataJson: (json: string) => boolean;

  // UI state
  isQuickActionOpen: boolean;
  setIsQuickActionOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchResults: GlobalSearchResult[];

  // Feedback & Dialogs
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
  confirmConfig: {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'primary';
    onConfirm: () => void;
  };
  confirmModal: (options: ConfirmOptions) => void;
  closeConfirmModal: () => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [storage] = useState(() => new AppStorage());
  const [user, setUserState] = useState<User>(() => storage.getCurrentUser());
  const [assets, setAssets] = useState<Asset[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
  const [warranties, setWarranties] = useState<WarrantyRecord[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [settings, setSettings] = useState<AppSettings>(() => storage.getSettings());
  const [isLoading, setIsLoading] = useState(true);

  // UI Modals
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Toast notifications & Confirmation dialog
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'primary';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showToast = useCallback((title: string, message?: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newToast: ToastMessage = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const confirmModal = useCallback(
    (options: ConfirmOptions) => {
      setConfirmConfig({
        isOpen: true,
        title: options.title,
        message: options.message,
        confirmLabel: options.confirmLabel,
        cancelLabel: options.cancelLabel,
        variant: options.variant || 'danger',
        onConfirm: options.onConfirm,
      });
    },
    []
  );

  const closeConfirmModal = useCallback(() => {
    setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Reload all state from storage
  const reloadAll = useCallback(() => {
    storage.initIfEmpty();
    setAssets(storage.getAssets());
    setMaintenance(storage.getMaintenance());
    setWarranties(storage.getWarranties());
    setDocuments(storage.getDocuments());
    setExpenses(storage.getExpenses());
    setNotifications(storage.getNotifications());
    setCategories(storage.getCategories());
    setSettings(storage.getSettings());
  }, [storage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      reloadAll();
      setIsLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [reloadAll]);

  const setUser = (u: User) => {
    storage.setCurrentUser(u);
    setUserState(u);
    reloadAll();
  };

  // Keyboard shortcut Cmd+K / Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Stats calculation
  const stats = useMemo(() => {
    const totalAssets = assets.length;

    let dueSoonCount = 0;
    let overdueCount = 0;
    maintenance.forEach((m) => {
      const status = getMaintenanceStatus(m, CURRENT_DATE_STR);
      if (status === 'overdue') overdueCount++;
      else if (status === 'due_soon' || status === 'due_today') dueSoonCount++;
    });

    let expiringWarrantyCount = 0;
    let expiringInsuranceCount = 0;
    warranties.forEach((w) => {
      const status = getWarrantyStatus(w.endDate, CURRENT_DATE_STR);
      if (status === 'expiring_soon') {
        if (w.type === 'insurance' || w.type === 'tax') expiringInsuranceCount++;
        else expiringWarrantyCount++;
      }
    });

    const [curYear, curMonth] = CURRENT_DATE_STR.split('-').map(Number);
    let monthExpense = 0;
    let yearExpense = 0;

    expenses.forEach((e) => {
      const [y, m] = e.date.split('-').map(Number);
      if (y === curYear) {
        yearExpense += e.amount;
        if (m === curMonth) {
          monthExpense += e.amount;
        }
      }
    });

    const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

    return {
      totalAssets,
      dueSoonCount,
      overdueCount,
      expiringWarrantyCount,
      expiringInsuranceCount,
      monthExpense,
      yearExpense,
      unreadNotificationsCount,
    };
  }, [assets, maintenance, warranties, expenses, notifications]);

  // Global search results
  const searchResults = useMemo<GlobalSearchResult[]>(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const results: GlobalSearchResult[] = [];

    // Search Assets
    assets.forEach((a) => {
      if (
        a.name.toLowerCase().includes(q) ||
        a.brand.toLowerCase().includes(q) ||
        a.model.toLowerCase().includes(q) ||
        (a.serialNumber && a.serialNumber.toLowerCase().includes(q)) ||
        a.location.toLowerCase().includes(q)
      ) {
        results.push({
          id: a.id,
          type: 'asset',
          title: a.name,
          subtitle: `${a.brand} ${a.model} • ${a.location}`,
          badge: 'ทรัพย์สิน',
          url: `/assets/${a.id}`,
        });
      }
    });

    // Search Maintenance
    maintenance.forEach((m) => {
      const asset = assets.find((a) => a.id === m.assetId);
      if (
        m.title.toLowerCase().includes(q) ||
        (m.provider && m.provider.toLowerCase().includes(q)) ||
        (m.description && m.description.toLowerCase().includes(q)) ||
        m.partsReplaced?.some((p) => p.toLowerCase().includes(q))
      ) {
        results.push({
          id: m.id,
          type: 'maintenance',
          title: m.title,
          subtitle: `${asset ? asset.name + ' • ' : ''}กำหนด: ${m.scheduledDate}`,
          badge: m.status === 'completed' ? 'เสร็จสิ้น' : 'รอทำ',
          amount: m.cost,
          date: m.scheduledDate,
          url: asset ? `/assets/${asset.id}?tab=maintenance` : '/maintenance',
        });
      }
    });

    // Search Documents
    documents.forEach((d) => {
      const asset = assets.find((a) => a.id === d.assetId);
      if (
        d.name.toLowerCase().includes(q) ||
        (d.invoiceNumber && d.invoiceNumber.toLowerCase().includes(q)) ||
        (d.notes && d.notes.toLowerCase().includes(q))
      ) {
        results.push({
          id: d.id,
          type: 'document',
          title: d.name,
          subtitle: `${asset ? asset.name + ' • ' : ''}ขนาด ${d.fileSize}`,
          badge: d.category.toUpperCase(),
          url: '/documents',
        });
      }
    });

    // Search Expenses
    expenses.forEach((e) => {
      const asset = assets.find((a) => a.id === e.assetId);
      if (
        e.description.toLowerCase().includes(q) ||
        (e.provider && e.provider.toLowerCase().includes(q)) ||
        e.category.toLowerCase().includes(q)
      ) {
        results.push({
          id: e.id,
          type: 'expense',
          title: e.description,
          subtitle: `${asset ? asset.name + ' • ' : ''}วันที่ ${e.date}`,
          amount: e.amount,
          date: e.date,
          badge: 'ค่าใช้จ่าย',
          url: '/expenses',
        });
      }
    });

    return results;
  }, [searchQuery, assets, maintenance, documents, expenses]);

  // Asset actions
  const addAsset = (data: Omit<Asset, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const newAsset: Asset = {
      ...data,
      id: `asset-${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    storage.saveAsset(newAsset);
    reloadAll();
    return newAsset;
  };

  const updateAsset = (asset: Asset) => {
    storage.saveAsset(asset);
    reloadAll();
  };

  const deleteAsset = (id: string) => {
    storage.deleteAsset(id);
    reloadAll();
  };

  // Maintenance actions
  const addMaintenance = (
    data: Omit<MaintenanceRecord, 'id' | 'userId' | 'createdAt'>
  ) => {
    const newRecord: MaintenanceRecord = {
      ...data,
      id: `maint-${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };
    storage.saveMaintenance(newRecord);
    reloadAll();
    return newRecord;
  };

  const updateMaintenance = (record: MaintenanceRecord) => {
    storage.saveMaintenance(record);
    reloadAll();
  };

  const completeMaintenance = (
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
  ) => {
    storage.completeMaintenance(id, completedData);
    reloadAll();
  };

  const deleteMaintenance = (id: string) => {
    storage.deleteMaintenance(id);
    reloadAll();
  };

  // Warranty actions
  const addWarranty = (data: Omit<WarrantyRecord, 'id' | 'userId' | 'createdAt'>) => {
    const newRecord: WarrantyRecord = {
      ...data,
      id: `war-${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };
    storage.saveWarranty(newRecord);
    reloadAll();
    return newRecord;
  };

  const updateWarranty = (record: WarrantyRecord) => {
    storage.saveWarranty(record);
    reloadAll();
  };

  const deleteWarranty = (id: string) => {
    storage.deleteWarranty(id);
    reloadAll();
  };

  // Documents
  const addDocument = (data: Omit<DocumentRecord, 'id' | 'userId' | 'uploadedAt'>) => {
    const newDoc: DocumentRecord = {
      ...data,
      id: `doc-${Date.now()}`,
      userId: user.id,
      uploadedAt: new Date().toISOString(),
    };
    storage.saveDocument(newDoc);
    reloadAll();
    return newDoc;
  };

  const deleteDocument = (id: string) => {
    storage.deleteDocument(id);
    reloadAll();
  };

  // Expenses
  const addExpense = (data: Omit<ExpenseRecord, 'id' | 'userId' | 'createdAt'>) => {
    const newExpense: ExpenseRecord = {
      ...data,
      id: `exp-${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };
    storage.saveExpense(newExpense);
    reloadAll();
    return newExpense;
  };

  const deleteExpense = (id: string) => {
    storage.deleteExpense(id);
    reloadAll();
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    storage.markNotificationAsRead(id);
    reloadAll();
  };

  const markAllNotificationsRead = () => {
    storage.markAllNotificationsAsRead();
    reloadAll();
  };

  const deleteNotification = (id: string) => {
    storage.deleteNotification(id);
    reloadAll();
  };

  // Categories
  const addCategory = (name: string, icon: string) => {
    const newCat: AssetCategory = {
      id: `cat-custom-${Date.now()}`,
      name,
      nameEn: name,
      icon,
      isCustom: true,
    };
    const updated = [...categories, newCat];
    storage.saveCategories(updated);
    reloadAll();
  };

  const deleteCategory = (id: string) => {
    const updated = categories.filter((c) => c.id !== id);
    storage.saveCategories(updated);
    reloadAll();
  };

  // Settings & Demo Reset
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const merged = { ...settings, ...newSettings };
    storage.saveSettings(merged);
    setSettings(merged);
  };

  const resetToDemo = () => {
    storage.resetToDemoData();
    reloadAll();
  };

  // Theme synchronization with DOM
  const currentTheme = settings.theme || 'light';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    }
  }, [currentTheme]);

  const toggleTheme = () => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  const exportDataJson = () => storage.exportAllData();

  const importDataJson = (json: string) => {
    const ok = storage.importAllData(json);
    if (ok) reloadAll();
    return ok;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        assets,
        maintenance,
        warranties,
        documents,
        expenses,
        notifications,
        categories,
        settings,
        isLoading,
        stats,
        addAsset,
        updateAsset,
        deleteAsset,
        addMaintenance,
        updateMaintenance,
        completeMaintenance,
        deleteMaintenance,
        addWarranty,
        updateWarranty,
        deleteWarranty,
        addDocument,
        deleteDocument,
        addExpense,
        deleteExpense,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        addCategory,
        deleteCategory,
        updateSettings,
        theme: currentTheme,
        toggleTheme,
        resetToDemo,
        exportDataJson,
        importDataJson,
        isQuickActionOpen,
        setIsQuickActionOpen,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        searchResults,
        toasts,
        showToast,
        dismissToast,
        confirmConfig,
        confirmModal,
        closeConfirmModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
