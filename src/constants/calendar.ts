export const CALENDAR_CONSTANTS = {
  DAYS_OF_WEEK: ['Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'Sb', 'Nd'],
  DEFAULT_EVENT_TYPE: 'REMOTE_WORK' as const,
} as const;

export const CALENDAR_MESSAGES = {
  ERROR_LOADING_DATA: 'Błąd podczas ładowania danych',
  ERROR_LOADING_EVENTS: 'Błąd podczas ładowania wydarzeń',
  ERROR_SAVING_EVENT: 'Błąd podczas zapisywania wydarzenia',
  ERROR_DELETING_EVENT: 'Błąd podczas usuwania wydarzenia',
  ERROR_NO_PERMISSION_EDIT: 'Nie możesz edytować kalendarza innego użytkownika',
  ERROR_NO_PERMISSION_DELETE: 'Nie możesz usuwać wydarzeń innego użytkownika',
  SUCCESS_EVENT_CREATED: 'Wydarzenie zostało utworzone',
  SUCCESS_EVENT_UPDATED: 'Wydarzenie zostało zaktualizowane',
  SUCCESS_EVENT_DELETED: 'Wydarzenie zostało usunięte',
  CONFIRM_DELETE_TITLE: 'Potwierdź usunięcie',
  CONFIRM_DELETE_MESSAGE: 'Czy na pewno chcesz usunąć to wydarzenie?',
  NO_EVENTS: 'Brak wydarzeń w kalendarzu',
  LOADING: 'Ładowanie...',
} as const;
