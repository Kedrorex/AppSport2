import api from './axios';
import type { Training, WorkoutExercise, ExerciseProgress } from '../types';

// CRUD операции для тренировок
export const trainingsApi = {
  // Получить все тренировки пользователя
  getAll: async (): Promise<Training[]> => {
    const response = await api.get<Training[]>('/api/workouts');
    return response.data;
  },

  // Получить тренировку по ID
  getById: async (id: number): Promise<Training> => {
    const response = await api.get<Training>(`/api/workouts/${id}`);
    return response.data;
  },

  // Создать новую тренировку
  create: async (training: Omit<Training, 'id' | 'createdAt' | 'workoutExercises'>): Promise<Training> => {
    const response = await api.post<Training>('/api/workouts', training);
    return response.data;
  },

  // Обновить тренировку
  update: async (id: number, training: Partial<Omit<Training, 'id' | 'createdAt' | 'workoutExercises'>>): Promise<Training> => {
    const response = await api.put<Training>(`/api/workouts/${id}`, training);
    return response.data;
  },

  // Удалить тренировку
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/workouts/${id}`);
  },

  // Добавить упражнение к тренировке
  addExercise: async (workoutId: number, exerciseData: {
    exerciseId: number;
    sets: number;
    reps: number;
    weight?: number;
  }): Promise<WorkoutExercise> => {
    const response = await api.post<WorkoutExercise>(
      `/api/workouts/${workoutId}/exercises`,
      null,
      { params: exerciseData }
    );
    return response.data;
  },

  // Получить прогресс пользователя
  getProgress: async (): Promise<ExerciseProgress[]> => {
    const response = await api.get<ExerciseProgress[]>('/api/progress');
    return response.data;
  },

  // Создать/обновить прогресс
  createProgress: async (exerciseId: number, bestWeight?: number, maxReps?: number): Promise<ExerciseProgress> => {
    const params = new URLSearchParams();
    params.append('exerciseId', exerciseId.toString());
    if (bestWeight !== undefined) params.append('bestWeight', bestWeight.toString());
    if (maxReps !== undefined) params.append('maxReps', maxReps.toString());
    
    const response = await api.post<ExerciseProgress>(`/api/progress?${params.toString()}`);
    return response.data;
  }
};