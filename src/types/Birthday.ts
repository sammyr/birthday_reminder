export interface Birthday {
  id: string;
  name: string;
  date: string; // ISO date string
  reminderDays: number;
  interests?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lastNotified?: string; // Date when the last notification was sent
  active?: boolean; // Whether notifications are enabled for this birthday
}
