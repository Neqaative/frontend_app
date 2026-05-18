export interface CalendarEvent {
  index: number;
  title: string;
  type: 'REMOTE_WORK' | 'COURT_TRIP' | 'OFFICE_TRIP' | 'PERSONAL_TRIP' | 'VACATION' | 'OTHER';
  description?: string;
  start_date: string;
  end_date: string;
  location?: string;
  all_day: boolean;
}

export interface CreateEventDto {
  title: string;
  type: 'REMOTE_WORK' | 'COURT_TRIP' | 'OFFICE_TRIP' | 'PERSONAL_TRIP' | 'VACATION' | 'OTHER';
  description?: string;
  start_date: string;
  end_date: string;
  location?: string;
  all_day?: boolean;
}

export interface UpdateEventDto {
  title?: string;
  type?: 'REMOTE_WORK' | 'COURT_TRIP' | 'OFFICE_TRIP' | 'PERSONAL_TRIP' | 'VACATION' | 'OTHER';
  description?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  all_day?: boolean;
}

export type EventType = 'REMOTE_WORK' | 'COURT_TRIP' | 'OFFICE_TRIP' | 'PERSONAL_TRIP' | 'VACATION' | 'OTHER';
