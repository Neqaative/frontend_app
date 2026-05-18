export const EVENT_TYPE_LABELS = {
  REMOTE_WORK: 'Praca zdalna',
  COURT_TRIP: 'Wyjazd do sądu',
  OFFICE_TRIP: 'Wyjazd do urzędu',
  PERSONAL_TRIP: 'Wyjazd własny',
  VACATION: 'Urlop',
  OTHER: 'Inne',
} as const;

export const EVENT_TYPE_COLORS = {
  REMOTE_WORK: '#10b981',
  COURT_TRIP: '#ef4444',
  OFFICE_TRIP: '#f59e0b',
  PERSONAL_TRIP: '#8b5cf6',
  VACATION: '#06b6d4',
  OTHER: '#6b7280',
} as const;
