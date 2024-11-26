'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { WorkingShift } from '@/types';

interface ShiftFormProps {
  shift: WorkingShift | null;
  onSave: (shift: WorkingShift) => void;
  onCancel: () => void;
}

export default function ShiftForm({ shift, onSave, onCancel }: ShiftFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkingShift>();

  useEffect(() => {
    if (shift) {
      reset(shift);
    }
  }, [shift, reset]);

  const onSubmit = (data: WorkingShift) => {
    onSave({
      ...data,
      id: shift?.id || '',
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-lg font-medium mb-6">
          {shift ? 'Edit Shift' : 'Add Shift'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              From Time
            </label>
            <input
              type="time"
              {...register('fromTime', { required: 'Start time is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.fromTime && (
              <p className="mt-1 text-sm text-red-600">{errors.fromTime.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              To Time
            </label>
            <input
              type="time"
              {...register('toTime', { required: 'End time is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.toTime && (
              <p className="mt-1 text-sm text-red-600">{errors.toTime.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              {shift ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
