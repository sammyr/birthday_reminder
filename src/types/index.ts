export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
}

export interface WorkingShift {
  id: string;
  title: string;
  fromTime: string;
  toTime: string;
}

export interface WorkplanEntry {
  id: string;
  date: string;
  employeeId: string;
  shiftId: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  employeeId: string;
  shiftId: string;
}
