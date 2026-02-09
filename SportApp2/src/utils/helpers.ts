// Утилиты для работы с датами
const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateForAPI = (date: Date): string => {
  return formatLocalDate(date);
};

export const formatDateForComparison = (date: Date | string): string => {
  if (typeof date === 'string') {
    return date;
  }
  return formatLocalDate(date);
};

// Сравнение дат в формате YYYY-MM-DD
export const datesEqual = (date1: string, date2: string): boolean => {
  return date1 === date2;
};

// Конвертация строки даты в объект Date для отображения
export const parseWorkoutDate = (dateString: string): Date => {
  return new Date(dateString + 'T00:00:00');
};
