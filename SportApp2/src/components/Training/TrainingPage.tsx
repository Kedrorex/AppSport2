// src/components/Training/TrainingPage.tsx
import { useState } from 'react';
import {
  IconCalendar,
  IconPlus,
  IconTrash,
  IconSettings,
  IconDotsVertical,
  IconWeight,
  IconBarbell,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconBell
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
  Flex,
} from '@mantine/core';
//import { useMediaQuery } from '@mantine/hooks';

interface ExerciseType {
  id: string;
  name: string;
  icon: typeof IconBarbell;
  sets: Array<{
    weight: number;
    reps: number;
  }>;
}

export function TrainingPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  //const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Пример данных упражнений
  const exercises: ExerciseType[] = [
    {
      id: '1',
      name: 'Жим над головой · штанга',
      icon: IconBarbell,
      sets: [
        { weight: 32.5, reps: 10 },
        { weight: 32.5, reps: 9 },
        { weight: 32.5, reps: 9 },
        { weight: 32.5, reps: 5 },
      ],
    },
    {
      id: '2',
      name: 'Тяга к подбородку · штанга',
      icon: IconBarbell,
      sets: [
        { weight: 30, reps: 10 },
        { weight: 30, reps: 10 },
        { weight: 30, reps: 10 },
        { weight: 30, reps: 10 },
      ],
    },
    {
      id: '3',
      name: 'Подъём рук в стороны · гантели',
      icon: IconBell, // Заменил на существующую иконку
      sets: [
        { weight: 15, reps: 12 },
        { weight: 18, reps: 12 },
        { weight: 18, reps: 12 },
        { weight: 18, reps: 12 },
      ],
    },
    {
      id: '4',
      name: 'Разведение рук · тренажер',
      icon: IconBell, // Заменил на существующую иконку
      sets: [
        { weight: 20, reps: 10 },
        { weight: 20, reps: 10 },
        { weight: 20, reps: 10 },
        { weight: 20, reps: 10 },
      ],
    },
  ];

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

  return (
    <Box style={{ height: '100%' }}>
      <Box p="md">
        <Group gap="xs" mb="md">
          <Button 
            variant="subtle" 
            leftSection={<IconCalendar size="1rem" />}
            onClick={() => {}}
          >
            {selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Button>
          <Button 
            variant="subtle" 
            leftSection={<IconClock size="1rem" />}
            onClick={() => {}}
          >
            Время
          </Button>
          <Button 
            variant="subtle" 
            leftSection={<IconCalendar size="1rem" />}
            onClick={() => {}}
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
            <Text style={{ fontSize: '12px', color: '#888' }}>УПР</Text>
            <Text style={{ fontSize: '14px', fontWeight: 500 }}>{exercises.length}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Text style={{ fontSize: '12px', color: '#888' }}>ПОДХ</Text>
            <Text style={{ fontSize: '14px', fontWeight: 500 }}>{exercises.reduce((acc, ex) => acc + ex.sets.length, 0)}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Text style={{ fontSize: '12px', color: '#888' }}>КГ</Text>
            <Text style={{ fontSize: '14px', fontWeight: 500 }}>
              {exercises.reduce((acc, ex) => acc + ex.sets.reduce((sum, set) => sum + set.weight * set.reps, 0), 0)}
            </Text>
          </div>
        </Group>

        {/* Тренировки */}
        <Stack gap="md">
          <Group gap="xs">
            <Badge color="blue">Плечи</Badge>
            <Badge color="gray">Корпус</Badge>
          </Group>

          {exercises.map((exercise) => {
            const IconComponent = exercise.icon;
            return (
              <Card 
                key={exercise.id} 
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
                  marginBottom: '8px',
                }}>
                  <Group gap="xs">
                    <div style={{ 
                      width: '40px',
                      height: '40px',
                      borderRadius: '4px',
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <IconComponent size="1.5rem" />
                    </div>
                    <Text style={{ fontSize: '14px', fontWeight: 500 }}>{exercise.name}</Text>
                  </Group>
                  
                  <Group style={{ display: 'flex', gap: '8px' }}>
                    <ActionIcon variant="subtle" color="green" onClick={() => {}}>
                      <IconPlus size="1rem" />
                    </ActionIcon>
                    <Menu shadow="md" width={200}>
                      <Menu.Target>
                        <ActionIcon variant="subtle" color="gray">
                          <IconDotsVertical size="1rem" />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<IconSettings size="1rem" />}>Настройки</Menu.Item>
                        <Menu.Item leftSection={<IconTrash size="1rem" />} color="red">Удалить</Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                  {exercise.sets.map((set, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        flex: 1,
                        minWidth: '60px',
                        textAlign: 'center',
                        padding: '8px',
                        borderRadius: '4px',
                        backgroundColor: '#f5f5f5',
                      }}
                    >
                      <Text style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Сет {index + 1}</Text>
                      <Text style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{set.weight} кг</Text>
                      <Text style={{ fontSize: '12px', color: '#888' }}>{set.reps} пвт</Text>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </Stack>

        {/* Кнопка добавления */}
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
            onClick={() => {}}
          >
            Добавить
          </Button>
        </Group>
      </Box>
    </Box>
  );
}