import { format } from 'date-fns';
import { Birthday } from '@/pages/index';
import { TrashIcon } from '@heroicons/react/24/outline';

interface BirthdayListProps {
  birthdays: Birthday[];
  onDelete: (id: string) => void;
}

export default function BirthdayList({ birthdays, onDelete }: BirthdayListProps) {
  const sortedBirthdays = [...birthdays].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Birthday List</h2>
      <div className="overflow-hidden bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Name
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Date
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {sortedBirthdays.map((birthday) => (
              <tr key={birthday.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {birthday.name}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {format(new Date(birthday.date), 'MMMM d, yyyy')}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <button
                    onClick={() => onDelete(birthday.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
            {birthdays.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-sm text-gray-500 text-center">
                  No birthdays added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
