/**
 * Form labels and text constants
 * Centralized place for all form labels to ensure consistency
 * and easier localization in the future
 */

export const FORM_LABELS = {
  workName: 'ID pracy *',
  city: 'Miejscowość *',
  district: 'Jednostka ewid. *',
  region: 'Obręb *',
  parcelNumber: 'Obiekt *',
  operator: 'Osoba odpowiedzialna *',
  reportId: 'ID operatu',
  
  operatorUser: `Osoba odpowiedzialna (użytkownik) *`,
  status: 'Status *',
  statusNote: 'Status jest automatycznie ustawiony na "Zgłoszone" dla nowych prac',
  
  reportDate: 'Data zgłoszenia',
  notificationDate: 'Data wysłania zawiadomień',
  fieldworkDate: 'Data prac terenowych',
  completionDate: 'Data wykonania',
  readyDate: 'Data zgłoszenia gotowości',
  acceptanceDate: 'Data przyjęcia do zasobu',
  
  // Client fields
  client: 'Zleceniodawca *',
  clientName: 'Nazwa zleceniodawcy *',
  
  // User fields
  firstName: 'Imię',
  lastName: 'Nazwisko',
  email: 'Email',
  password: 'Hasło',
  newPassword: 'Nowe hasło (opcjonalne)',
  confirmPassword: 'Potwierdź hasło',
  
  // Team assignments
  teamAssignments: 'Przypisania zespołu',
  fieldworkers: 'Pracownicy terenowi',
  completers: 'Pracownicy kameralni',
  
  // Comments
  comments: 'Komentarze',
  additionalInfo: 'Dodatkowe informacje...',
  
  // Section headers
  basicInfo: 'Podstawowe informacje',
  dates: 'Daty',
    
  reportIdPlaceholder: 'np. RPT-2025-001',
  leaveEmptyToKeep: 'Zostaw puste aby nie zmieniać',
  
  selectClient: 'Wybierz zleceniodawcę',
  selectOperator: 'Wybierz osobę odpowiedzialną',

  noActiveUsers: 'Brak aktywnych użytkowników do przypisania',
  
  save: 'Zapisz',
  saveChanges: 'Zapisz zmiany',
  saving: 'Zapisywanie...',
  cancel: 'Anuluj',
  edit: 'Edytuj',
  delete: 'Usuń',
  deleteClient: 'Usuń klienta',
  add: 'Dodaj',
  addWork: 'Dodaj pracę',
  editWork: 'Edytuj pracę',
  editProfile: 'Edytuj profil',
  
  backToDashboard: 'Powrót do panelu',
  backToWork: 'Powrót do pracy',
  
  myTasks: 'Moje Zadania',
  tasksPageTitle: 'Moje Zadania',
  pendingTasks: 'Do wykonania',
  completedTasks: 'Wykonane',
  noTasks: 'Brak przypisanych zadań.',
  allTasksCompleted: 'Świetna robota!',
  allTasksCompletedMsg: 'Wszystkie zadania wykonane! 🎉',
  noCompletedTasks: 'Brak zakończonych zadań.',
  markAsCompleted: 'Oznacz jako wykonane',
  markAsPending: 'Przywróć zadanie',
  
  stage: 'ETAP',
  taskName: 'NAZWA',
  nameOfWork: 'PRACA',
  deadline: 'TERMIN',
  actions: 'AKCJE',
} as const;

export type FormLabel = typeof FORM_LABELS[keyof typeof FORM_LABELS];
