import { useState, useEffect } from 'react';
import {
  Modal,
  Select,
  NumberInput,
  Button,
  Group,
  Box
} from '@mantine/core';
import { useExercisesStore } from '../../store/useExercisesStore';

interface AddExerciseModalProps {
  opened: boolean;
  onClose: () => void;
  onAdd: (exerciseId: number, sets: number, reps: number, weight?: number) => void;
  workoutId: number;
}

export function AddExerciseModal({ opened, onClose, onAdd }: AddExerciseModalProps) {
  const { exercises, fetchExercises } = useExercisesStore();
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [sets, setSets] = useState<number>(3);
  const [reps, setReps] = useState<number>(10);
  const [weight, setWeight] = useState<string>('');

  // Загружаем упражнения при открытии модального окна
  useEffect(() => {
    if (opened && exercises.length === 0) {
      fetchExercises();
    }
  }, [opened, exercises.length, fetchExercises]);

  const handleSubmit = () => {
    if (selectedExercise && sets > 0 && reps > 0) {
      const weightValue = weight === '' ? undefined : parseFloat(weight);
      onAdd(
        parseInt(selectedExercise),
        sets,
        reps,
        weightValue
      );
      // Сброс формы
      setSelectedExercise(null);
      setSets(3);
      setReps(10);
      setWeight('');
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Добавить упражнение"
    >
      <Box>
        <Select
          label="Упражнение"
          placeholder="Выберите упражнение"
          data={exercises.map(ex => ({
            value: ex.id.toString(),
            label: ex.name
          }))}
          value={selectedExercise}
          onChange={setSelectedExercise}
          required
          mb="md"
        />

        <NumberInput
          label="Подходы"
          value={sets}
          onChange={(value) => {
            if (typeof value === 'number') {
              setSets(value);
            }
          }}
          min={1}
          required
          mb="md"
        />

        <NumberInput
          label="Повторения"
          value={reps}
          onChange={(value) => {
            if (typeof value === 'number') {
              setReps(value);
            }
          }}
          min={1}
          required
          mb="md"
        />

        <NumberInput
          label="Вес (кг)"
          value={weight === '' ? '' : parseFloat(weight) || ''}
          onChange={(value) => {
            if (typeof value === 'string') {
              setWeight(value);
            } else if (typeof value === 'number') {
              setWeight(value.toString());
            }
          }}
          min={0}
          step={0.5}
          mb="md"
        />

        <Group justify="flex-end" mt="md">
          <Button variant="subtle" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleSubmit}>
            Добавить
          </Button>
        </Group>
      </Box>
    </Modal>
  );
}