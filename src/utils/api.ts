import { Birthday } from '@/types/Birthday';

export async function updateBirthday(birthday: Birthday): Promise<Birthday> {
  const response = await fetch(`/api/birthdays/${birthday.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(birthday),
  });

  if (!response.ok) {
    throw new Error('Failed to update birthday');
  }

  return response.json();
}
