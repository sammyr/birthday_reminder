'use client';

import { Store } from '@/types/store';

const STORAGE_KEYS = {
  STORES: 'stores',
};

export const storage = {
  // Stores
  getStores: (): Store[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.STORES);
    return data ? JSON.parse(data) : [];
  },

  saveStore: (store: Store): void => {
    const stores = storage.getStores();
    const updatedStores = [...stores, store];
    localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(updatedStores));
  },

  updateStore: (store: Store): void => {
    const stores = storage.getStores();
    const updatedStores = stores.map(s => s.id === store.id ? store : s);
    localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(updatedStores));
  },

  deleteStore: (id: string): void => {
    const stores = storage.getStores();
    const updatedStores = stores.filter(store => store.id !== id);
    localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(updatedStores));
  }
};
