import { Store } from '@/types/store';

class StorageService {
  private stores: Store[] = [];

  constructor() {
    // Initialize with empty arrays
    this.stores = [];
  }

  getStores(): Store[] {
    return this.stores;
  }

  setStores(stores: Store[]): void {
    this.stores = stores;
  }

  addStore(store: Store): void {
    this.stores.push(store);
  }

  updateStore(store: Store): void {
    const index = this.stores.findIndex(s => s.id === store.id);
    if (index !== -1) {
      this.stores[index] = store;
    }
  }

  deleteStore(id: string): void {
    this.stores = this.stores.filter(s => s.id !== id);
  }
}

export const storage = new StorageService();
