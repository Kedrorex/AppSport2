import { TrainingPage } from './TrainingPage';
import { useEffect } from 'react';
import { useTrainingsStore } from '../../store/useTrainingsStore';
import { useExercisesStore } from '../../store/useExercisesStore';

export function TrainingComponent() {
  const { fetchTrainings } = useTrainingsStore();
  const { fetchExercises } = useExercisesStore();

  useEffect(() => {
    // Загружаем начальные данные
    fetchTrainings();
    fetchExercises();
  }, [fetchTrainings, fetchExercises]);

  return (
    <div>
      <TrainingPage />
    </div>
  );
}