// AddExerciseModal.tsx
import { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  NumberInput,
  Button,
  Group,
  Box,
  TextInput,
  Divider,
  Paper,
  Text,
  ActionIcon,
  Stack,
  Badge,
  Collapse
} from '@mantine/core';
import { DatePickerInput, type DateValue } from '@mantine/dates';
import { IconPlus, IconTrash, IconSearch } from '@tabler/icons-react';
import { useExercisesStore } from '../../store/useExercisesStore';

interface AddExerciseModalProps {
  opened: boolean;
  onClose: () => void;
  onAdd: (exerciseId: number, sets: number, reps: number, weight?: number, date?: Date) => void;
  workoutId: number;
  selectedDate?: Date;
}

interface SetData {
  id: number;
  reps: number;
  weight: number;
}

export function AddExerciseModal({ 
  opened, 
  onClose, 
  onAdd, 
  selectedDate 
}: AddExerciseModalProps) {
  const { exercises, fetchExercises, searchExercises, loading } = useExercisesStore();
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [setsData, setSetsData] = useState<SetData[]>([{ id: 1, reps: 10, weight: 0 }]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [date, setDate] = useState<Date | null>(selectedDate || null);

  useEffect(() => {
    if (opened && exercises.length === 0) {
      fetchExercises();
    }
  }, [opened, exercises.length, fetchExercises]);

  const filteredExercises = useMemo(() => {
    let filtered = exercises;
    if (searchQuery) {
      filtered = filtered.filter(exercise => 
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedMuscleGroups.length > 0) {
      filtered = filtered.filter(exercise => 
        exercise.muscleGroup && selectedMuscleGroups.includes(exercise.muscleGroup)
      );
    }
    return filtered;
  }, [exercises, searchQuery, selectedMuscleGroups]);

  const muscleGroups = useMemo(() => {
    const groups = exercises
      .map(ex => ex.muscleGroup)
      .filter((group, index, self) => group && self.indexOf(group) === index) as string[];
    return groups.sort();
  }, [exercises]);

  // Поиск только по названию (фильтрация по группам — на клиенте)
  useEffect(() => {
    if (searchQuery.length > 2) {
      const timeoutId = setTimeout(() => {
        searchExercises({ name: searchQuery });
      }, 300);
      return () => clearTimeout(timeoutId);
    } else if (searchQuery.length === 0) {
      fetchExercises();
    }
  }, [searchQuery, fetchExercises, searchExercises]);

  const addSet = () => {
    const newId = setsData.length > 0 ? Math.max(...setsData.map(s => s.id)) + 1 : 1;
    setSetsData([...setsData, { id: newId, reps: 10, weight: 0 }]);
  };

  const removeSet = (id: number) => {
    if (setsData.length > 1) {
      setSetsData(setsData.filter(set => set.id !== id));
    }
  };

  const updateSetReps = (id: number, reps: number) => {
    setSetsData(setsData.map(set => 
      set.id === id ? { ...set, reps } : set
    ));
  };

  const updateSetWeight = (id: number, weight: number) => {
    setSetsData(setsData.map(set => 
      set.id === id ? { ...set, weight } : set
    ));
  };

  const handleSubmit = () => {
    if (selectedExercise && setsData.length > 0 && date) {
      const totalReps = setsData.reduce((sum, set) => sum + set.reps, 0);
      const totalWeight = setsData.reduce((sum, set) => sum + set.weight, 0);
      const avgReps = Math.round(totalReps / setsData.length);
      const avgWeight = totalWeight / setsData.length;
      
      onAdd(
        parseInt(selectedExercise),
        setsData.length,
        avgReps,
        avgWeight > 0 ? avgWeight : undefined,
        date
      );
      
      setSelectedExercise(null);
      setSetsData([{ id: 1, reps: 10, weight: 0 }]);
      setSearchQuery('');
      setSelectedMuscleGroups([]);
      setDate(selectedDate || null);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedMuscleGroups([]);
    setSelectedExercise(null);
  };

  // Сброс подходов при смене упражнения
  useEffect(() => {
    if (selectedExercise) {
      setSetsData([{ id: 1, reps: 10, weight: 0 }]);
    }
  }, [selectedExercise]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Добавить упражнение"
      size="lg"
      centered
      styles={{
        body: {
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh',
          padding: 0,
        },
      }}
    >
      {/* Прокручиваемая область */}
      <Box
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--mantine-spacing-md)',
          paddingBottom: '70px', // отступ для плавающих кнопок
        }}
      >
        {/* Поиск и дата в одной строке */}
        <Group grow mb="md">
          <TextInput
            label="Поиск упражнений"
            placeholder="Введите название..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            leftSection={<IconSearch size="1rem" />}
          />
          
          <DatePickerInput
            label="Дата добавления"
            value={date}
            onChange={(value: DateValue) => setDate(value as Date | null)}
            required
          />
        </Group>

        {/* Ряд кнопок: группы мышц */}
        <Text size="sm" fw={500} mb="xs">Группа мышц:</Text>
        <Group gap="xs" wrap="wrap">
          <Button
            size="compact-sm"
            variant={selectedMuscleGroups.length === 0 ? 'filled' : 'outline'}
            onClick={() => setSelectedMuscleGroups([])}
          >
            Все
          </Button>
          {muscleGroups.map((group) => {
            const isSelected = selectedMuscleGroups.includes(group);
            return (
              <Button
                key={group}
                size="compact-sm"
                variant={isSelected ? 'filled' : 'outline'}
                onClick={() => {
                  if (isSelected) {
                    setSelectedMuscleGroups(selectedMuscleGroups.filter(g => g !== group));
                  } else {
                    setSelectedMuscleGroups([...selectedMuscleGroups, group]);
                  }
                }}
              >
                {group}
              </Button>
            );
          })}
        </Group>
        <Box h="8px" />

        {(searchQuery || selectedMuscleGroups.length > 0) && (
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

        {/* Список упражнений с аккордеоном */}
        <Text size="sm" fw={500} mb="xs">Выберите упражнение:</Text>
        {filteredExercises.length === 0 ? (
          <Text c="dimmed" ta="center" py="sm">
            {loading ? 'Загрузка...' : 'Упражнения не найдены'}
          </Text>
        ) : (
          <Stack gap="xs" mb="md">
            {filteredExercises.map((ex) => {
              const isOpen = selectedExercise === ex.id.toString();
              return (
                <Paper
                  key={ex.id}
                  withBorder
                  style={{
                    cursor: 'pointer',
                    backgroundColor: isOpen ? '#f0f9ff' : 'transparent',
                  }}
                >
                  {/* Заголовок упражнения */}
                  <Box
                    p="xs"
                    onClick={() => {
                      if (isOpen) {
                        setSelectedExercise(null); // свернуть при повторном клике
                      } else {
                        setSelectedExercise(ex.id.toString());
                      }
                    }}
                  >
                    <Group justify="space-between">
                      <Text size="sm" fw={500}>{ex.name}</Text>
                      {ex.muscleGroup && <Badge variant="light" size="sm">{ex.muscleGroup}</Badge>}
                    </Group>
                  </Box>

                  {/* Аккордеон с подходами */}
                  <Collapse in={isOpen}>
                    <Box p="xs" pt={0}>
                      <Divider my="xs" label="Подходы" labelPosition="center" />
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
                  </Collapse>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Box>

      {/* Плавающая панель кнопок */}
      <Group
        justify="flex-end"
        style={{
          position: 'sticky',
          bottom: 0,
          backgroundColor: 'var(--mantine-color-body)',
          padding: 'var(--mantine-spacing-md)',
          borderTop: '1px solid var(--mantine-color-gray-2)',
          marginTop: 'auto',
        }}
      >
        <Button variant="subtle" onClick={onClose}>
          Отмена
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!selectedExercise || setsData.length === 0 || !date}
        >
          Добавить упражнение
        </Button>
      </Group>
    </Modal>
  );
}