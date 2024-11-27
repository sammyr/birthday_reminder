'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Birthday } from '@/types/Birthday';
import { updateBirthday } from '@/utils/api';

export default function CheckupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const [birthday, setBirthday] = useState<Birthday | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const startCheckup = async () => {
      if (!id) {
        setError('Keine ID angegeben');
        setLoading(false);
        return;
      }

      try {
        // Fetch birthday data
        const response = await fetch(`/api/birthdays/${id}`);
        if (!response.ok) {
          throw new Error('Geburtstag nicht gefunden');
        }

        const birthdayData = await response.json();
        setBirthday(birthdayData);

        // Automatically update the checkup date
        const updatedBirthday = {
          ...birthdayData,
          lastCheckup: new Date().toISOString()
        };

        await updateBirthday(updatedBirthday);
        setSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      startCheckup();
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Überprüfung läuft...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-xl mb-4">⚠️ Fehler</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Zurück zur Startseite
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="text-green-500 text-xl mb-4">✅ Überprüfung abgeschlossen</div>
          <p className="text-gray-600 mb-4">
            Die Kontaktdaten für {birthday?.name} wurden erfolgreich als überprüft markiert.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Zurück zur Startseite
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <p className="text-gray-600 mb-4">
          Bitte geben Sie eine gültige ID in der URL an (z.B. /checkup/?id=123)
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Zurück zur Startseite
        </button>
      </div>
    </div>
  );
}
