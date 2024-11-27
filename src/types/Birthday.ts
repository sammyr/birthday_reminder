export interface Birthday {
  id: string;
  name: string;
  date: string;
  reminderDays: number;
  lastCheckup?: string;
  email?: string;
  interests?: string;
  notes?: string;
  active: boolean;
}
