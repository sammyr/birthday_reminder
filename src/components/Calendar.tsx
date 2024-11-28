import { useState } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { Birthday } from '@/lib/birthday-db';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarProps {
  birthdays: Birthday[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export default function Calendar({ birthdays, selectedDate, onSelectDate }: CalendarProps) {
  const [view, setView] = useState('month');

  const events = birthdays.map((birthday) => {
    const date = new Date(birthday.date);
    return {
      id: birthday.id,
      title: birthday.name,
      start: date,
      end: date,
      allDay: true,
    };
  });

  const handleSelectSlot = ({ start }: { start: Date }) => {
    onSelectDate(start);
  };

  return (
    <div className="h-[500px]">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        view={view as any}
        onView={(newView) => setView(newView)}
        selectable
        onSelectSlot={handleSelectSlot}
        toolbar={true}
        popup
        formats={{
          dateFormat: 'dd',
          dayFormat: 'dd.MM.',
          monthHeaderFormat: 'MMMM yyyy',
          dayHeaderFormat: 'dd.MM.yyyy',
          dayRangeHeaderFormat: ({ start, end }) =>
            `${format(start, 'dd.MM.yyyy')} - ${format(end, 'dd.MM.yyyy')}`,
        }}
        messages={{
          today: 'Heute',
          previous: 'Zurück',
          next: 'Vor',
          month: 'Monat',
          week: 'Woche',
          day: 'Tag',
          agenda: 'Agenda',
          date: 'Datum',
          time: 'Zeit',
          event: 'Ereignis',
          showMore: (total) => `+${total} mehr`,
        }}
      />
    </div>
  );
}
