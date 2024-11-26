import { create } from 'zustand';

interface Store {
  id: number;
  name: string;
}

interface StoreState {
  stores: Store[];
  selectedStore: Store | null;
  setSelectedStore: (store: Store) => void;
  setStores: (stores: Store[]) => void;
}

export const useStore = create<StoreState>((set) => ({
  stores: [],
  selectedStore: null,
  setSelectedStore: (store) => set({ selectedStore: store }),
  setStores: (stores) => set({ stores }),
}));
