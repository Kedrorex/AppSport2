export interface TrainingExercise {
  id: number;
  exerciseId: number;
  sets: number;
  reps: number;
  weight: number;
}

export interface Training {
  id: number;
  name: string;
  date: string;
  isCompleted: boolean;
  userId: number;
  exercises: TrainingExercise[];
  createdAt?: string;
}

export interface CreateTrainingRequest {
  name: string;
  date: string;
  isCompleted: boolean;
  exercises: Omit<TrainingExercise, 'id'>[];
}