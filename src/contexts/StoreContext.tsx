'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Store } from '@/types/store';
import { storage } from '@/utils/storage';

interface StoreContextType {
  stores: Store[];
  selectedStore: Store | null;
  setSelectedStore: (store: Store | null) => void;
  loading: boolean;
  error: string | null;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStores();
  }, []);

  async function loadStores() {
    try {
      const storesData = storage.getStores();
      setStores(storesData);
      setError(null);
    } catch (err) {
      setError('Failed to load stores');
      console.error('Error loading stores:', err);
    } finally {
      setLoading(false);
    }
  }

  const value: StoreContextType = {
    stores,
    selectedStore,
    setSelectedStore,
    loading,
    error
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
