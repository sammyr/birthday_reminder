import { Employee } from '@/types/employee';
import { Store } from '@/types/store';
import { Shift } from '@/types/shift';
import { LogEntry } from '@/types/log';

let dbData: {
  employees: Employee[];
  stores: Store[];
  shifts: Shift[];
  logs: LogEntry[];
} | null = null;

async function readDb() {
  if (!dbData) {
    const response = await fetch('/api/db');
    if (!response.ok) {
      throw new Error('Failed to fetch database');
    }
    dbData = await response.json();
  }
  return dbData!;
}

async function writeDb(data: typeof dbData) {
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

  dbData = data;
}

export const dbService = {
  // Store operations
  getAllStores: async (): Promise<Store[]> => {
    const db = await readDb();
    return db.stores;
  },

  getStore: async (id: number): Promise<Store | undefined> => {
    const db = await readDb();
    return db.stores.find(store => store.id === id);
  },

  addStore: async (store: Omit<Store, 'id'>): Promise<number> => {
    const db = await readDb();
    
    // Generate new ID
    const newId = db.stores.length > 0 ? Math.max(...db.stores.map(s => s.id)) + 1 : 1;
    
    const newStore: Store = {
      id: newId,
      ...store
    };

    db.stores.push(newStore);
    await writeDb(db);
    
    return newId;
  },

  updateStore: async (id: number, store: Partial<Store>): Promise<void> => {
    const db = await readDb();
    const index = db.stores.findIndex(store => store.id === id);
    
    if (index === -1) {
      throw new Error('Store not found');
    }
    
    db.stores[index] = {
      ...db.stores[index],
      ...store
    };
    
    await writeDb(db);
  },

  deleteStore: async (id: number): Promise<void> => {
    const db = await readDb();
    const index = db.stores.findIndex(store => store.id === id);
    
    if (index === -1) {
      throw new Error('Store not found');
    }
    
    db.stores.splice(index, 1);
    await writeDb(db);
  },

  // Employee operations
  getAllEmployees: async (): Promise<Employee[]> => {
    const db = await readDb();
    return db.employees;
  },

  getEmployee: async (id: number): Promise<Employee | undefined> => {
    const db = await readDb();
    return db.employees.find(employee => employee.id === id);
  },

  addEmployee: async (employee: Omit<Employee, 'id'>): Promise<number> => {
    const db = await readDb();
    
    // Generate new ID
    const newId = db.employees.length > 0 ? Math.max(...db.employees.map(e => e.id)) + 1 : 1;
    
    const newEmployee: Employee = {
      id: newId,
      ...employee
    };

    db.employees.push(newEmployee);
    await writeDb(db);
    
    return newId;
  },

  updateEmployee: async (id: number, employee: Partial<Employee>): Promise<void> => {
    const db = await readDb();
    const index = db.employees.findIndex(employee => employee.id === id);
    
    if (index === -1) {
      throw new Error('Employee not found');
    }
    
    db.employees[index] = {
      ...db.employees[index],
      ...employee
    };
    
    await writeDb(db);
  },

  deleteEmployee: async (id: number): Promise<void> => {
    const db = await readDb();
    const index = db.employees.findIndex(employee => employee.id === id);
    
    if (index === -1) {
      throw new Error('Employee not found');
    }
    
    db.employees.splice(index, 1);
    await writeDb(db);
  },

  // Log operations
  getLogEntries: async (): Promise<LogEntry[]> => {
    const db = await readDb();
    return db.logs || [];
  },

  addLogEntry: async (action: string, details: string): Promise<void> => {
    const db = await readDb();
    if (!db.logs) {
      db.logs = [];
    }

    const newLog: LogEntry = {
      id: Math.max(0, ...db.logs.map(log => log.id)) + 1,
      action,
      details,
      timestamp: new Date().toISOString(),
    };

    db.logs.push(newLog);
    await writeDb(db);
  },

  // Shift operations
  getShiftsByStore: async (storeId: number): Promise<Shift[]> => {
    console.log('Getting shifts for store:', storeId);
    const db = await readDb();
    const shifts = db.shifts.filter(shift => shift.storeId === storeId);
    console.log('Found shifts:', shifts);
    return shifts;
  },

  addShift: async (shiftData: Omit<Shift, 'id'>): Promise<number> => {
    console.log('Adding shift:', shiftData);
    const db = await readDb();
    
    // Generate new ID
    const newId = db.shifts.length > 0 ? Math.max(...db.shifts.map(s => s.id)) + 1 : 1;
    
    const newShift: Shift = {
      id: newId,
      ...shiftData
    };

    console.log('Created new shift:', newShift);
    
    db.shifts.push(newShift);
    await writeDb(db);
    
    // Add log entry
    await dbService.addLogEntry(
      'Schicht erstellt',
      `Neue Schicht für ${shiftData.employeeId} am ${shiftData.date}`
    );
    
    return newId;
  },

  updateShift: async (id: number, shiftData: Partial<Shift>): Promise<void> => {
    const db = await readDb();
    const index = db.shifts.findIndex(shift => shift.id === id);
    
    if (index === -1) {
      throw new Error('Shift not found');
    }
    
    const oldShift = db.shifts[index];
    const updatedShift = { ...oldShift, ...shiftData };
    db.shifts[index] = updatedShift;
    await writeDb(db);
    
    // Add log entry
    await dbService.addLogEntry(
      'Schicht aktualisiert',
      `Schicht ${id} wurde aktualisiert`
    );
  },

  deleteShift: async (id: number): Promise<void> => {
    const db = await readDb();
    const index = db.shifts.findIndex(shift => shift.id === id);
    
    if (index === -1) {
      throw new Error('Shift not found');
    }
    
    db.shifts.splice(index, 1);
    await writeDb(db);
    
    // Add log entry
    await dbService.addLogEntry(
      'Schicht gelöscht',
      `Schicht ${id} wurde gelöscht`
    );
  }
};
