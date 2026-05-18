/**
 * Date formatting utilities
 */


export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return 'Brak daty';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'Nieprawidłowa data';
    return dateObj.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return 'Nieprawidłowa data';
  }
};

export const formatDateShort = (date: Date | string | undefined): string => {
  if (!date) return 'Brak daty';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'Nieprawidłowa data';
    return dateObj.toLocaleDateString('pl-PL');
  } catch (error) {
    return 'Nieprawidłowa data';
  }
};


export const formatDateMonthYear = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return 'Brak daty';
  return dateObj.toLocaleDateString('pl-PL', { 
    day: 'numeric',
    month: 'long', 
    year: 'numeric' 
  });
};

export const formatDateForInput = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().split('T')[0];
};
