import { create } from 'zustand';
import { trainingsApi } from '../api/trainings';
import type { Training, WorkoutExercise } from '../types';

interface TrainingsState {
  trainings: Training[];
  loading: boolean;
  error: string | null;
  
  // Синхронные операции
  setTrainings: (trainings: Training[]) => void;
  addTraining: (training: Training) => void;
  updateTraining: (training: Training) => void;
  removeTraining: (id: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Асинхронные операции с API
  fetchTrainings: () => Promise<void>;
  createTraining: (training: Omit<Training, 'id' | 'createdAt' | 'workoutExercises'>) => Promise<Training | null>;
  updateTrainingAsync: (id: number, training: Partial<Omit<Training, 'id' | 'createdAt' | 'workoutExercises'>>) => Promise<Training | null>;
  deleteTrainingAsync: (id: number) => Promise<boolean>;
  addExerciseToTraining: (workoutId: number, exerciseData: {
    exerciseId: number;
    sets: number;
    reps: number;
    weight?: number;
  }) => Promise<WorkoutExercise | null>;
}

export const useTrainingsStore = create<TrainingsState>((set) => ({
  trainings: [],
  loading: false,
  error: null,
  
  setTrainings: (trainings) => set({ trainings }),
  
  addTraining: (training) => 
    set((state) => ({ 
      trainings: [...state.trainings, training] 
    })),
  
  updateTraining: (updatedTraining) =>
    set((state) => ({
      trainings: state.trainings.map(training =>
        training.id === updatedTraining.id ? updatedTraining : training
      )
    })),
  
  removeTraining: (id) =>
    set((state) => ({
      trainings: state.trainings.filter(training => training.id !== id)
    })),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  // Асинхронные операции
  fetchTrainings: async () => {
    try {
      set({ loading: true, error: null });
      const trainings = await trainingsApi.getAll();
      set({ trainings, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки тренировок';
      set({ error: errorMessage, loading: false });
    }
  },
  
  createTraining: async (trainingData) => {
    try {
      set({ loading: true, error: null });
      const training = await trainingsApi.create(trainingData);
      set((state) => ({ 
        trainings: [...state.trainings, training],
        loading: false 
      }));
      return training;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка создания тренировки';
      set({ error: errorMessage, loading: false });
      return null;
    }
  },
  
  updateTrainingAsync: async (id, trainingData) => {
    try {
      set({ loading: true, error: null });
      const training = await trainingsApi.update(id, trainingData);
      set((state) => ({
        trainings: state.trainings.map(t => t.id === id ? training : t),
        loading: false
      }));
      return training;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка обновления тренировки';
      set({ error: errorMessage, loading: false });
      return null;
    }
  },
  
  deleteTrainingAsync: async (id) => {
    try {
      set({ loading: true, error: null });
      await trainingsApi.delete(id);
      set((state) => ({
        trainings: state.trainings.filter(training => training.id !== id),
        loading: false
      }));
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка удаления тренировки';
      set({ error: errorMessage, loading: false });
      return false;
    }
  },
  
  addExerciseToTraining: async (workoutId, exerciseData) => {
    try {
      set({ loading: true, error: null });
      const workoutExercise = await trainingsApi.addExercise(workoutId, exerciseData);
      
      // Обновляем тренировку в состоянии
      set((state) => ({
        trainings: state.trainings.map(training => {
          if (training.id === workoutId) {
            return {
              ...training,
              workoutExercises: [...(training.workoutExercises || []), workoutExercise]
            };
          }
          return training;
        }),
        loading: false
      }));
      
      return workoutExercise;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка добавления упражнения';
      set({ error: errorMessage, loading: false });
      return null;
    }
  }
}));