'use client';

import { useState, useEffect } from 'react';
import { format, parseISO, differenceInDays, addYears, differenceInYears } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { useSettings } from '@/contexts/SettingsContext';
import { MdCake, MdNotifications, MdDelete, MdEdit, MdCheck, MdClose, MdAdd } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Birthday, birthdayService } from '@/lib/birthday-db';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

type BirthdayFormData = Omit<Birthday, 'id'>;

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  type?: 'text' | 'textarea';
  placeholder?: string;
  label?: string;
}

const EditableField = ({ value, onSave, type = 'text', placeholder, label }: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="group flex items-center gap-2">
        {value ? (
          <span>{value}</span>
        ) : (
          <span className="text-gray-400 italic">{placeholder}</span>
        )}
        <button
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
        >
          <MdEdit className="text-gray-500" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {label && <Label>{label}</Label>}
      {type === 'textarea' ? (
        <Textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          placeholder={placeholder}
          className="min-h-[100px]"
        />
      ) : (
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          placeholder={placeholder}
        />
      )}
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave} variant="outline" className="w-20">
          <MdCheck className="mr-1" /> Speichern
        </Button>
        <Button size="sm" onClick={handleCancel} variant="ghost" className="w-20">
          <MdClose className="mr-1" /> Abbrechen
        </Button>
      </div>
    </div>
  );
};

export default function Home() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<BirthdayFormData>({
    defaultValues: {
      reminderDays: 7,
      active: true
    }
  });
  const { settings } = useSettings();

  useEffect(() => {
    loadBirthdays();
  }, []);

  const loadBirthdays = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedBirthdays = await birthdayService.getAllBirthdays();
      setBirthdays(loadedBirthdays);

      // Sync with server
      try {
        const response = await fetch('/api/birthdays');
        if (response.ok) {
          const serverBirthdays = await response.json();
          if (serverBirthdays.length > 0) {
            setBirthdays(serverBirthdays);
            // Update IndexedDB with server data
            for (const birthday of serverBirthdays) {
              await birthdayService.addBirthday(birthday);
            }
          }
        }
      } catch (error) {
        console.error('Failed to sync with server:', error);
      }
    } catch (err) {
      console.error('Failed to load birthdays:', err);
      setError('Failed to load birthdays. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: BirthdayFormData) => {
    try {
      setError(null);
      const id = await birthdayService.addBirthday(data);
      
      // Sync with server
      try {
        await fetch('/api/birthdays', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...data, id }),
        });
      } catch (error) {
        console.error('Failed to sync with server:', error);
      }

      await loadBirthdays();
      reset();
    } catch (err) {
      console.error('Failed to add birthday:', err);
      setError('Failed to add birthday. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Ask for confirmation
      if (!confirm('Sind Sie sicher, dass Sie diesen Geburtstag löschen möchten?')) {
        return;
      }

      setError(null);
      
      // Delete from client
      await birthdayService.deleteBirthday(id);
      
      // Delete from server
      try {
        const response = await fetch(`/api/birthdays?id=${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Löschen vom Server fehlgeschlagen');
        }
      } catch (error) {
        console.error('Synchronisierung mit Server fehlgeschlagen:', error);
      }
      
      setBirthdays(birthdays.filter(b => b.id !== id));
    } catch (err) {
      console.error('Geburtstag konnte nicht gelöscht werden:', err);
      setError('Geburtstag konnte nicht gelöscht werden. Bitte versuchen Sie es erneut.');
    }
  };

  const handleToggleActive = async (birthday: Birthday) => {
    try {
      setError(null);
      const updatedBirthday = { ...birthday, active: !birthday.active };
      
      // Update client
      await birthdayService.updateBirthday(updatedBirthday);
      
      // Sync with server
      try {
        await fetch('/api/birthdays', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedBirthday),
        });
      } catch (error) {
        console.error('Failed to sync with server:', error);
      }
      
      await loadBirthdays();
    } catch (err) {
      console.error('Failed to toggle birthday active state:', err);
      setError('Failed to toggle birthday active state. Please try again.');
    }
  };

  const updateReminderDays = async (id: string, days: number) => {
    try {
      setError(null);
      const birthday = birthdays.find(b => b.id === id);
      if (!birthday) {
        throw new Error('Birthday not found');
      }
      
      const updatedBirthday = { ...birthday, reminderDays: days };
      
      // Update client
      await birthdayService.updateBirthday(updatedBirthday);
      
      // Sync with server
      try {
        await fetch('/api/birthdays', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedBirthday),
        });
      } catch (error) {
        console.error('Failed to sync with server:', error);
      }
      
      await loadBirthdays();
    } catch (err) {
      console.error('Failed to update birthday reminder days:', err);
      setError('Failed to update birthday reminder days. Please try again.');
    }
  };

  const getDaysUntilBirthday = (birthdayDate: string) => {
    const today = new Date();
    const birthday = parseISO(birthdayDate);
    const nextBirthday = addYears(birthday, Math.ceil(differenceInDays(today, birthday) / 365));
    return differenceInDays(nextBirthday, today);
  };

  const sortedBirthdays = [...birthdays].sort((a, b) => {
    const daysA = getDaysUntilBirthday(a.date);
    const daysB = getDaysUntilBirthday(b.date);
    return daysA - daysB;
  });

  const upcomingBirthdays = sortedBirthdays.filter(
    (birthday) => {
      const days = getDaysUntilBirthday(birthday.date);
      return days >= 0 && days <= settings.reminderDays;
    }
  );

  const groupedBirthdays = sortedBirthdays.reduce((groups, birthday) => {
    const daysUntil = getDaysUntilBirthday(birthday.date);
    if (daysUntil <= 60) { // Less than 2 months
      groups.soon.push(birthday);
    } else if (daysUntil <= 180) { // Less than 6 months
      groups.nearFuture.push(birthday);
    } else if (daysUntil <= 240) { // Less than 8 months
      groups.calm.push(birthday);
    } else {
      groups.later.push(birthday);
    }
    return groups;
  }, {
    soon: [] as Birthday[],
    nearFuture: [] as Birthday[],
    calm: [] as Birthday[],
    later: [] as Birthday[]
  });

  const BirthdayCard = ({ birthday, category }: { birthday: Birthday; category: 'soon' | 'nearFuture' | 'calm' | 'later' }) => {
    const { toast } = useToast();
    const [showDetails, setShowDetails] = useState(false);
    const categoryStyles = {
      soon: {
        card: "bg-red-50 border-red-200",
        icon: "text-red-500",
        days: "text-red-600 bg-red-100",
        title: "text-red-800",
        text: "text-red-700",
        button: "hover:bg-red-100"
      },
      nearFuture: {
        card: "bg-orange-50 border-orange-200",
        icon: "text-orange-500",
        days: "text-orange-600 bg-orange-100",
        title: "text-orange-800",
        text: "text-orange-700",
        button: "hover:bg-orange-100"
      },
      calm: {
        card: "bg-green-50 border-green-200",
        icon: "text-green-500",
        days: "text-green-600 bg-green-100",
        title: "text-green-800",
        text: "text-green-700",
        button: "hover:bg-green-100"
      },
      later: {
        card: "bg-gray-50 border-gray-200",
        icon: "text-gray-500",
        days: "text-gray-600 bg-gray-100",
        title: "text-gray-800",
        text: "text-gray-600",
        button: "hover:bg-gray-100"
      }
    };

    const styles = categoryStyles[category];

    const handleUpdateField = async (field: keyof Birthday, value: string | number) => {
      try {
        const updatedBirthday = { ...birthday, [field]: value };
        await birthdayService.updateBirthday(updatedBirthday);
        
        // Sync with server
        try {
          await fetch('/api/birthdays', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedBirthday),
          });
        } catch (error) {
          console.error('Failed to sync with server:', error);
        }

        toast({
          title: "Erfolgreich aktualisiert",
          description: "Die Änderungen wurden gespeichert.",
        });

        // Reload birthdays
        loadBirthdays();
      } catch (error) {
        toast({
          title: "Fehler",
          description: "Die Änderungen konnten nicht gespeichert werden.",
          variant: "destructive",
        });
      }
    };

    return (
      <div
        className={`${styles.card} border rounded-lg shadow-sm transition-all duration-200 hover:shadow-md`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${styles.days} ${styles.icon}`}>
                <MdCake className="text-2xl" />
              </div>
              <div>
                <h3 className={`font-semibold text-lg ${styles.title}`}>{birthday.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-sm ${styles.text}`}>
                    {format(parseISO(birthday.date), 'dd.MM.yyyy')}
                  </span>
                  <span className={`text-sm ${styles.text}`}>•</span>
                  <span className={`text-sm ${styles.text}`}>
                    {differenceInYears(new Date(), parseISO(birthday.date))} Jahre
                  </span>
                  <span className={`text-sm px-2 py-1 rounded-full ${styles.days} font-medium`}>
                    in {getDaysUntilBirthday(birthday.date)} Tagen
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleToggleActive(birthday)}
                className={`p-2 rounded transition-colors ${styles.button} ${
                  birthday.active ? styles.icon : 'text-gray-400'
                }`}
              >
                <MdNotifications className="text-xl" />
              </button>
              <button
                onClick={() => handleDelete(birthday.id)}
                className={`p-2 text-red-600 rounded transition-colors hover:bg-red-50`}
              >
                <MdDelete className="text-xl" />
              </button>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`p-2 rounded transition-colors ${styles.button}`}
              >
                {showDetails ? <MdClose className="text-xl" /> : <MdEdit className="text-xl" />}
              </button>
            </div>
          </div>

          {showDetails && (
            <div className="mt-4 space-y-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Erinnerung (Tage im Voraus)</Label>
                  <Input
                    type="number"
                    value={birthday.reminderDays}
                    onChange={(e) => handleUpdateField('reminderDays', parseInt(e.target.value))}
                    min={1}
                    max={30}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Interessen und Hobbys</Label>
                <div className={`mt-1 ${styles.text}`}>
                  <EditableField
                    value={birthday.interests || ''}
                    onSave={(value) => handleUpdateField('interests', value)}
                    type="textarea"
                    placeholder="Füge Interessen und Hobbys hinzu..."
                  />
                </div>
              </div>

              <div>
                <Label>Notizen</Label>
                <div className={`mt-1 ${styles.text}`}>
                  <EditableField
                    value={birthday.notes || ''}
                    onSave={(value) => handleUpdateField('notes', value)}
                    type="textarea"
                    placeholder="Füge persönliche Notizen hinzu..."
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
          <button 
            onClick={loadBirthdays}
            className="ml-4 text-sm underline hover:no-underline"
          >
            Versuchen Sie es erneut
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {/* Birthday List */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
          Geburtstage
          <span className="text-sm font-normal text-gray-500 ml-4">
            {birthdays.length} Einträge
          </span>
        </h1>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {upcomingBirthdays.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mb-8">
                <h3 className="font-semibold text-yellow-800 text-lg mb-4">
                  🎉 Anstehende Geburtstage
                </h3>
                <ul className="space-y-2">
                  {upcomingBirthdays.map((birthday) => (
                    <li key={birthday.id} className="text-yellow-700 flex items-center space-x-2">
                      <MdCake className="text-yellow-500" />
                      <span>{birthday.name}</span>
                      <span className="text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full text-sm">
                        in {getDaysUntilBirthday(birthday.date)} Tagen
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Demnächst (< 2 months) */}
            {groupedBirthdays.soon.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-red-600 flex items-center">
                  <span className="bg-red-100 p-1 rounded-lg mr-2">🔥</span>
                  Demnächst
                </h3>
                <div className="space-y-3">
                  {groupedBirthdays.soon.map(birthday => (
                    <BirthdayCard key={birthday.id} birthday={birthday} category="soon" />
                  ))}
                </div>
              </div>
            )}

            {/* In naher Zukunft (< 6 months) */}
            {groupedBirthdays.nearFuture.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-orange-600 flex items-center">
                  <span className="bg-orange-100 p-1 rounded-lg mr-2">📅</span>
                  In naher Zukunft
                </h3>
                <div className="space-y-3">
                  {groupedBirthdays.nearFuture.map(birthday => (
                    <BirthdayCard key={birthday.id} birthday={birthday} category="nearFuture" />
                  ))}
                </div>
              </div>
            )}

            {/* Ruhe (< 8 months) */}
            {groupedBirthdays.calm.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-green-600 flex items-center">
                  <span className="bg-green-100 p-1 rounded-lg mr-2">🌿</span>
                  Ruhe
                </h3>
                <div className="space-y-3">
                  {groupedBirthdays.calm.map(birthday => (
                    <BirthdayCard key={birthday.id} birthday={birthday} category="calm" />
                  ))}
                </div>
              </div>
            )}

            {/* Rest of the year */}
            {groupedBirthdays.later.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-600 flex items-center">
                  <span className="bg-gray-100 p-1 rounded-lg mr-2">⏳</span>
                  Später im Jahr
                </h3>
                <div className="space-y-3">
                  {groupedBirthdays.later.map(birthday => (
                    <BirthdayCard key={birthday.id} birthday={birthday} category="later" />
                  ))}
                </div>
              </div>
            )}

            {birthdays.length === 0 && (
              <div className="text-gray-500 text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <MdCake className="text-4xl mx-auto mb-4 text-gray-400" />
                <p className="text-lg">Noch keine Geburtstage eingetragen.</p>
                <p className="text-sm text-gray-400 mt-1">Füge deinen ersten Geburtstag hinzu!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Birthday Form */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <div className="bg-white p-2 rounded-lg shadow-sm mr-3">
              <MdAdd className="text-pink-500 text-2xl" />
            </div>
            Neuen Geburtstag hinzufügen
          </h2>
          <p className="text-gray-600 mt-2">Füge einen neuen Geburtstag hinzu und verpasse kein gratis Buffet mehr.</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">Name</Label>
              <div className="relative">
                <Input
                  id="name"
                  {...register('name', { required: 'Name ist erforderlich' })}
                  className="pl-10"
                  placeholder="Name der Person"
                />
                <MdCake className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-gray-700">Geburtsdatum</Label>
              <Controller
                control={control}
                name="date"
                rules={{ required: 'Datum ist erforderlich' }}
                render={({ field }) => (
                  <div className="relative">
                    <DatePicker
                      id="date"
                      selected={field.value ? parseISO(field.value) : null}
                      onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                      dateFormat="dd.MM.yyyy"
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholderText="Wähle ein Datum"
                      showYearDropdown
                      yearDropdownItemNumber={100}
                      scrollableYearDropdown
                    />
                    <MdNotifications className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  </div>
                )}
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests" className="text-gray-700">Interessen und Hobbys</Label>
            <div className="relative">
              <Textarea
                id="interests"
                {...register('interests')}
                placeholder="Füge Interessen und Hobbys hinzu, um personalisierte Geschenkvorschläge zu erhalten"
                className="pl-10 min-h-[100px]"
              />
              <MdEdit className="absolute left-3 top-3 text-gray-400 text-lg" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-700">Notizen</Label>
            <div className="relative">
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Füge persönliche Notizen hinzu"
                className="pl-10 min-h-[100px]"
              />
              <MdEdit className="absolute left-3 top-3 text-gray-400 text-lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="reminderDays" className="text-gray-700">Erinnerung (Tage im Voraus)</Label>
              <div className="relative">
                <Input
                  type="number"
                  id="reminderDays"
                  {...register('reminderDays', {
                    required: 'Erinnerungstage sind erforderlich',
                    min: { value: 1, message: 'Mindestens 1 Tag' },
                    max: { value: 30, message: 'Maximal 30 Tage' }
                  })}
                  className="pl-10"
                  min={1}
                  max={30}
                />
                <MdNotifications className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              </div>
              {errors.reminderDays && (
                <p className="text-red-500 text-sm">{errors.reminderDays.message}</p>
              )}
            </div>

            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-2.5"
              >
                <MdAdd className="mr-2 text-lg" />
                Geburtstag hinzufügen
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = `
  .calendar-portal {
    position: relative;
    z-index: 9999;
  }

  .calendar-portal .react-datepicker-popper {
    z-index: 9999;
  }

  .react-datepicker-wrapper {
    position: relative;
    z-index: 9999;
  }

  .react-datepicker-popper {
    z-index: 9999 !important;
  }

  .react-datepicker {
    font-family: inherit;
    border: 1px solid rgba(147, 51, 234, 0.2);
    border-radius: 0.5rem;
    background-color: white;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .react-datepicker__header {
    background: linear-gradient(to right, rgba(147, 51, 234, 0.1), rgba(219, 39, 119, 0.1));
    border-bottom: 1px solid rgba(147, 51, 234, 0.2);
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    padding-top: 0.5rem;
  }

  .react-datepicker__current-month {
    color: rgb(88, 28, 135);
    font-weight: 600;
  }

  .react-datepicker__day-name {
    color: rgb(107, 114, 128);
  }

  .react-datepicker__day {
    border-radius: 0.375rem;
    transition: all 0.2s;
  }

  .react-datepicker__day:hover {
    background: rgba(147, 51, 234, 0.1);
    border-radius: 0.375rem;
  }

  .react-datepicker__day--selected {
    background: linear-gradient(to right, rgb(147, 51, 234), rgb(219, 39, 119)) !important;
    border-radius: 0.375rem;
  }

  .react-datepicker__day--keyboard-selected {
    background: rgba(147, 51, 234, 0.2);
    border-radius: 0.375rem;
  }

  .react-datepicker__navigation-icon::before {
    border-color: rgb(147, 51, 234);
  }

  .react-datepicker__year-dropdown,
  .react-datepicker__month-dropdown {
    background-color: white;
    border: 1px solid rgba(147, 51, 234, 0.2);
    border-radius: 0.375rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .react-datepicker__year-option:hover,
  .react-datepicker__month-option:hover {
    background: rgba(147, 51, 234, 0.1);
  }

  .react-datepicker__year-option--selected,
  .react-datepicker__month-option--selected {
    background: linear-gradient(to right, rgb(147, 51, 234), rgb(219, 39, 119));
    color: white;
  }

  /* Dark mode styles */
  @media (prefers-color-scheme: dark) {
    .react-datepicker {
      background-color: rgb(31, 41, 55);
      border-color: rgba(147, 51, 234, 0.3);
    }

    .react-datepicker__header {
      background: linear-gradient(to right, rgba(147, 51, 234, 0.2), rgba(219, 39, 119, 0.2));
      border-color: rgba(147, 51, 234, 0.3);
    }

    .react-datepicker__current-month,
    .react-datepicker__day {
      color: rgb(226, 232, 240);
    }

    .react-datepicker__day-name {
      color: rgb(156, 163, 175);
    }

    .react-datepicker__day:hover {
      background: rgba(147, 51, 234, 0.2);
      color: white;
    }

    .react-datepicker__year-dropdown,
    .react-datepicker__month-dropdown {
      background-color: rgb(31, 41, 55);
      border-color: rgba(147, 51, 234, 0.3);
    }

    .react-datepicker__year-option,
    .react-datepicker__month-option {
      color: rgb(226, 232, 240);
    }

    .react-datepicker__year-option:hover,
    .react-datepicker__month-option:hover {
      background: rgba(147, 51, 234, 0.2);
    }
  }
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}
