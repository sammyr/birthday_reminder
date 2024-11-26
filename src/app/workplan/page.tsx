'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, ToolbarProps, EventContentArg, EventClickArg } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { de } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useStore } from '@/lib/store';
import { dbService } from '@/lib/db';
import WorkplanForm from './WorkplanForm';
import { addDays, addMonths } from 'date-fns';
import { storage } from '@/utils/storage';
import AlertBar from '@/components/AlertBar';
import { FaClock, FaUser, FaCalendar } from 'react-icons/fa'; // Import icons
import EventContent from './EventContent'; // Import event content renderer

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales: { de },
});

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  storeId: number;
  employeeId: number;
  shiftId: number;
  resource?: any;
  extendedProps?: any;
}

interface Employee {
  id: number;
  name: string;
}

interface Store {
  id: string;
  name: string;
}

interface WorkingShift {
  id: number;
  fromTime: string;
  toTime: string;
  title: string;
}

const getShiftLabel = (shift: any, employee: any | undefined) => {
  const shiftType = getShiftType(shift.startTime);
  const shiftLabel = shiftType === 'Frühschicht' ? 'Früh' : 
                    shiftType === 'Spätschicht' ? 'Spät' : 
                    shiftType === 'Nachtschicht' ? 'Nacht' : '';
  return `${employee?.name || 'Unknown'}\n${shiftLabel}`;
};

const getShiftType = (startTime: string): string => {
  const hour = parseInt(startTime.split(':')[0]);
  if (hour >= 6 && hour < 14) return 'Frühschicht';
  if (hour >= 14 && hour < 22) return 'Spätschicht';
  return 'Nachtschicht';
};

const getShiftBackgroundColor = (shift: any) => {
  const shiftType = getShiftType(shift.startTime);
  switch (shiftType) {
    case 'Frühschicht':
      return 'bg-blue-100 hover:bg-blue-200';
    case 'Spätschicht':
      return 'bg-green-100 hover:bg-green-200';
    case 'Nachtschicht':
      return 'bg-purple-100 hover:bg-purple-200';
    default:
      return 'bg-gray-100 hover:bg-gray-200';
  }
};

const DnDCalendar = withDragAndDrop(Calendar, {
  dragAndDropOptions: {
    dragRevertDuration: 0,
    dragFromOutsideItem: false,
    onDropFromOutside: false,
    shouldCancelStart: () => false,
  }
});

export default function WorkplanPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { selectedStore, setSelectedStore } = useStore();
  const [stores, setStores] = useState<Store[]>([]);
  const [date, setDate] = useState(new Date());
  const [workingShifts, setWorkingShifts] = useState<WorkingShift[]>([]);
  const [alert, setAlert] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const messages = {
    noStore: 'Bitte wählen Sie zuerst eine Filiale aus',
    noShifts: 'Keine Schichten gefunden',
    loadingShifts: 'Schichten werden geladen...',
    errorLoading: 'Fehler beim Laden der Daten',
    selectStore: 'Filiale auswählen',
  };

  const calendarMessages = {
    previous: 'Letzter Monat',
    next: 'Nächster Monat',
    today: 'Dieser Monat',
    month: 'Monat',
    week: 'Woche',
    day: 'Tag',
    agenda: 'Agenda',
    date: 'Datum',
    time: 'Zeit',
    event: 'Termin',
    allDay: 'Ganztägig',
    noEventsInRange: 'Keine Termine in diesem Zeitraum',
    showMore: (total: any) => `+${total} weitere`,
  };

  const formats = {
    weekdayFormat: (date: Date) => {
      const weekdays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
      return weekdays[date.getDay() === 0 ? 6 : date.getDay() - 1];
    }
  };

  const handleSelectStore = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const storeId = e.target.value;
    const store = stores.find(s => s.id === storeId);
    setSelectedStore(store || null);
  };

  // Initial data load
  useEffect(() => {
    async function fetchData() {
      try {
        // Load employees and stores
        const employeesData = await dbService.getAllEmployees();
        const storesData = storage.getStores();
        
        console.log('Initial load - Employees:', employeesData);
        console.log('Initial load - Stores:', storesData);
        
        setEmployees(employeesData);
        setStores(storesData);

        // Set initial store if none selected
        if (!selectedStore && storesData.length > 0) {
          console.log('Setting initial store:', storesData[0]);
          setSelectedStore(storesData[0]);
        }
        
        // Load working shifts from localStorage
        const shifts = storage.getShifts();
        setWorkingShifts(shifts);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    }
    fetchData();
  }, []); // Only run on mount

  // Load shifts and employees when store changes
  useEffect(() => {
    if (!selectedStore) {
      console.log('No store selected, skipping data fetch');
      return;
    }

    console.log('Loading data for store:', selectedStore);
    async function fetchShifts() {
      try {
        const [shifts, employeesData] = await Promise.all([
          dbService.getShiftsByStore(parseInt(selectedStore.id)),
          dbService.getAllEmployees()
        ]);
        
        // Get working shifts
        const availableShifts = storage.getShifts();
        
        console.log('Data loaded:', {
          shifts,
          employees: employeesData,
          workingShifts: availableShifts
        });
        
        setEmployees(employeesData);
        
        const eventsWithEmployees = shifts.map(shift => {
          const employeeId = Number(shift.employeeId);
          const employee = employeesData.find(e => e.id === employeeId);
          const workingShift = availableShifts.find(ws => ws.id === shift.shiftId);
          console.log('Processing shift:', shift, 'with employee:', employee, 'working shift:', workingShift);
          
          // Parse the date and times
          const [year, month, day] = shift.date.split('-').map(Number);
          const shiftDate = new Date(year, month - 1, day);
          
          const [startHour, startMinute] = shift.startTime.split(':').map(Number);
          const [endHour, endMinute] = shift.endTime.split(':').map(Number);
          
          const start = new Date(shiftDate);
          start.setHours(startHour, startMinute, 0);
          
          const end = new Date(shiftDate);
          end.setHours(endHour, endMinute, 0);
          
          // For night shifts (end time before start time), we don't adjust the end date
          // This ensures the event stays within the selected date
          const isNightShift = end < start;
          const displayEnd = isNightShift ? new Date(start.getTime() + 1000) : end;

          const event = {
            id: shift.id,
            title: workingShift?.title || `${shift.startTime} - ${shift.endTime}`,
            start,
            end: displayEnd,
            storeId: parseInt(selectedStore.id),
            employeeId: shift.employeeId,
            resource: employee,
            extendedProps: { 
              shift,
              employee,
              workingShift
            }
          };

          console.log('Created event:', event);
          return event;
        });
        
        console.log('Setting events:', eventsWithEmployees);
        setEvents(eventsWithEmployees);
      } catch (error) {
        console.error('Error fetching shifts and employees:', error);
      }
    }

    fetchShifts();
  }, [selectedStore]); // Only run when store changes

  useEffect(() => {
    refreshShifts();
  }, [selectedStore, employees]);

  const refreshShifts = async () => {
    if (!selectedStore?.id) {
      console.log('No store selected');
      return;
    }

    try {
      console.log('Fetching shifts for store:', selectedStore.id);
      const shifts = await dbService.getShiftsByStore(parseInt(selectedStore.id));
      console.log('Fetched shifts:', shifts);

      if (!shifts || shifts.length === 0) {
        console.log('No shifts found for store');
        setEvents([]);
        return;
      }

      // Load working shifts from storage
      const availableShifts = storage.getShifts();
      console.log('Available working shifts:', availableShifts);

      const eventsWithEmployees = shifts.map(shift => {
        const employeeId = Number(shift.employeeId);
        const employee = employees.find(e => e.id === employeeId);
        const workingShift = availableShifts.find(ws => ws.id === shift.shiftId);
        
        // Parse the date and times
        const [year, month, day] = shift.date.split('-').map(Number);
        const shiftDate = new Date(year, month - 1, day);
        
        const [startHour, startMinute] = shift.startTime.split(':').map(Number);
        const [endHour, endMinute] = shift.endTime.split(':').map(Number);
        
        const start = new Date(shiftDate);
        start.setHours(startHour, startMinute, 0);
        
        const end = new Date(shiftDate);
        end.setHours(endHour, endMinute, 0);
        
        // For night shifts (end time before start time), adjust end date
        if (endHour < startHour || (endHour === startHour && endMinute < startMinute)) {
          end.setDate(end.getDate() + 1);
        }

        return {
          id: shift.id,
          title: workingShift?.title || `${shift.startTime} - ${shift.endTime}`,
          start,
          end,
          storeId: parseInt(selectedStore.id),
          employeeId: shift.employeeId,
          resource: employee,
          extendedProps: { 
            shift,
            employee,
            workingShift
          }
        };
      });

      setEvents(eventsWithEmployees);
    } catch (error) {
      console.error('Error refreshing shifts:', error);
    }
  };

  const handleEventClick = (info: EventClickArg) => {
    if (!info || !info.event) {
      console.error('No event information provided');
      return;
    }

    const event = info.event;
    const extendedProps = event.extendedProps || {};
    const { shift } = extendedProps;

    console.log('Clicked event:', event, 'with shift:', shift);
    
    if (!shift) {
      console.error('No shift data found in event');
      return;
    }

    // Find the employee and working shift
    const employee = employees.find(e => e.id === parseInt(shift.employeeId));
    const workingShift = storage.getShifts().find(ws => ws.id === shift.shiftId);

    // Format the title to include employee name and shift type
    const title = `${employee?.name || 'Unknown Employee'} - ${workingShift?.title || 'Unknown Shift'}`;
    
    setSelectedEvent({
      id: parseInt(event.id),
      title: title, // Use the formatted title
      start: event.start!,
      end: event.end!,
      employeeId: parseInt(shift.employeeId),
      storeId: parseInt(shift.storeId),
      shiftId: shift.shiftId
    });
    
    setSelectedDate(event.start!);
    setIsFormOpen(true);
  };

  const handleSelectSlot = ({ start }: { start: Date }) => {
    console.log('Selected slot:', start);
    setSelectedDate(start);
    setSelectedEvent(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedEvent(null);
    setSelectedDate(null);
    refreshShifts();
  };

  const CustomToolbar = ({ onNavigate, date }: ToolbarProps) => {
    return (
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            className="px-3 py-2 text-sm bg-white border rounded-md hover:bg-gray-50"
            onClick={() => onNavigate('PREV')}
          >
            Letzter Monat
          </button>
          <button
            className="px-3 py-2 text-sm bg-white border rounded-md hover:bg-gray-50"
            onClick={() => onNavigate('NEXT')}
          >
            Nächster Monat
          </button>
          <button
            className="px-3 py-2 text-sm bg-white border rounded-md hover:bg-gray-50"
            onClick={() => onNavigate('TODAY')}
          >
            Dieser Monat
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Filiale in :</span>
            <select
              value={selectedStore?.id || ''}
              onChange={(e) => {
                const store = stores.find(s => s.id === e.target.value);
                setSelectedStore(store || null);
              }}
              className="px-3 py-2 text-sm bg-white border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Auswählen...</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <h2 className="text-lg font-semibold">
          {format(date, 'MMMM yyyy', { locale: de })}
        </h2>
      </div>
    );
  };

  const handleDeleteShift = async (shiftId: number) => {
    try {
      await dbService.deleteShift(shiftId);
      await refreshShifts();
    } catch (error) {
      console.error('Error deleting shift:', error);
      showAlert('Fehler beim Löschen der Schicht', 'error');
    }
  };

  const getEventContent = (eventInfo: any) => {
    const { event } = eventInfo;
    const { employee, workingShift, shift } = event.extendedProps;

    return (
      <EventContent
        employee={employee}
        workingShift={workingShift}
        shift={shift}
        onDelete={handleDeleteShift}
        onEdit={handleSelectEvent}
        showAlert={showAlert}
        refreshShifts={refreshShifts}
        availableShifts={workingShifts}
        employees={employees}
      />
    );
  };

  const handleEventPropGetter = (event: Event) => {
    const shift = event.extendedProps?.shift;
    const workingShift = storage.getShifts().find(ws => ws.id === shift?.shiftId);

    // Different colors for different shifts
    let backgroundColor = '#3b82f6'; // default blue

    if (workingShift) {
      const title = workingShift.title.toLowerCase();
      if (title.includes('früh')) {
        backgroundColor = '#60a5fa'; // lighter blue
      } else if (title.includes('spät')) {
        backgroundColor = '#34d399'; // green
      } else if (title.includes('nacht')) {
        backgroundColor = '#818cf8'; // purple
      }
    }

    return {
      className: 'calendar-event',
      style: {
        backgroundColor,
        border: 'none'
      }
    };
  };

  const handleDayPropGetter = (date: Date) => {
    // Weekend styling is now handled by dayCellClassNames in calendarOptions
    return {};
  };

  const handleEventDrop = async ({ event, start, isAllDay }: any) => {
    try {
      const { shift, workingShift, employee } = event.extendedProps;
      console.log('Drop event:', { event, start, shift, workingShift });
      
      if (!shift || !workingShift) {
        throw new Error('Invalid event data');
      }

      // Create the new date by combining the dropped date with the working shift times
      const newDate = new Date(start);
      const [hours, minutes] = workingShift.fromTime.split(':');
      newDate.setHours(parseInt(hours), parseInt(minutes), 0);

      const shiftData = {
        ...shift,
        date: format(newDate, 'yyyy-MM-dd'),
        startTime: workingShift.fromTime,
        endTime: workingShift.toTime,
      };

      const formattedNewDate = format(newDate, 'd. MMMM', { locale: de });
      
      await dbService.updateShift(shift.id, shiftData);
      showAlert(`Schicht von ${employee?.name || 'Unbekannt'} wurde auf ${formattedNewDate} verschoben`, 'info');
      await refreshShifts();
    } catch (error) {
      console.error('Error updating shift:', error);
      showAlert('Fehler beim Verschieben der Schicht', 'error');
    }
  };

  const handleEventResize = async ({ event, start, end }: any) => {
    try {
      const { shift, workingShift, employee } = event.extendedProps;
      if (!shift || !workingShift) {
        throw new Error('Invalid event data');
      }

      showAlert(`Schicht von ${employee?.name || 'Unbekannt'} wurde angepasst`, 'info');
      await refreshShifts();
    } catch (error) {
      console.error('Error resizing shift:', error);
      showAlert('Fehler beim Anpassen der Schicht', 'error');
    }
  };

  const handleSelectEvent = async (event: any) => {
    try {
      const { shift, workingShift } = event.extendedProps;
      if (!shift || !workingShift) {
        throw new Error('Invalid event data');
      }

      // Update the shift in the database
      const shiftData = {
        ...shift,
        shiftId: event.shiftId,
        startTime: workingShift.fromTime,
        endTime: workingShift.toTime,
      };

      await dbService.updateShift(event.id, shiftData);
      await refreshShifts();
    } catch (error) {
      console.error('Error selecting event:', error);
      showAlert('Fehler beim Aktualisieren der Schicht', 'error');
    }
  };

  const handleShiftUpdate = async (oldShift: any, newShiftData: any, newWorkingShift: any) => {
    try {
      await dbService.updateShift(oldShift.id, newShiftData);
      const formattedDate = format(new Date(newShiftData.date), 'd. MMMM', { locale: de });
      
      // Find the old working shift to get its title
      const oldWorkingShift = workingShifts.find(ws => ws.id === oldShift.shiftId);
      const oldShiftTitle = oldWorkingShift?.title || 'Unbekannte Schicht';
      const newShiftTitle = newWorkingShift.title;

      if (oldShift.shiftId !== newShiftData.shiftId) {
        showAlert(
          `${formattedDate}: ${oldShiftTitle} wurde in ${newShiftTitle} umgewandelt`,
          'info'
        );
      } else {
        showAlert(`${formattedDate}: Schicht wurde aktualisiert`, 'info');
      }
      
      await refreshShifts();
    } catch (error) {
      console.error('Error updating shift:', error);
      showAlert('Fehler beim Aktualisieren der Schicht', 'error');
    }
  };

  const handleCreateShift = async (shiftData: any) => {
    try {
      if (!selectedStore?.id) {
        showAlert('Keine Filiale ausgewählt', 'error');
        return;
      }

      const newShiftData = {
        storeId: parseInt(selectedStore.id),
        employeeId: shiftData.employeeId,
        date: shiftData.date,
        startTime: shiftData.startTime,
        endTime: shiftData.endTime,
        shiftId: shiftData.shiftId
      };
      
      console.log('Creating new shift:', newShiftData);
      const newId = await dbService.addShift(newShiftData);
      console.log('Created shift with ID:', newId);
      
      const formattedDate = format(new Date(shiftData.date), 'd. MMMM', { locale: de });
      const workingShift = workingShifts.find(ws => ws.id === shiftData.shiftId);
      showAlert(`${formattedDate}: ${workingShift?.title || 'Schicht'} wurde erstellt`, 'success');
      
      await refreshShifts();
    } catch (error) {
      console.error('Error creating shift:', error);
      showAlert('Fehler beim Erstellen der Schicht', 'error');
    }
  };

  const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setAlert({ show: true, message, type });
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
    refreshShifts();
  };

  // Transform events to ensure they only appear in their start day
  // IMPORTANT: This transformation is crucial for late shifts that span multiple days
  // DO NOT REMOVE or modify this transformation as it ensures proper event display
  const transformEvents = (events: any[]) => {
    return events.map(event => {
      const { start, end, ...rest } = event;
      return {
        ...rest,
        start,
        end: new Date(start), // Set end to start to ensure event only appears in start day
        allDay: true, // Force all-day to prevent time-based rendering
      };
    });
  };

  const calendarOptions = {
    defaultView: 'month',
    views: ['month'],
    selectable: true,
    resizable: true,
    events: transformEvents(events),  // Transform events to show only in start day
    onSelectSlot: handleSelectSlot,
    onEventDrop: handleEventDrop,
    onEventResize: handleEventResize,
    onSelectEvent: handleEventClick,
    draggable: true,
    step: 30,
    timeslots: 2,
    date: date,
    onNavigate: handleNavigate,
    components: {
      toolbar: CustomToolbar,
      event: getEventContent
    },
    dayCellClassNames: (arg) => {
      const day = arg.date.getDay();
      if (day === 0) return 'sunday-cell';
      if (day === 6) return 'saturday-cell';
      return '';
    },
    dayPropGetter: handleDayPropGetter,
    eventPropGetter: handleEventPropGetter,
    messages: calendarMessages,
    formats: formats,
    popup: false,
    tooltipAccessor: null,
    showMultiDayTimes: false,
    multiDayEvents: {
      startDate: 'start',
      endDate: 'end'
    }
  };

  return (
    <div className="h-full p-4 bg-gray-50 max-w-[95vw] mx-auto">
      {alert.show && (
        <AlertBar
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ ...alert, show: false })}
        />
      )}

      {!selectedStore ? (
        <div className="flex items-center justify-center h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm">
          <div className="text-center">
            <p className="text-gray-600 text-lg mb-4">Bitte wählen Sie eine Filiale aus</p>
            <p className="text-gray-500">Verwenden Sie die Dropdown-Liste oben, um eine Filiale auszuwählen</p>
          </div>
        </div>
      ) : (
        <>
          <DnDCalendar
            localizer={localizer}
            style={{ height: 'calc(100vh - 8rem)' }}
            {...calendarOptions}
          />

          {isFormOpen && selectedStore && (
            <WorkplanForm
              isOpen={isFormOpen}
              event={selectedEvent}
              storeId={selectedStore.id}
              onClose={handleCloseForm}
              selectedDate={selectedDate}
              onCreate={handleCreateShift}
              onUpdate={handleShiftUpdate}
            />
          )}
        </>
      )}
    </div>
  );
}
