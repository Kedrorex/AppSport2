import { create } from 'zustand';
import { exercisesApi } from '../api/exercises';
import type { Exercise } from '../types';

interface ExercisesState {
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
  
  // Синхронные операции
  setExercises: (exercises: Exercise[]) => void;
  addExercise: (exercise: Exercise) => void;
  updateExercise: (exercise: Exercise) => void;
  removeExercise: (id: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Асинхронные операции с API
  fetchExercises: () => Promise<void>;
  createExercise: (exercise: Omit<Exercise, 'id' | 'createdAt'>) => Promise<Exercise | null>;
  updateExerciseAsync: (id: number, exercise: Partial<Omit<Exercise, 'id' | 'createdAt'>>) => Promise<Exercise | null>;
  deleteExerciseAsync: (id: number) => Promise<boolean>;
  searchExercises: (params: { name?: string; muscleGroup?: string }) => Promise<Exercise[]>;
}

export const useExercisesStore = create<ExercisesState>((set) => ({
  exercises: [],
  loading: false,
  error: null,
  
  setExercises: (exercises) => set({ exercises }),
  
  addExercise: (exercise) => 
    set((state) => ({ 
      exercises: [...state.exercises, exercise] 
    })),
  
  updateExercise: (updatedExercise) =>
    set((state) => ({
      exercises: state.exercises.map(exercise =>
        exercise.id === updatedExercise.id ? updatedExercise : exercise
      )
    })),
  
  removeExercise: (id) =>
    set((state) => ({
      exercises: state.exercises.filter(exercise => exercise.id !== id)
    })),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  // Асинхронные операции
  fetchExercises: async () => {
    try {
      set({ loading: true, error: null });
      const exercises = await exercisesApi.getAll();
      set({ exercises, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки упражнений';
      set({ error: errorMessage, loading: false });
    }
  },
  
  createExercise: async (exerciseData) => {
    try {
      set({ loading: true, error: null });
      const exercise = await exercisesApi.create(exerciseData);
      set((state) => ({ 
        exercises: [...state.exercises, exercise],
        loading: false 
      }));
      return exercise;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка создания упражнения';
      set({ error: errorMessage, loading: false });
      return null;
    }
  },
  
  updateExerciseAsync: async (id, exerciseData) => {
    try {
      set({ loading: true, error: null });
      const exercise = await exercisesApi.update(id, exerciseData);
      set((state) => ({
        exercises: state.exercises.map(ex => ex.id === id ? exercise : ex),
        loading: false
      }));
      return exercise;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка обновления упражнения';
      set({ error: errorMessage, loading: false });
      return null;
    }
  },
  
  deleteExerciseAsync: async (id) => {
    try {
      set({ loading: true, error: null });
      await exercisesApi.delete(id);
      set((state) => ({
        exercises: state.exercises.filter(exercise => exercise.id !== id),
        loading: false
      }));
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка удаления упражнения';
      set({ error: errorMessage, loading: false });
      return false;
    }
  },
  
  searchExercises: async (params) => {
    try {
      set({ loading: true, error: null });
      const exercises = await exercisesApi.search(params);
      set({ loading: false });
      return exercises;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка поиска упражнений';
      set({ error: errorMessage, loading: false });
      return [];
    }
  }
}));