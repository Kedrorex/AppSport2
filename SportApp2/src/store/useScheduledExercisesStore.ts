import { create } from 'zustand';
import { scheduledExercisesApi } from '../api/scheduledExercises';
import type { ScheduledExercise } from '../types';
import { formatDateForComparison } from '../utils/helpers';

interface ScheduledExercisesState {
  exercises: ScheduledExercise[];
  currentDate: string; // YYYY-MM-DD
  loading: boolean;
  error: string | null;

  // Month summary (date -> count)
  monthSummary: Record<string, number>;
  monthSummaryKey: string | null;
  monthSummaryLoading: boolean;
  monthSummaryError: string | null;

  // Синхронные операции
  setExercises: (exercises: ScheduledExercise[]) => void;
  addExerciseToState: (exercise: ScheduledExercise) => void;
  removeExercise: (id: number) => void;
  setCurrentDate: (date: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Асинхронные операции
  fetchExercisesForDate: (date: string) => Promise<void>;
  fetchMonthSummary: (from: string, to: string) => Promise<void>;
  addExercise: (exerciseData: AddScheduledExerciseData) => Promise<boolean>;
  deleteExercise: (id: number) => Promise<boolean>;
}

export interface AddScheduledExerciseData {
  workoutDate: string;
  exerciseId: number;
  sets: number;
  reps: number;
  weight?: number;
}


export const useScheduledExercisesStore = create<ScheduledExercisesState>((set, get) => ({
  exercises: [],
  currentDate: formatDateForComparison(new Date()),
  loading: false,
  error: null,

  monthSummary: {},
  monthSummaryKey: null,
  monthSummaryLoading: false,
  monthSummaryError: null,

  setExercises: (exercises) => set({ exercises }),

  addExerciseToState: (exercise) =>
    set((state) => ({
      exercises: [...state.exercises, exercise]
    })),

  removeExercise: (id) =>
    set((state) => ({
      exercises: state.exercises.filter(exercise => exercise.id !== id)
    })),

  setCurrentDate: (date) => set({ currentDate: date }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  // Асинхронные операции
  fetchExercisesForDate: async (date) => {
    try {
      set({ loading: true, error: null, currentDate: date });
      const exercises = await scheduledExercisesApi.getByDate(date);
      set({ exercises, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки упражнений';
      set({ error: errorMessage, loading: false });
    }
  },

  fetchMonthSummary: async (from, to) => {
    const key = `${from}|${to}`;
    if (get().monthSummaryKey === key && !get().monthSummaryError) {
      return;
    }

    try {
      set({ monthSummaryLoading: true, monthSummaryError: null, monthSummaryKey: key });

      const items = await scheduledExercisesApi.getSummary(from, to);

      // защитимся от race condition: применяем только если ключ всё ещё актуален
      if (get().monthSummaryKey !== key) return;

      const map: Record<string, number> = {};
      for (const item of items) {
        map[item.date] = item.count;
      }

      set({ monthSummary: map, monthSummaryLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки календаря';
      set({ monthSummaryError: errorMessage, monthSummaryLoading: false });
    }
  },

  addExercise: async (exerciseData) => {
    try {
      set({ loading: true, error: null });
      const exercise = await scheduledExercisesApi.create(exerciseData);
      set((state) => ({
        exercises: state.currentDate === exercise.workoutDate
          ? [...state.exercises, exercise]
          : state.exercises,
        loading: false
      }));
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка добавления упражнения';
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  deleteExercise: async (id) => {
    try {
      set({ loading: true, error: null });
      await scheduledExercisesApi.delete(id);
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
  }
}));
