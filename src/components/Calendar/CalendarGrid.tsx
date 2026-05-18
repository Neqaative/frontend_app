import React from 'react';
import { CalendarEvent } from '../../types/calendar.types';
import { CalendarDay } from './CalendarDay';
import { getDaysInMonth } from '../../utils/dateUtils';
import { getEventsForDate } from '../../utils/calendarUtils';
import { CALENDAR_CONSTANTS } from '../../constants/calendar';

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  isViewingOwnCalendar: boolean;
  onAddEvent: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  events,
  isViewingOwnCalendar,
  onAddEvent,
  onEventClick,
}) => {
  const days = getDaysInMonth(currentDate);

  return (
    <div className="calendar-grid">
      {CALENDAR_CONSTANTS.DAYS_OF_WEEK.map((day) => (
        <div key={day} className="calendar-day-header">
          {day}
        </div>
      ))}
      {days.map((day, index) => {
        const dayEvents = getEventsForDate(events, day.date);
        return (
          <CalendarDay
            key={index}
            date={day.date}
            isCurrentMonth={day.isCurrentMonth}
            events={dayEvents}
            isViewingOwnCalendar={isViewingOwnCalendar}
            onAddEvent={onAddEvent}
            onEventClick={onEventClick}
          />
        );
      })}
    </div>
  );
};
