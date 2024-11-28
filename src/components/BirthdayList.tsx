import { format } from 'date-fns';
import { Birthday } from '@/lib/birthday-db';
import { TrashIcon } from '@heroicons/react/24/outline';

interface BirthdayListProps {
  birthdays: Birthday[];
  onDelete: (id: string) => void;
}

export default function BirthdayList({ birthdays, onDelete }: BirthdayListProps) {
  return (
    <div className="mt-6">
      <ul className="divide-y divide-gray-200">
        {birthdays.map((birthday) => (
          <li key={birthday.id} className="py-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-900">{birthday.name}</p>
              <p className="text-sm text-gray-500">
                {format(new Date(birthday.date), 'dd.MM.yyyy')}
              </p>
              {birthday.notes && (
                <p className="text-sm text-gray-500 mt-1">{birthday.notes}</p>
              )}
            </div>
            <button
              onClick={() => onDelete(birthday.id)}
              className="ml-4 text-red-600 hover:text-red-900"
            >
              <TrashIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
