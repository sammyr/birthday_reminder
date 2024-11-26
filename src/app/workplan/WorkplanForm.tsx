'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { dbService } from '@/lib/db';
import { Employee } from '@/types/employee';
import { Shift } from '@/types/shift';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { storage } from '@/utils/storage';
import { WorkingShift } from '@/types';

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  storeId: number;
  employeeId: number;
  shiftId: string;
}

interface WorkplanFormProps {
  isOpen: boolean;
  event: Event | null;
  storeId: number;
  onClose: () => void;
  selectedDate: Date | null;
  onCreate: (shiftData: any) => Promise<void>;
  onUpdate: (oldShift: any, newShiftData: any, newWorkingShift: any) => Promise<void>;
}

interface FormData {
  employeeId: number;
  shiftId: string;
}

export default function WorkplanForm({ 
  isOpen, 
  event, 
  storeId, 
  onClose, 
  selectedDate,
  onCreate,
  onUpdate 
}: WorkplanFormProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [workingShifts, setWorkingShifts] = useState<WorkingShift[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>();

  const selectedShift = watch('shiftId');

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch employees
        const employeesData = await dbService.getAllEmployees();
        console.log('Loaded employees:', employeesData);
        setEmployees(employeesData);

        // Load working shifts
        const shifts = storage.getShifts();
        console.log('Available shifts:', shifts);
        setWorkingShifts(shifts);

        // Pre-select data if editing
        if (event) {
          console.log('Pre-selecting data for event:', event);
          setValue('employeeId', event.employeeId);
          
          if (event.shiftId) {
            console.log('Setting shift ID from event:', event.shiftId);
            setValue('shiftId', event.shiftId.toString());
          } else {
            // Fallback to matching by times if no shiftId
            const eventStart = event.start.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
            const eventEnd = event.end.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
            
            const matchingShift = shifts.find(s => 
              s.fromTime === eventStart && s.toTime === eventEnd
            );

            if (matchingShift) {
              console.log('Found matching shift by times:', matchingShift);
              setValue('shiftId', matchingShift.id);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [event, setValue]);

  const getShiftTimes = (shiftId: string) => {
    const shift = workingShifts.find(s => s.id === shiftId);
    if (!shift) return { startTime: '09:00', endTime: '17:00' };
    return { startTime: shift.fromTime, endTime: shift.toTime };
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const workingShift = workingShifts.find(ws => ws.id === data.shiftId);
      if (!workingShift) {
        throw new Error('Selected working shift not found');
      }

      const shiftData = {
        employeeId: data.employeeId,
        shiftId: data.shiftId,
        date: format(selectedDate!, 'yyyy-MM-dd'),
        storeId,
        startTime: workingShift.fromTime,
        endTime: workingShift.toTime
      };
      
      if (event) {
        await onUpdate(event, shiftData, workingShift);
      } else {
        await onCreate(shiftData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full transform transition-all"
           style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {/* Header */}
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {event ? (
              <div>
                <div className="text-xl mb-1">{event.title}</div>
                <div className="text-sm text-gray-600">
                  {event.start.toLocaleDateString('de-DE', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-sm text-gray-600">
                  {event.start.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} - {event.end.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ) : 'Neue Schicht'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {selectedDate && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-blue-800 font-medium text-base" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                {format(selectedDate, 'EEEE, d. MMMM yyyy', { locale: de })}
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Employee Selection */}
            <div className="form-group">
              <label htmlFor="employeeId" className="block text-sm font-semibold text-gray-700 mb-2">
                Mitarbeiter
              </label>
              <select
                id="employeeId"
                {...register('employeeId', { required: 'Bitte wählen Sie einen Mitarbeiter aus' })}
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                size={6}
              >
                {employees.map((employee) => (
                  <option 
                    key={employee.id} 
                    value={employee.id}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-50"
                  >
                    {employee.name}
                  </option>
                ))}
              </select>
              {errors.employeeId && (
                <p className="mt-2 text-sm text-red-600">{errors.employeeId.message}</p>
              )}
            </div>

            {/* Working Shift Selection */}
            <div className="form-group">
              <label htmlFor="shiftId" className="block text-sm font-semibold text-gray-700 mb-2">
                Schicht
              </label>
              <select
                id="shiftId"
                {...register('shiftId', { required: 'Bitte wählen Sie eine Schicht aus' })}
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                size={4}
              >
                {workingShifts.map((shift) => (
                  <option 
                    key={shift.id} 
                    value={shift.id}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-50"
                  >
                    {shift.title} ({shift.fromTime} - {shift.toTime})
                  </option>
                ))}
              </select>
              {errors.shiftId && (
                <p className="mt-2 text-sm text-red-600">{errors.shiftId.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white
                  ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200
                `}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Speichern...
                  </>
                ) : (
                  'Speichern'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
