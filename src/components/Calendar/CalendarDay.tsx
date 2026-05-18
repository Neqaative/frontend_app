import React from 'react';
import { CalendarEvent } from '../../types/calendar.types';
import { CalendarEventCard } from './CalendarEventCard';
import { isToday } from '../../utils/dateUtils';
import { isWeekend } from '../../utils/calendarUtils';

interface CalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
  isViewingOwnCalendar: boolean;
  onAddEvent: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  isCurrentMonth,
  events,
  isViewingOwnCalendar,
  onAddEvent,
  onEventClick,
}) => {
  const weekend = isWeekend(date);
  const today = isToday(date);

  return (
    <div
      className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${
        today ? 'today' : ''
      } ${weekend ? 'weekend' : ''}`}
    >
      <div className="calendar-day-header-row">
        <div className="calendar-day-number">{date.getDate()}</div>
        {isViewingOwnCalendar && isCurrentMonth && (
          <button 
            className="calendar-day-add-btn"
            onClick={() => onAddEvent(date)}
            title="Dodaj wydarzenie"
          >
            +
          </button>
        )}
      </div>
      <div className="calendar-events-container">
        {events.map((event) => (
          <CalendarEventCard
            key={event.index}
            event={event}
            onClick={() => isViewingOwnCalendar && onEventClick(event)}
          />
        ))}
      </div>
    </div>
  );
};
