// Утилиты для работы с датами
export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatDateForComparison = (date: Date | string): string => {
  if (typeof date === 'string') {
    return date;
  }
  return date.toISOString().split('T')[0];
};

// Сравнение дат в формате YYYY-MM-DD
export const datesEqual = (date1: string, date2: string): boolean => {
  return date1 === date2;
};

// Конвертация строки даты в объект Date для отображения
export const parseWorkoutDate = (dateString: string): Date => {
  return new Date(dateString + 'T00:00:00');
};