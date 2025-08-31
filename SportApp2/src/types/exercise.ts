export interface Exercise {
  id: number;
  name: string;
  description?: string;
  muscleGroup: string;
  userId?: number;
  createdAt?: string;
}

export interface CreateExerciseRequest {
  name: string;
  description?: string;
  muscleGroup: string;
}