import { create } from 'zustand';
import { Exercise } from '../types';

interface ExercisesState {
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
  setExercises: (exercises: Exercise[]) => void;
  addExercise: (exercise: Exercise) => void;
  updateExercise: (exercise: Exercise) => void;
  removeExercise: (id: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
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
}));