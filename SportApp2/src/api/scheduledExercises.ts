import api from './client';
import type { ScheduledExercise } from '../types';

export interface AddScheduledExerciseRequest {
  workoutDate: string; // YYYY-MM-DD
  exerciseId: number;
  sets: number;
  reps: number;
  weight?: number;
}

export interface ScheduledExerciseSummaryItem {
  date: string; // YYYY-MM-DD
  count: number;
}

export const scheduledExercisesApi = {
  // Получить запланированные упражнения за дату
  getByDate: async (date: string): Promise<ScheduledExercise[]> => {
    const response = await api.get<ScheduledExercise[]>(`/api/exercises/scheduled?date=${date}`);
    return response.data;
  },

  // Получить summary за диапазон (inclusive)
  getSummary: async (from: string, to: string): Promise<ScheduledExerciseSummaryItem[]> => {
    const response = await api.get<ScheduledExerciseSummaryItem[]>(
      `/api/exercises/scheduled/summary?from=${from}&to=${to}`
    );
    return response.data;
  },

  // Добавить запланированное упражнение
  create: async (exerciseData: AddScheduledExerciseRequest): Promise<ScheduledExercise> => {
    const response = await api.post<ScheduledExercise>('/api/exercises/scheduled', exerciseData);
    return response.data;
  },

  // Удалить запланированное упражнение
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/exercises/scheduled/${id}`);
  },
};