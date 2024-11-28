import { Birthday } from '@/types/Birthday';

export async function getBirthdays(): Promise<Birthday[]> {
  const response = await fetch('/api/birthdays');
  if (!response.ok) {
    throw new Error('Failed to fetch birthdays');
  }
  return response.json();
}

export async function getBirthday(id: string): Promise<Birthday> {
  const response = await fetch(`/api/birthdays/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch birthday');
  }
  return response.json();
}

export async function createBirthday(birthday: Omit<Birthday, 'id'>): Promise<Birthday> {
  const response = await fetch('/api/birthdays', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(birthday),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create birthday');
  }
  return response.json();
}

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

export async function deleteBirthday(id: string): Promise<void> {
  const response = await fetch(`/api/birthdays/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete birthday');
  }
}
