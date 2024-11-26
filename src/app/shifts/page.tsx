'use client';

import { useState, useEffect } from 'react';
import { WorkingShift } from '@/types';
import { storage } from '@/utils/storage';
import { MdEdit, MdDelete } from 'react-icons/md';
import HourPicker from '@/components/HourPicker';

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<WorkingShift[]>([]);
  const [editingShift, setEditingShift] = useState<WorkingShift | null>(null);
  const [title, setTitle] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');

  useEffect(() => {
    setShifts(storage.getShifts());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const shiftData: Partial<WorkingShift> = {
      title,
      fromTime,
      toTime,
    };

    if (editingShift) {
      storage.updateShift({ ...shiftData, id: editingShift.id } as WorkingShift);
    } else {
      storage.saveShift(shiftData as WorkingShift);
    }
    
    setShifts(storage.getShifts());
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setFromTime('');
    setToTime('');
    setEditingShift(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Sind Sie sicher, dass Sie diese Schicht löschen möchten?')) {
      storage.deleteShift(id);
      setShifts(storage.getShifts());
    }
  };

  const handleEdit = (shift: WorkingShift) => {
    setEditingShift(shift);
    setTitle(shift.title);
    setFromTime(shift.fromTime);
    setToTime(shift.toTime);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Arbeitszeiten</h1>
          <p className="mt-2 text-sm text-gray-700">
            Liste aller Arbeitszeiten mit ihren Details und Verwaltungsoptionen.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="mt-8 space-y-6 bg-white py-6 px-4 shadow sm:rounded-lg sm:px-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Schichtbezeichnung
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="z.B. Frühschicht"
              />
            </div>
          </div>

          <div>
            <label htmlFor="fromTime" className="block text-sm font-medium text-gray-700">
              Von
            </label>
            <div className="mt-1">
              <HourPicker
                id="fromTime"
                required
                value={fromTime}
                onChange={setFromTime}
              />
            </div>
          </div>

          <div>
            <label htmlFor="toTime" className="block text-sm font-medium text-gray-700">
              Bis
            </label>
            <div className="mt-1">
              <HourPicker
                id="toTime"
                required
                value={toTime}
                onChange={setToTime}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          {editingShift && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Abbrechen
            </button>
          )}
          <button
            type="submit"
            className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            {editingShift ? 'Aktualisieren' : 'Hinzufügen'}
          </button>
        </div>
      </form>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Schicht
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Von
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Bis
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Aktionen</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {shifts.map((shift) => (
                    <tr key={shift.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {shift.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {shift.fromTime} Uhr
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {shift.toTime} Uhr
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEdit(shift)}
                          className="inline-flex items-center justify-center p-2 rounded-md text-blue-600 hover:text-white hover:bg-blue-600 transition-colors duration-200 mr-2"
                          title="Bearbeiten"
                        >
                          <MdEdit className="h-6 w-6" aria-hidden="true" />
                          <span className="sr-only">Bearbeiten</span>
                        </button>
                        <button
                          onClick={() => handleDelete(shift.id)}
                          className="inline-flex items-center justify-center p-2 rounded-md text-red-600 hover:text-white hover:bg-red-600 transition-colors duration-200"
                          title="Löschen"
                        >
                          <MdDelete className="h-6 w-6" aria-hidden="true" />
                          <span className="sr-only">Löschen</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
