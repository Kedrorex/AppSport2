import api from './client';
import type { Exercise } from '../types';

// CRUD операции для упражнений
export const exercisesApi = {
  // Получить все упражнения
  getAll: async (): Promise<Exercise[]> => {
    const response = await api.get<Exercise[]>('/api/exercises');
    return response.data;
  },

  // Получить упражнение по ID
  getById: async (id: number): Promise<Exercise> => {
    const response = await api.get<Exercise>(`/api/exercises/${id}`);
    return response.data;
  },

  // Создать новое упражнение
  create: async (exercise: Omit<Exercise, 'id' | 'createdAt'>): Promise<Exercise> => {
    const response = await api.post<Exercise>('/api/exercises', exercise);
    return response.data;
  },

  // Обновить упражнение
  update: async (id: number, exercise: Partial<Omit<Exercise, 'id' | 'createdAt'>>): Promise<Exercise> => {
    const response = await api.put<Exercise>(`/api/exercises/${id}`, exercise);
    return response.data;
  },

  // Удалить упражнение
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/exercises/${id}`);
  },

  // Поиск упражнений
  search: async (params: { name?: string; muscleGroup?: string }): Promise<Exercise[]> => {
    const queryParams = new URLSearchParams();
    if (params.name) queryParams.append('name', params.name);
    if (params.muscleGroup) queryParams.append('muscleGroup', params.muscleGroup);
    
    const response = await api.get<Exercise[]>(`/api/exercises/search?${queryParams.toString()}`);
    return response.data;
  }
};