import Dexie from 'dexie';
import { Birthday } from '@/types/Birthday';

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
    if (!db) return [];
    return await db.birthdays.toArray();
  },

  async getBirthday(id: string): Promise<Birthday | undefined> {
    if (!db) return undefined;
    return await db.birthdays.get(id);
  },

  async addBirthday(birthday: Omit<Birthday, 'id'>): Promise<string> {
    if (!db) throw new Error('Database not available');
    const id = crypto.randomUUID();
    await db.birthdays.add({ ...birthday, id });
    return id;
  },

  async updateBirthday(birthday: Birthday): Promise<void> {
    if (!db) throw new Error('Database not available');
    await db.birthdays.put(birthday);
  },

  async deleteBirthday(id: string): Promise<void> {
    if (!db) throw new Error('Database not available');
    await db.birthdays.delete(id);
  }
};

export { db, birthdayService };
export type { Birthday };