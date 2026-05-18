import { CalendarEvent } from '../types/calendar.types';
import { getDateOnly } from './dateUtils';

export const getEventsForDate = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  const dateOnly = getDateOnly(date);
  
  return events.filter((event) => {
    const eventStart = new Date(event.start_date);
    const eventStartOnly = getDateOnly(eventStart);
    
    const eventEnd = new Date(event.end_date);
    const eventEndOnly = getDateOnly(eventEnd);
    
    return dateOnly >= eventStartOnly && dateOnly <= eventEndOnly;
  });
};

export const isWeekend = (date: Date): boolean => {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};
