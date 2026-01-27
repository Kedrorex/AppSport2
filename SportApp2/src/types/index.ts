export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// Если у тебя есть другие типы, они тоже должны быть здесь
export interface Exercise {
  id: number;
  name: string;
  description?: string;
  muscleGroup?: string;
  exerciseType?: string;
  createdAt: string;
}

export interface ScheduledExercise {
  id: number;
  userId: number;
  workoutDate: string; // YYYY-MM-DD
  exerciseId: number;
  exerciseName: string;
  sets: number;
  reps: number;
  weight?: number;
  createdAt: string;
}

export interface ExerciseProgress {
  id: number;
  userId: number;
  exerciseId: number;
  exerciseName?: string;
  progressDate: string;
  bestWeight?: number;
  maxReps?: number;
  createdAt: string;
}