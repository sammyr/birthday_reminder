'use client';

import { Employee, WorkingShift, WorkplanEntry, Store } from '@/types';

const STORAGE_KEYS = {
  EMPLOYEES: 'workplan_employees',
  SHIFTS: 'workplan_shifts',
  WORKPLAN: 'workplan_entries',
  STORES: 'stores',
};

export const storage = {
  // Employees
  getEmployees: (): Employee[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    return data ? JSON.parse(data) : [];
  },

  saveEmployee: (employee: Employee) => {
    const employees = storage.getEmployees();
    const updatedEmployees = [...employees, { ...employee, id: crypto.randomUUID() }];
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(updatedEmployees));
  },

  updateEmployee: (employee: Employee) => {
    const employees = storage.getEmployees();
    const updatedEmployees = employees.map(emp => 
      emp.id === employee.id ? employee : emp
    );
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(updatedEmployees));
  },

  deleteEmployee: (id: string) => {
    const employees = storage.getEmployees();
    const updatedEmployees = employees.filter(emp => emp.id !== id);
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(updatedEmployees));
  },

  // Working Shifts
  getShifts: (): WorkingShift[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.SHIFTS);
    return data ? JSON.parse(data) : [];
  },

  saveShift: (shift: WorkingShift) => {
    const shifts = storage.getShifts();
    const updatedShifts = [...shifts, { ...shift, id: crypto.randomUUID() }];
    localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(updatedShifts));
  },

  updateShift: (shift: WorkingShift) => {
    const shifts = storage.getShifts();
    const updatedShifts = shifts.map(s => 
      s.id === shift.id ? shift : s
    );
    localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(updatedShifts));
  },

  deleteShift: (id: string) => {
    const shifts = storage.getShifts();
    const updatedShifts = shifts.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(updatedShifts));
  },

  // Workplan Entries
  getWorkplanEntries: (): WorkplanEntry[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.WORKPLAN);
    return data ? JSON.parse(data) : [];
  },

  saveWorkplanEntry: (entry: WorkplanEntry) => {
    const entries = storage.getWorkplanEntries();
    const updatedEntries = [...entries, { ...entry, id: crypto.randomUUID() }];
    localStorage.setItem(STORAGE_KEYS.WORKPLAN, JSON.stringify(updatedEntries));
  },

  updateWorkplanEntry: (entry: WorkplanEntry) => {
    const entries = storage.getWorkplanEntries();
    const updatedEntries = entries.map(e => 
      e.id === entry.id ? entry : e
    );
    localStorage.setItem(STORAGE_KEYS.WORKPLAN, JSON.stringify(updatedEntries));
  },

  deleteWorkplanEntry: (id: string) => {
    const entries = storage.getWorkplanEntries();
    const updatedEntries = entries.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.WORKPLAN, JSON.stringify(updatedEntries));
  },

  // Stores
  getStores: (): Store[] => {
    const stores = localStorage.getItem(STORAGE_KEYS.STORES);
    return stores ? JSON.parse(stores) : [];
  },

  saveStore: (store: Store): void => {
    const stores = storage.getStores();
    stores.push(store);
    localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(stores));
  },

  updateStore: (store: Store): void => {
    const stores = storage.getStores();
    const index = stores.findIndex((s) => s.id === store.id);
    if (index !== -1) {
      stores[index] = store;
      localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(stores));
    }
  },

  deleteStore: (id: string): void => {
    const stores = storage.getStores();
    const filteredStores = stores.filter((store) => store.id !== id);
    localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(filteredStores));
  },
};
