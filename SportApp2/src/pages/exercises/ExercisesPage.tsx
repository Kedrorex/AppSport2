import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { IconPlus, IconPencil, IconSearch } from '@tabler/icons-react';
import { useExercisesStore } from '../../store/useExercisesStore';
import type { Exercise } from '../../types';

type ExerciseFormState = {
  name: string;
  description?: string;
  muscleGroup?: string;
  exerciseType?: string;
};

const emptyForm: ExerciseFormState = {
  name: '',
  description: '',
  muscleGroup: '',
  exerciseType: '',
};

export function ExercisesPage() {
  const { exercises, loading, error, fetchExercises, createExercise, updateExerciseAsync } = useExercisesStore();

  const [query, setQuery] = useState('');
  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState<Exercise | null>(null);
  const [form, setForm] = useState<ExerciseFormState>(emptyForm);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return exercises;
    return exercises.filter((e) => e.name.toLowerCase().includes(q));
  }, [exercises, query]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpened(true);
  };

  const openEdit = (exercise: Exercise) => {
    setEditing(exercise);
    setForm({
      name: exercise.name ?? '',
      description: exercise.description ?? '',
      muscleGroup: exercise.muscleGroup ?? '',
      exerciseType: exercise.exerciseType ?? '',
    });
    setOpened(true);
  };

  const onSave = async () => {
    const payload = {
      name: form.name.trim(),
      description: form.description?.trim() || undefined,
      muscleGroup: form.muscleGroup?.trim() || undefined,
      exerciseType: form.exerciseType?.trim() || undefined,
    };

    if (!payload.name) return;

    const result = editing
      ? await updateExerciseAsync(editing.id, payload)
      : await createExercise(payload);

    if (result) {
      setOpened(false);
    }
  };

  return (
    <Box>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">
          Упражнения
        </Text>
        <Button leftSection={<IconPlus size="1rem" />} onClick={openCreate}>
          Добавить
        </Button>
      </Group>

      <Group mb="md" align="end">
        <TextInput
          leftSection={<IconSearch size="1rem" />}
          label="Поиск"
          placeholder="Например: присед"
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          style={{ flex: 1 }}
        />
      </Group>

      {error && (
        <Text c="red" mb="sm">
          {error}
        </Text>
      )}

      {loading && (
        <Text c="dimmed" mb="sm">
          Загрузка...
        </Text>
      )}

      <Stack gap="sm">
        {filtered.map((exercise) => (
          <Card key={exercise.id} withBorder>
            <Group justify="space-between" align="start">
              <Stack gap={2}>
                <Text fw={600}>{exercise.name}</Text>
                {(exercise.muscleGroup || exercise.exerciseType) && (
                  <Text c="dimmed" size="sm">
                    {[exercise.muscleGroup, exercise.exerciseType].filter(Boolean).join(' • ')}
                  </Text>
                )}
                {exercise.description && (
                  <Text size="sm">
                    {exercise.description}
                  </Text>
                )}
              </Stack>

              <Button
                variant="light"
                leftSection={<IconPencil size="1rem" />}
                onClick={() => openEdit(exercise)}
              >
                Редактировать
              </Button>
            </Group>
          </Card>
        ))}

        {!loading && filtered.length === 0 && (
          <Text c="dimmed" ta="center" py="xl">
            Упражнений не найдено
          </Text>
        )}
      </Stack>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={editing ? 'Редактировать упражнение' : 'Новое упражнение'}
        centered
      >
        <Stack>
          <TextInput
            label="Название"
            required
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.currentTarget.value }))}
          />
          <Textarea
            label="Описание"
            minRows={3}
            value={form.description}
            onChange={(e) => setForm((s) => ({ ...s, description: e.currentTarget.value }))}
          />
          <TextInput
            label="Группа мышц"
            value={form.muscleGroup}
            onChange={(e) => setForm((s) => ({ ...s, muscleGroup: e.currentTarget.value }))}
          />
          <TextInput
            label="Тип упражнения"
            value={form.exerciseType}
            onChange={(e) => setForm((s) => ({ ...s, exerciseType: e.currentTarget.value }))}
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setOpened(false)}>
              Отмена
            </Button>
            <Button onClick={onSave} disabled={!form.name.trim()}>
              Сохранить
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}

