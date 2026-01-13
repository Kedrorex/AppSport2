// TrainingPage.tsx
import { useState, useEffect } from 'react';
import {
  IconCalendar,
  IconPlus,
  IconTrash,
  IconDotsVertical,
  IconWeight,
  IconChevronLeft,
  IconChevronRight,
  IconClock
} from '@tabler/icons-react';
import { 
  Box, 
  Paper, 
  Text, 
  Group, 
  Button, 
  ActionIcon, 
  Menu,
  Badge,
  Card,
  Stack,
  SimpleGrid,
  Flex
} from '@mantine/core';
import { useTrainingsStore } from '../../store/useTrainingsStore';
import { useExercisesStore } from '../../store/useExercisesStore';
import { AddExerciseModal } from './AddExerciseModal';

export function TrainingPage() {
  const { 
    trainings, 
    fetchTrainings, 
    createTraining, 
    deleteTrainingAsync,
    addExerciseToTraining
  } = useTrainingsStore();
  
  const { fetchExercises } = useExercisesStore();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [addExerciseModalOpened, setAddExerciseModalOpened] = useState(false);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(null);

  // Загружаем данные при монтировании
  useEffect(() => {
    fetchTrainings();
    fetchExercises();
  }, [fetchTrainings, fetchExercises]);

  // Получаем тренировки за выбранную дату
  const getTrainingsForDate = () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return trainings.filter(training => {
      const trainingDate = new Date(training.workoutDate).toISOString().split('T')[0];
      return trainingDate === dateStr;
    });
  };

  // Новый обработчик - открытие модалки для добавления упражнения
  const handleAddExercise = () => {
    setSelectedWorkoutId(null); // Сбросим ID, чтобы модалка не привязывалась к тренировке
    setAddExerciseModalOpened(true);
  };

  const handleDeleteTraining = async (id: number) => {
    await deleteTrainingAsync(id);
  };

  // Новый обработчик - добавление упражнения в тренировку на дату
  const handleAddExerciseToCalendar = async (
    exerciseId: number, 
    sets: number, 
    reps: number, 
    weight?: number,
    date?: Date
  ) => {
    // Используем дату из модалки, если указана, иначе текущую
    const actualDate = date || selectedDate;
    const dateStr = actualDate.toISOString().split('T')[0];
    
    const existingTraining = trainings.find(training => { // ✅ const вместо let
      const trainingDate = new Date(training.workoutDate).toISOString().split('T')[0];
      return trainingDate === dateStr;
    });

    let workoutId = existingTraining?.id;

    // Если нет тренировки на эту дату, создаём новую
    if (!workoutId) {
      const trainingData = {
        workoutDate: actualDate.toISOString(),
        userId: 1, // TODO: Получать ID пользователя из контекста авторизации
        durationMinutes: 60,
        notes: ''
      };

      const result = await createTraining(trainingData);
      if (result) {
        workoutId = result.id;
      } else {
        console.error("Не удалось создать тренировку");
        return;
      }
    }

    if (workoutId) {
      await addExerciseToTraining(workoutId, {
        exerciseId,
        sets,
        reps,
        weight
      });
    }
    setAddExerciseModalOpened(false);
  };

  // Функции для календаря
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const days = [];

    // Дни предыдущего месяца
    for (let i = firstDay - 1; i >= 0; i--) {
      const prevMonth = selectedDate.getMonth() === 0 ? 11 : selectedDate.getMonth() - 1;
      const prevYear = selectedDate.getMonth() === 0 ? selectedDate.getFullYear() - 1 : selectedDate.getFullYear();
      const day = new Date(prevYear, prevMonth, getDaysInMonth(new Date(prevYear, prevMonth)) - i);
      days.push({ day: day.getDate(), month: day.getMonth(), year: day.getFullYear(), isCurrentMonth: false });
    }

    // Дни текущего месяца
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, month: selectedDate.getMonth(), year: selectedDate.getFullYear(), isCurrentMonth: true });
    }

    // Дни следующего месяца
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonth = selectedDate.getMonth() === 11 ? 0 : selectedDate.getMonth() + 1;
      const nextYear = selectedDate.getMonth() === 11 ? selectedDate.getFullYear() + 1 : selectedDate.getFullYear();
      days.push({ day: i, month: nextMonth, year: nextYear, isCurrentMonth: false });
    }

    return days;
  };

  const currentDays = generateCalendarDays();
  const currentTrainings = getTrainingsForDate();

  return (
    <Box style={{ height: '100%' }}>
      <Box p="md">
        <Group gap="xs" mb="md">
          <Button 
            variant="subtle" 
            leftSection={<IconCalendar size="1rem" />}
          >
            {selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Button>
          <Button 
            variant="subtle" 
            leftSection={<IconClock size="1rem" />}
          >
            Время
          </Button>
          <Button 
            variant="subtle" 
            leftSection={<IconCalendar size="1rem" />}
          >
            Календарь
          </Button>
        </Group>

        {/* Календарь */}
        <Paper 
          style={{ 
            margin: '16px 0',
            backgroundColor: '#fff',
            borderRadius: '4px',
            padding: '16px',
            border: '1px solid #e0e0e0',
          }} 
          withBorder
        >
          <Flex justify="space-between" align="center" mb="sm">
            <Text size="sm" fw={500}>
              {selectedDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
            </Text>
            <Group gap="xs">
              <Button 
                variant="subtle" 
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
              >
                <IconChevronLeft size="1rem" />
              </Button>
              <Button 
                variant="subtle" 
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
              >
                <IconChevronRight size="1rem" />
              </Button>
            </Group>
          </Flex>

          <SimpleGrid cols={7} spacing="xs">
            {['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'].map((day) => (
              <Text key={day} size="xs" c="dimmed" ta="center">
                {day}
              </Text>
            ))}
            
            {currentDays.map((day, index) => (
              <div key={index} style={{ textAlign: 'center', padding: '4px' }}>
                <Button
                  variant={day.isCurrentMonth && selectedDate.getDate() === day.day ? 'filled' : 'subtle'}
                  size="xs"
                  radius="sm"
                  onClick={() => {
                    if (day.isCurrentMonth) {
                      setSelectedDate(new Date(day.year, day.month, day.day));
                    }
                  }}
                  style={{
                    backgroundColor: day.isCurrentMonth && selectedDate.getDate() === day.day ? '#1a1a1a' : undefined,
                    color: day.isCurrentMonth && selectedDate.getDate() === day.day ? 'white' : undefined,
                  }}
                >
                  {day.day}
                </Button>
              </div>
            ))}
          </SimpleGrid>
        </Paper>

        {/* Статистика */}
        <Group 
          style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '16px 0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Text style={{ fontSize: '12px', color: '#888' }}>ТРЕН</Text>
            <Text style={{ fontSize: '14px', fontWeight: 500 }}>{currentTrainings.length}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Text style={{ fontSize: '12px', color: '#888' }}>УПР</Text>
            <Text style={{ fontSize: '14px', fontWeight: 500 }}>
              {currentTrainings.reduce((acc, training) => 
                acc + (training.workoutExercises?.length || 0), 0)}
            </Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Text style={{ fontSize: '12px', color: '#888' }}>КГ</Text>
            <Text style={{ fontSize: '14px', fontWeight: 500 }}>
              {currentTrainings.reduce((acc, training) => 
                acc + (training.workoutExercises?.reduce((sum, ex) => 
                  sum + ((ex.weight || 0) * (ex.reps || 0)), 0) || 0), 0)}
            </Text>
          </div>
        </Group>

        {/* Тренировки */}
        <Stack gap="md">
          {currentTrainings.map((training) => (
            <Card 
              key={training.id} 
              style={{ 
                backgroundColor: '#fff',
                borderRadius: '4px',
                padding: '16px',
                border: '1px solid #e0e0e0',
                marginBottom: '16px',
              }}
            >
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}>
                <Text style={{ fontSize: '16px', fontWeight: 500 }}>
                  Тренировка {new Date(training.workoutDate).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                </Text>
                
                <Group style={{ display: 'flex', gap: '8px' }}>
                  <ActionIcon 
                    variant="subtle" 
                    color="blue" 
                    onClick={() => {
                      setSelectedWorkoutId(training.id);
                      setAddExerciseModalOpened(true);
                    }}
                  >
                    <IconPlus size="1rem" />
                  </ActionIcon>
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray">
                        <IconDotsVertical size="1rem" />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item 
                        leftSection={<IconTrash size="1rem" />} 
                        color="red"
                        onClick={() => handleDeleteTraining(training.id)}
                      >
                        Удалить
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </div>

              {training.notes && (
                <Text size="sm" c="dimmed" mb="md">
                  {training.notes}
                </Text>
              )}

              {/* Упражнения в тренировке */}
              <Stack gap="md">
                {training.workoutExercises?.map((exercise) => (
                  <Card key={exercise.id} p="xs" withBorder>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm" fw={500}>
                        {exercise.exerciseName || `Упражнение #${exercise.exerciseId}`}
                      </Text>
                      <Badge variant="light">
                        {exercise.sets}×{exercise.reps} {exercise.weight ? `${exercise.weight}кг` : ''}
                      </Badge>
                    </Group>
                    
                    <Group gap="xs">
                      {Array.from({ length: exercise.sets }).map((_, index) => (
                        <Paper key={index} p="xs" bg="#f5f5f5" style={{ minWidth: 60, textAlign: 'center' }}>
                          <Text size="xs" c="dimmed">Сет {index + 1}</Text>
                          <Text size="sm" fw={500}>
                            {exercise.weight || 0}кг × {exercise.reps}
                          </Text>
                        </Paper>
                      ))}
                    </Group>
                  </Card>
                ))}
              </Stack>
            </Card>
          ))}

          {currentTrainings.length === 0 && (
            <Text c="dimmed" ta="center" py="xl">
              Нет тренировок на выбранную дату
            </Text>
          )}
        </Stack>

        {/* Кнопка добавления упражнения */}
        <Group justify="space-between" mt="md">
          <Button 
            variant="outline" 
            leftSection={<IconWeight size="1rem" />}
            onClick={() => {}}
          >
            Упражнения
          </Button>
          <Button 
            variant="filled" 
            color="green" 
            rightSection={<IconPlus size="1rem" />}
            onClick={handleAddExercise}
          >
            Добавить упражнение
          </Button>
        </Group>
      </Box>

      {/* Модальное окно добавления упражнения */}
      <AddExerciseModal
        opened={addExerciseModalOpened}
        onClose={() => {
          setAddExerciseModalOpened(false);
          setSelectedWorkoutId(null);
        }}
        onAdd={handleAddExerciseToCalendar}
        workoutId={selectedWorkoutId || 0}
        selectedDate={selectedDate} // Передаём дату в модалку
      />
    </Box>
  );
}