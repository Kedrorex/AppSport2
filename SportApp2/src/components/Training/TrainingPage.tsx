// TrainingPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useScheduledExercisesStore } from '../../store/useScheduledExercisesStore';
import type { AddScheduledExerciseData } from '../../store/useScheduledExercisesStore';
import { useExercisesStore } from '../../store/useExercisesStore';
import { AddExerciseModal } from './AddExerciseModal';
import { formatDateForComparison } from '../../utils/helpers';
import classes from './TrainingPage.module.css';

export function TrainingPage() {
  const navigate = useNavigate();
  const {
    exercises: scheduledExercises,
    fetchExercisesForDate,
    fetchMonthSummary,
    addExercise,
    deleteExercise,
    loading,
    error,
    monthSummary
  } = useScheduledExercisesStore();

  const { fetchExercises } = useExercisesStore();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [addExerciseModalOpened, setAddExerciseModalOpened] = useState(false);

  const setSelectedDatePreserveDay = (deltaMonths: number) => {
    const targetYear = selectedDate.getFullYear();
    const targetMonth = selectedDate.getMonth() + deltaMonths;
    const desiredDay = selectedDate.getDate();

    const lastDayOfTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
    const clampedDay = Math.min(desiredDay, lastDayOfTargetMonth);

    setSelectedDate(new Date(targetYear, targetMonth, clampedDay));
  };

  // Загружаем данные при монтировании
  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  // Загружаем упражнения при изменении даты
  useEffect(() => {
    const dateStr = formatDateForComparison(selectedDate);
    fetchExercisesForDate(dateStr);
  }, [selectedDate, fetchExercisesForDate]);

  // Загружаем сводку по месяцу (для маркеров в календаре)
  useEffect(() => {
    const from = formatDateForComparison(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    const to = formatDateForComparison(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0));
    fetchMonthSummary(from, to);
  }, [selectedDate, fetchMonthSummary]);

  // Определяет статус даты по количеству запланированных упражнений
  const getWorkoutStatusForDate = (year: number, month: number, day: number): 'completed' | 'planned' | null => {
    const key = formatDateForComparison(new Date(year, month, day));
    const count = monthSummary[key] ?? 0;
    return count > 0 ? 'planned' : null;
  };

  // Обработчик открытия модалки для добавления упражнения
  const handleAddExercise = () => {
    setAddExerciseModalOpened(true);
  };

  const handleDeleteExercise = async (id: number) => {
    const success = await deleteExercise(id);
    if (!success) {
      console.error("Не удалось удалить упражнение");
    }
  };

  const handleAddExerciseToCalendar = async (
  exerciseId: number,
  sets: number,
  reps: number,
  weight?: number,
  date?: Date
) => {
  const actualDate = date || selectedDate;
  const workoutDate = formatDateForComparison(actualDate);

  // Добавляем упражнение на выбранную дату
  const exerciseData: AddScheduledExerciseData = {
    workoutDate,
    exerciseId,
    sets,
    reps,
    weight
  };

  const success = await addExercise(exerciseData);

  if (!success) {
    console.error("Не удалось добавить упражнение");
  }

  setAddExerciseModalOpened(false);
};

  // Функции для календаря
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
  const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  return day === 0 ? 6 : day - 1; // 0 = Пн, 6 = Вс
};

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const days = [];

    // Дни предыдущего месяца
    for (let i = firstDay - 1; i >= 0; i--) {
      const prevMonth = selectedDate.getMonth() === 0 ? 11 : selectedDate.getMonth() - 1;
      const prevYear = selectedDate.getMonth() === 0 ? selectedDate.getFullYear() - 1 : selectedDate.getFullYear();
      const dayNumber = getDaysInMonth(new Date(prevYear, prevMonth)) - i;
      days.push({ day: dayNumber, month: prevMonth, year: prevYear, isCurrentMonth: false });
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

  const filteredExercises = scheduledExercises.filter(
    (exercise) => exercise.workoutDate === formatDateForComparison(selectedDate)
  );

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
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          margin: '16px 0',
          maxWidth: '100%',
        }}>
          <Paper 
            className={classes.calendar}
            style={{ 
              maxWidth: 320,
              width: '100%',
            }}
            withBorder
          >
            <Flex justify="space-between" align=" center" mb="sm">
              <Text size="sm" fw={500}>
                {selectedDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
              </Text>
              <Group gap="xs">
                <Button
                  variant="subtle"
                  onClick={() => {
                    setSelectedDatePreserveDay(-1);
                  }}
                >
                  <IconChevronLeft size="1rem" />
                </Button>
                <Button
                  variant="subtle"
                  onClick={() => {
                    setSelectedDatePreserveDay(1);
                  }}
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
              
              {currentDays.map((day, index) => {
                const status = day.isCurrentMonth
                  ? getWorkoutStatusForDate(day.year, day.month, day.day)
                  : null;

                const isSelected = day.isCurrentMonth &&
                  selectedDate.getDate() === day.day &&
                  selectedDate.getMonth() === day.month &&
                  selectedDate.getFullYear() === day.year;

                return (
                  <Button
                    key={index}
                    variant={isSelected ? 'filled' : 'subtle'}
                    size="xs"
                    radius="sm"
                    onClick={() => {
                      if (day.isCurrentMonth) {
                        const newDate = new Date(day.year, day.month, day.day);
                        setSelectedDate(newDate);
                      }
                    }}
                    style={{
                      backgroundColor: isSelected ? '#1a1a1a' : undefined,
                      color: isSelected ? 'white' : undefined,
                      position: 'relative',
                      display: 'block',
                      margin: '0 auto',
                      width: 32,
                      height: 32,
                      padding: 0,
                    }}
                  >
                    {day.day}
                    {status && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 2,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: status === 'completed' ? '#4CAF50' : '#FF9800',
                        }}
                      />
                    )}
                  </Button>
                );
              })}
            </SimpleGrid>
          </Paper>
        </div>

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
                    <Text style={{ fontSize: '12px', color: '#888' }}>УПР</Text>
                    <Text style={{ fontSize: '14px', fontWeight: 500 }}>{filteredExercises.length}</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Text style={{ fontSize: '12px', color: '#888' }}>ПОДХОДЫ</Text>
                    <Text style={{ fontSize: '14px', fontWeight: 500 }}>
                      {filteredExercises.reduce((acc, exercise) => acc + exercise.sets, 0)}
                    </Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Text style={{ fontSize: '12px', color: '#888' }}>КГ</Text>
                    <Text style={{ fontSize: '14px', fontWeight: 500 }}>
                      {filteredExercises.reduce((acc, exercise) =>
                        acc + ((exercise.weight || 0) * exercise.reps * exercise.sets), 0)}
                    </Text>
                  </div>
                </Group>

        {/* Упражнения */}
        <Stack gap="md">
          {error && (
            <Stack gap="xs">
              <Text c="red" ta="center">
                {error}
              </Text>
              <Group justify="center">
                <Button
                  variant="light"
                  onClick={() => fetchExercisesForDate(formatDateForComparison(selectedDate))}
                >
                  Повторить
                </Button>
              </Group>
            </Stack>
          )}
          {loading && (
            <Text c="dimmed" ta="center">
              Загрузка...
            </Text>
          )}
          {filteredExercises.map((exercise) => (
            <Card
              key={exercise.id}
              style={{
                backgroundColor: '#fff',
                borderRadius: '4px',
                padding: '16px',
                border: '1px solid #e0e0e0',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
              }}>
                <Text style={{ fontSize: '16px', fontWeight: 500 }}>
                  {exercise.exerciseName}
                </Text>

                <Group style={{ display: 'flex', gap: '8px' }}>
                  <Badge variant="light">
                    {exercise.sets}×{exercise.reps} {exercise.weight ? `${exercise.weight}кг` : ''}
                  </Badge>
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
                        onClick={() => handleDeleteExercise(exercise.id)}
                      >
                        Удалить
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </div>

              {/* Сеты упражнения */}
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

          {!loading && filteredExercises.length === 0 && (
            <Text c="dimmed" ta="center" py="xl">
              Нет упражнений на выбранную дату
            </Text>
          )}
        </Stack>

        {/* Кнопка добавления упражнения */}
        <Group justify="space-between" mt="md">
          <Button 
            variant="outline" 
            leftSection={<IconWeight size="1rem" />}
            onClick={() => navigate('/exercises')}
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
        }}
        onAdd={handleAddExerciseToCalendar}
        selectedDate={selectedDate}
      />
    </Box>
  );
}
