export interface Shift {
  id: number;
  storeId: number;
  employeeId: number;
  date: string;
  startTime: string;
  endTime: string;
  shiftId: string;  // Add shiftId to track the working shift type
}

export interface ShiftFormData {
  employeeId: number;
  shiftType: 'morning' | 'afternoon' | 'night';
}
