import { useForm } from 'react-hook-form';
import { Birthday } from '@/lib/birthday-db';

interface AddBirthdayFormProps {
  onSubmit: (data: Omit<Birthday, 'id'>) => void;
}

export default function AddBirthdayForm({ onSubmit }: AddBirthdayFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Omit<Birthday, 'id'>>({
    defaultValues: {
      reminderDays: 7
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          {...register('name', { required: 'Name ist erforderlich' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Geburtstag
        </label>
        <input
          type="date"
          {...register('date', { required: 'Datum ist erforderlich' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notizen
        </label>
        <textarea
          {...register('notes')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Hinzufügen
      </button>
    </form>
  );
}
