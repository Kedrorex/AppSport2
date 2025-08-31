import { create } from 'zustand';
import { Training } from '../types';

interface TrainingsState {
  trainings: Training[];
  loading: boolean;
  error: string | null;
  setTrainings: (trainings: Training[]) => void;
  addTraining: (training: Training) => void;
  updateTraining: (training: Training) => void;
  removeTraining: (id: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
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
}));