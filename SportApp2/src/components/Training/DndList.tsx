// src/components/Training/DndList.tsx
import { useState } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent // ✅ Используем type импорт
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { 
  IconGripVertical,
  IconRun,
  IconWeight,
  IconBike,
  IconSwimming
} from '@tabler/icons-react';
import { 
  Paper, 
  Text, 
  Group, 
  ThemeIcon, 
  Box
} from '@mantine/core';
import classes from './DndList.module.css';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Тип для элемента списка
interface DndListItemType {
  id: string;
  text: string;
  icon: typeof IconRun;
  description: string;
}

// Компонент для перетаскиваемого элемента
function SortableItem({ item }: { item: DndListItemType }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const IconComponent = item.icon;

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      className={classes.item}
      radius="md"
      p="xs"
      withBorder
      mt="xs"
    >
      <Group wrap="nowrap">
        <div {...listeners} {...attributes} className={classes.dragHandle}>
          <IconGripVertical size="1.2rem" stroke={1.5} />
        </div>

        <ThemeIcon variant="light" size="lg">
          <IconComponent size="1.2rem" />
        </ThemeIcon>

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {item.text}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </Paper>
  );
}

// Основной компонент DnD List
export function DndList() {
  const [items, setItems] = useState<DndListItemType[]>([
    {
      id: '1',
      text: 'Беговая тренировка',
      icon: IconRun,
      description: '30 минут интенсивного бега'
    },
    {
      id: '2',
      text: 'Силовая тренировка',
      icon: IconWeight,
      description: 'Упражнения с отягощениями'
    },
    {
      id: '3',
      text: 'Велотренировка',
      icon: IconBike,
      description: '45 минут кардио на велотренажере'
    },
    {
      id: '4',
      text: 'Плавание',
      icon: IconSwimming,
      description: '20 минут плавания кролем'
    },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ✅ Используем правильный тип DragEndEvent
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <Box>
      <Text size="lg" fw={500} mb="md">
        Мои тренировки
      </Text>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <SortableItem key={item.id} item={item} />
          ))}
        </SortableContext>
      </DndContext>
    </Box>
  );
}