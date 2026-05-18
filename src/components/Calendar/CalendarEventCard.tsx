import React from 'react';
import { CalendarEvent } from '../../types/calendar.types';
import { EVENT_TYPE_LABELS, EVENT_TYPE_COLORS } from '../../constants/eventTypes';

interface CalendarEventCardProps {
  event: CalendarEvent;
  onClick?: () => void;
}

export const CalendarEventCard: React.FC<CalendarEventCardProps> = ({ event, onClick }) => {
  return (
    <div
      className="calendar-event-card"
      style={{ 
        backgroundColor: EVENT_TYPE_COLORS[event.type],
      }}
      onClick={onClick}
    >
      <div className="calendar-event-card-header">
        {event.type === 'OTHER' && event.title ? event.title : EVENT_TYPE_LABELS[event.type]}
      </div>
      {event.location && (
        <div className="calendar-event-location">
          📍 {event.location}
        </div>
      )}
      {event.description && (
        <div className="calendar-event-description">
          {event.description}
        </div>
      )}
    </div>
  );
};
