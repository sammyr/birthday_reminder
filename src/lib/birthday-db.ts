import Dexie from 'dexie';
import { Birthday } from '@/types/birthday';

class BirthdayDB extends Dexie {
  birthdays!: Dexie.Table<Birthday, string>;

  constructor() {
    super('BirthdayDB');
    this.version(2).stores({
      birthdays: 'id, name, date, lastEmailYear, reminderDays, active, interests, notes'
    });
  }
}

// Create database instance
const db = typeof window === 'undefined' 
  ? null // Return null on server-side
  : new BirthdayDB();

// Service functions that handle both client and server environments
const birthdayService = {
  async getAllBirthdays(): Promise<Birthday[]> {
    if (typeof window === 'undefined') {
      // Server-side: fetch from API
      try {
        const response = await fetch('/api/birthdays');
        if (!response.ok) throw new Error('Failed to fetch birthdays');
        return response.json();
      } catch (error) {
        console.error('Server-side fetch error:', error);
        return [];
      }
    }
    
    // Client-side: use IndexedDB
    try {
      return await db!.birthdays.toArray();
    } catch (error) {
      console.error('IndexedDB error:', error);
      return [];
    }
  },

  async addBirthday(birthday: Omit<Birthday, 'id'>): Promise<string> {
    if (typeof window === 'undefined') {
      throw new Error('Cannot add birthday on server-side');
    }

    const id = crypto.randomUUID();
    const newBirthday = { ...birthday, id };
    
    await db!.birthdays.add(newBirthday);
    return id;
  },

  async updateBirthday(birthday: Birthday): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error('Cannot update birthday on server-side');
    }

    await db!.birthdays.put(birthday);
  },

  async deleteBirthday(id: string): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error('Cannot delete birthday on server-side');
    }

    await db!.birthdays.delete(id);
  }
};

export { db, birthdayService };
