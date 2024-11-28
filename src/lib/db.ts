import { Store } from '@/types/store';
import { Birthday } from '@/types/Birthday';
import { v4 as uuidv4 } from 'uuid';

interface DbData {
  stores: Store[];
  birthdays: Birthday[];
  settings: {
    reminderDays: number;
    emailNotifications: boolean;
    emailTemplate: string;
    emailAddress: string;
  };
}

// In-memory cache of the database
let dbData: DbData | null = null;

// Read database
async function readDb(): Promise<DbData> {
  if (dbData) return dbData;

  try {
    const response = await fetch('/api/db');
    if (!response.ok) {
      throw new Error('Failed to fetch database');
    }
    const data = await response.json();
    dbData = data;
    return data;
  } catch (error) {
    console.error('Error reading database:', error);
    throw error;
  }
}

// Write to database
async function writeDb(data: DbData): Promise<void> {
  try {
    const response = await fetch('/api/db', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to write to database');
    }

    // Update cache
    dbData = data;
  } catch (error) {
    console.error('Error writing to database:', error);
    throw error;
  }
}

// Birthday operations
export async function getAllBirthdays(): Promise<Birthday[]> {
  const data = await readDb();
  return data.birthdays || [];
}

export async function getBirthday(id: string): Promise<Birthday | undefined> {
  const data = await readDb();
  return data.birthdays?.find(b => b.id === id);
}

export async function addBirthday(birthday: Omit<Birthday, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const data = await readDb();
  const now = new Date().toISOString();
  const newBirthday: Birthday = {
    ...birthday,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };

  data.birthdays = [...(data.birthdays || []), newBirthday];
  await writeDb(data);
  return newBirthday.id;
}

export async function updateBirthday(id: string, birthday: Partial<Omit<Birthday, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
  const data = await readDb();
  const index = data.birthdays?.findIndex(b => b.id === id);
  
  if (index === undefined || index === -1) {
    throw new Error('Birthday not found');
  }

  data.birthdays[index] = {
    ...data.birthdays[index],
    ...birthday,
    updatedAt: new Date().toISOString(),
  };

  await writeDb(data);
}

export async function deleteBirthday(id: string): Promise<void> {
  const data = await readDb();
  data.birthdays = data.birthdays?.filter(b => b.id !== id) || [];
  await writeDb(data);
}

// Store operations
export async function getAllStores(): Promise<Store[]> {
  const data = await readDb();
  return data.stores || [];
}

export async function getStore(id: string): Promise<Store | undefined> {
  const data = await readDb();
  return data.stores?.find(s => s.id === id);
}

export async function addStore(store: Omit<Store, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const data = await readDb();
  const now = new Date().toISOString();
  const newStore: Store = {
    ...store,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };

  data.stores = [...(data.stores || []), newStore];
  await writeDb(data);
  return newStore.id;
}

export async function updateStore(id: string, store: Partial<Omit<Store, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
  const data = await readDb();
  const index = data.stores?.findIndex(s => s.id === id);
  
  if (index === undefined || index === -1) {
    throw new Error('Store not found');
  }

  data.stores[index] = {
    ...data.stores[index],
    ...store,
    updatedAt: new Date().toISOString(),
  };

  await writeDb(data);
}

export async function deleteStore(id: string): Promise<void> {
  const data = await readDb();
  data.stores = data.stores?.filter(s => s.id !== id) || [];
  await writeDb(data);
}

// Settings operations
export async function getSettings(): Promise<DbData['settings']> {
  const data = await readDb();
  return data.settings;
}

export async function updateSettings(settings: DbData['settings']): Promise<void> {
  const data = await readDb();
  data.settings = settings;
  await writeDb(data);
}

// Export the service object for backward compatibility
export const dbService = {
  getAllBirthdays,
  getBirthday,
  addBirthday,
  updateBirthday,
  deleteBirthday,
  getAllStores,
  getStore,
  addStore,
  updateStore,
  deleteStore,
  getSettings,
  updateSettings,
};
