import { Status, WorkRole } from '../types';

/**
 * Get Polish label for work status
 */
export const getStatusLabel = (status: Status): string => {
  switch (status) {
    case Status.submitted:
      return 'Zgłoszona';
    case Status.under_review:
      return 'Analiza';
    case Status.field_work:
      return 'Prace terenowe';
    case Status.compilation:
      return 'Kompletacja';
    case Status.under_clause:
      return 'W klauzuli';
    case Status.correction:
      return 'Poprawa';
    case Status.classified:
      return 'Zaklauzulowany';
    case Status.delivered:
      return 'Przekazany';
    default:
      return String(status);
  }
};

/**
 * Get CSS class for status badge styling
 */
export const getStatusBadgeClass = (status: Status): string => {
  switch (status) {
    case Status.submitted:
      return 'status-submitted';
    case Status.under_review:
      return 'status-review';
    case Status.field_work:
      return 'status-fieldwork';
    case Status.compilation:
      return 'status-compilation';
    case Status.under_clause:
      return 'status-underclause';
    case Status.correction:
      return 'status-correction';
    case Status.classified:
      return 'status-classified';
    case Status.delivered:
      return 'status-delivered';
    default:
      return 'status-pending';
  }
};

/**
 * Get Polish label for work role
 */
export const getRoleLabel = (role: WorkRole): string => {
  return role === WorkRole.fieldworker ? 'Pracownik terenowy' : 'Pracownik kameralny';
};
