import { useState } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { Birthday } from '@/pages/index';
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
  const events = birthdays.map(birthday => ({
    id: birthday.id,
    title: birthday.name,
    start: new Date(birthday.date),
    end: new Date(birthday.date),
    allDay: true,
  }));

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-xl p-6 border border-purple-100 dark:bg-gray-800/80 dark:border-gray-700">
      <div className="h-[600px]">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          views={['month']}
          defaultView="month"
          selectable
          onSelectSlot={({ start }) => onSelectDate(start)}
          selected={selectedDate}
          className="birthday-calendar"
        />
      </div>
      <style jsx global>{`
        .birthday-calendar {
          background: transparent !important;
          border: none !important;
        }
        .birthday-calendar .rbc-header {
          padding: 10px;
          background: rgba(147, 51, 234, 0.1);
          color: rgb(88, 28, 135);
          font-weight: 600;
          border: none;
        }
        .birthday-calendar .rbc-month-view {
          border: 1px solid rgba(147, 51, 234, 0.2);
          border-radius: 8px;
          overflow: hidden;
        }
        .birthday-calendar .rbc-day-bg {
          transition: all 0.2s;
        }
        .birthday-calendar .rbc-day-bg:hover {
          background: rgba(147, 51, 234, 0.05);
        }
        .birthday-calendar .rbc-today {
          background: rgba(147, 51, 234, 0.1);
        }
        .birthday-calendar .rbc-event {
          background: linear-gradient(to right, rgb(147, 51, 234), rgb(219, 39, 119));
          border: none;
          border-radius: 4px;
          padding: 2px 5px;
          color: white;
          font-size: 0.875rem;
        }
        .birthday-calendar .rbc-off-range-bg {
          background: rgba(0, 0, 0, 0.03);
        }
        .birthday-calendar .rbc-date-cell {
          padding: 4px;
          font-weight: 500;
        }
        @media (prefers-color-scheme: dark) {
          .birthday-calendar .rbc-header {
            background: rgba(147, 51, 234, 0.2);
            color: rgb(216, 180, 254);
          }
          .birthday-calendar .rbc-month-view {
            border-color: rgba(147, 51, 234, 0.3);
          }
          .birthday-calendar .rbc-off-range-bg {
            background: rgba(255, 255, 255, 0.03);
          }
          .birthday-calendar .rbc-day-bg {
            color: white;
          }
          .birthday-calendar .rbc-day-bg:hover {
            background: rgba(147, 51, 234, 0.1);
          }
          .birthday-calendar .rbc-today {
            background: rgba(147, 51, 234, 0.2);
          }
          .birthday-calendar .rbc-date-cell {
            color: rgb(216, 180, 254);
          }
        }
      `}</style>
    </div>
  );
}
