import { TrainingPage } from './TrainingPage';
import { useEffect } from 'react';
import { useExercisesStore } from '../../store/useExercisesStore';

export function TrainingComponent() {
  const { fetchExercises } = useExercisesStore();

  useEffect(() => {
    // Загружаем начальные данные
    fetchExercises();
  }, [fetchExercises]);

  return (
    <div>
      <TrainingPage />
    </div>
  );
}