// AddExerciseModal.tsx
import { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  Select,
  NumberInput,
  Button,
  Group,
  Box,
  TextInput,
  Divider,
  Paper,
  Text,
  ActionIcon
} from '@mantine/core';
import { IconPlus, IconTrash, IconSearch, IconFilter } from '@tabler/icons-react';
import { useExercisesStore } from '../../store/useExercisesStore';

interface AddExerciseModalProps {
  opened: boolean;
  onClose: () => void;
  onAdd: (exerciseId: number, sets: number, reps: number, weight?: number) => void;
  workoutId: number;
}

interface SetData {
  id: number;
  reps: number;
  weight: number;
}

export function AddExerciseModal({ opened, onClose, onAdd }: AddExerciseModalProps) {
  const { exercises, fetchExercises, searchExercises, loading } = useExercisesStore();
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [setsData, setSetsData] = useState<SetData[]>([{ id: 1, reps: 10, weight: 0 }]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [muscleGroupFilter, setMuscleGroupFilter] = useState<string>('');

  // Загружаем упражнения при открытии модального окна
  useEffect(() => {
    if (opened && exercises.length === 0) {
      fetchExercises();
    }
  }, [opened, exercises.length, fetchExercises]);

  // Фильтрация упражнений
  const filteredExercises = useMemo(() => {
    let filtered = exercises;

    // Фильтрация по поисковому запросу
    if (searchQuery) {
      filtered = filtered.filter(exercise => 
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Фильтрация по группе мышц
    if (muscleGroupFilter) {
      filtered = filtered.filter(exercise => 
        exercise.muscleGroup?.toLowerCase() === muscleGroupFilter.toLowerCase()
      );
    }

    return filtered;
  }, [exercises, searchQuery, muscleGroupFilter]);

  // Получаем уникальные группы мышц для фильтра
  const muscleGroups = useMemo(() => {
    const groups = exercises
      .map(ex => ex.muscleGroup)
      .filter((group, index, self) => group && self.indexOf(group) === index) as string[];
    return groups.sort();
  }, [exercises]);

  // Обработчик поиска с задержкой
  useEffect(() => {
    if (searchQuery.length > 2 || muscleGroupFilter) {
      const timeoutId = setTimeout(() => {
        searchExercises({ 
          name: searchQuery || undefined, 
          muscleGroup: muscleGroupFilter || undefined 
        });
      }, 300);
      return () => clearTimeout(timeoutId);
    } else if (searchQuery.length === 0 && !muscleGroupFilter) {
      // Если поиск пустой, загружаем все упражнения
      fetchExercises();
    }
  }, [searchQuery, muscleGroupFilter, searchExercises, fetchExercises]);

  // Добавить подход
  const addSet = () => {
    const newId = setsData.length > 0 ? Math.max(...setsData.map(s => s.id)) + 1 : 1;
    setSetsData([...setsData, { id: newId, reps: 10, weight: 0 }]);
  };

  // Удалить подход
  const removeSet = (id: number) => {
    if (setsData.length > 1) {
      setSetsData(setsData.filter(set => set.id !== id));
    }
  };

  // Изменить повторения для подхода
  const updateSetReps = (id: number, reps: number) => {
    setSetsData(setsData.map(set => 
      set.id === id ? { ...set, reps } : set
    ));
  };

  // Изменить вес для подхода
  const updateSetWeight = (id: number, weight: number) => {
    setSetsData(setsData.map(set => 
      set.id === id ? { ...set, weight } : set
    ));
  };

  const handleSubmit = () => {
    if (selectedExercise && setsData.length > 0) {
      // Для совместимости с текущим API, используем средние значения
      const totalReps = setsData.reduce((sum, set) => sum + set.reps, 0);
      const totalWeight = setsData.reduce((sum, set) => sum + set.weight, 0);
      const avgReps = Math.round(totalReps / setsData.length);
      const avgWeight = totalWeight / setsData.length;
      
      onAdd(
        parseInt(selectedExercise),
        setsData.length, // количество подходов
        avgReps,         // среднее количество повторений
        avgWeight > 0 ? avgWeight : undefined // средний вес
      );
      
      // Сброс формы
      setSelectedExercise(null);
      setSetsData([{ id: 1, reps: 10, weight: 0 }]);
      setSearchQuery('');
      setMuscleGroupFilter('');
    }
  };

  // Сброс фильтров
  const handleResetFilters = () => {
    setSearchQuery('');
    setMuscleGroupFilter('');
    setSelectedExercise(null);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Добавить упражнение"
      size="lg"
      centered
    >
      <Box>
        {/* Поля поиска и фильтрации */}
        <TextInput
          label="Поиск упражнений"
          placeholder="Введите название упражнения..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          mb="sm"
          leftSection={<IconSearch size="1rem" />}
        />

        <Select
          label="Группа мышц"
          placeholder="Выберите группу мышц"
          data={[
            { value: '', label: 'Все группы' },
            ...muscleGroups.map(group => ({ value: group, label: group }))
          ]}
          value={muscleGroupFilter}
          onChange={(value) => setMuscleGroupFilter(value || '')}
          clearable
          mb="md"
          leftSection={<IconFilter size="1rem" />}
        />

        {(searchQuery || muscleGroupFilter) && (
          <Group justify="flex-end" mb="sm">
            <Button 
              variant="subtle" 
              size="xs" 
              onClick={handleResetFilters}
            >
              Сбросить фильтры
            </Button>
          </Group>
        )}

        <Divider my="sm" />

        {/* Выбор упражнения */}
        <Select
          label="Упражнение"
          placeholder="Выберите упражнение"
          data={filteredExercises.map(ex => ({
            value: ex.id.toString(),
            label: `${ex.name}${ex.muscleGroup ? ` (${ex.muscleGroup})` : ''}`
          }))}
          value={selectedExercise}
          onChange={setSelectedExercise}
          required
          mb="md"
          searchable
          nothingFoundMessage={loading ? "Загрузка..." : "Упражнения не найдены"}
        />

        {/* Подходы */}
        {selectedExercise && (
          <>
            <Divider my="md" label="Подходы" labelPosition="center" />
            
            <Box mb="md">
              {setsData.map((set, index) => (
                <Paper 
                  key={set.id} 
                  p="xs" 
                  mb="xs" 
                  withBorder
                  style={{ backgroundColor: '#f9f9f9' }}
                >
                  <Group grow>
                    <Text size="sm" fw={500}>
                      Подход {index + 1}
                    </Text>
                    {setsData.length > 1 && (
                      <ActionIcon 
                        color="red" 
                        variant="subtle" 
                        onClick={() => removeSet(set.id)}
                      >
                        <IconTrash size="1rem" />
                      </ActionIcon>
                    )}
                  </Group>
                  
                  <Group grow mt="xs">
                    <NumberInput
                      label="Повторения"
                      value={set.reps}
                      onChange={(value) => {
                        if (typeof value === 'string') {
                          updateSetReps(set.id, parseInt(value) || 0);
                        } else if (typeof value === 'number') {
                          updateSetReps(set.id, value);
                        }
                      }}
                      min={1}
                      hideControls
                    />
                    
                    <NumberInput
                      label="Вес (кг)"
                      value={set.weight}
                      onChange={(value) => {
                        if (typeof value === 'string') {
                          updateSetWeight(set.id, parseFloat(value) || 0);
                        } else if (typeof value === 'number') {
                          updateSetWeight(set.id, value);
                        }
                      }}
                      min={0}
                      step={0.5}
                      hideControls
                    />
                  </Group>
                </Paper>
              ))}
              
              <Button 
                leftSection={<IconPlus size="1rem" />}
                variant="subtle" 
                onClick={addSet}
                fullWidth
                mt="xs"
              >
                Добавить подход
              </Button>
            </Box>
          </>
        )}

        <Group justify="flex-end" mt="md">
          <Button variant="subtle" onClick={onClose}>
            Отмена
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedExercise || setsData.length === 0}
          >
            Добавить упражнение
          </Button>
        </Group>
      </Box>
    </Modal>
  );
}