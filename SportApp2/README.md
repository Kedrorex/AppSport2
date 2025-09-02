# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# 🏗️ Архитектура Frontend приложения

Детальное описание структуры проекта для подготовки к интеграции с бэкендом.

## 📁 Общая структура

```
src/
├── api/                 # HTTP клиенты и API сервисы
│   ├── client.ts        # Axios instance
│   ├── auth.ts         # Аутентификация
│   ├── exercises.ts    # Упражнения
│   └── trainings.ts    # Тренировки
├── components/          # Переиспользуемые компоненты
│   ├── common/         # Общие компоненты
│   ├── layout/         # Компоненты layout
│   └── ui/             # UI компоненты
├── pages/              # Страницы приложения
│   ├── auth/           # Страницы аутентификации
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── trainings/      # Страницы тренировок
│   ├── exercises/      # Страницы упражнений
│   └── dashboard/      # Дашборд
├── store/              # Глобальное состояние
│   ├── useUserStore.ts
│   ├── useExercisesStore.ts
│   └── useTrainingsStore.ts
├── types/              # TypeScript интерфейсы
│   ├── user.ts
│   ├── exercise.ts
│   ├── training.ts
│   └── index.ts        # Экспорт всех типов
├── hooks/              # Кастомные хуки
│   ├── useAuth.ts
│   └── useApi.ts
├── utils/              # Вспомогательные функции
│   ├── constants.ts
│   └── helpers.ts
├── routes/             # Конфигурация маршрутов
│   └── index.tsx
├── App.tsx
└── main.tsx
```

## 📁 Подробное описание каждой директории

### 📁 `api/` - HTTP клиенты и API сервисы

**Назначение:** Централизованное место для всех HTTP-запросов к бэкенду.

**Файлы:**
- `client.ts` - Настроенный экземпляр Axios с базовыми параметрами и интерцепторами
- `auth.ts` - API методы для аутентификации (login, register, logout)
- `exercises.ts` - API методы для работы с упражнениями
- `trainings.ts` - API методы для работы с тренировками

**Зачем:** 
- Единая точка конфигурации HTTP-клиента
- Централизованная обработка ошибок
- Повторное использование API методов
- Легкость тестирования и мокирования

### 📁 `components/` - Переиспользуемые компоненты

**Назначение:** Разделение компонентов по категориям для лучшей организации.

**Поддиректории:**
- `common/` - Универсальные компоненты (DndList, кнопки, формы)
- `layout/` - Компоненты структуры страницы (навигация, хедер, футер)
- `ui/` - Атомарные UI компоненты (инпуты, модалки, карточки)

**Зачем:**
- Повышает переиспользуемость компонентов
- Упрощает поиск нужных компонентов
- Легче поддерживать и тестировать
- Четкое разделение ответственности

### 📁 `pages/` - Страницы приложения

**Назначение:** Каждая страница приложения в отдельной директории.

**Поддиректории:**
- `auth/` - Страницы аутентификации (вход, регистрация)
- `trainings/` - Страницы работы с тренировками
- `exercises/` - Страницы работы с упражнениями
- `dashboard/` - Главная страница/дашборд

**Зачем:**
- Каждая страница изолирована и самодостаточна
- Легко находить и модифицировать конкретные страницы
- Удобная навигация по проекту
- Поддержка code splitting в будущем

### 📁 `store/` - Глобальное состояние

**Назначение:** Управление глобальным состоянием приложения с помощью Zustand.

**Файлы:**
- `useUserStore.ts` - Состояние пользователя и аутентификации
- `useExercisesStore.ts` - Состояние упражнений
- `useTrainingsStore.ts` - Состояние тренировок

**Зачем:**
- Централизованное управление состоянием
- Избежание "проп drilling"
- Легкое тестирование состояния
- Производительность (селекторы, мемоизация)

### 📁 `types/` - TypeScript интерфейсы

**Назначение:** Все типы и интерфейсы приложения в одном месте.

**Файлы:**
- `user.ts` - Типы для пользователей
- `exercise.ts` - Типы для упражнений
- `training.ts` - Типы для тренировок
- `index.ts` - Экспорт всех типов для удобного импорта

**Зачем:**
- Единая точка правды для типов данных
- Предотвращение дублирования типов
- Лучшая IntelliSense поддержка
- Предотвращение ошибок на этапе компиляции

### 📁 `hooks/` - Кастомные хуки

**Назначение:** Переиспользуемые логические блоки.

**Файлы:**
- `useAuth.ts` - Логика аутентификации
- `useApi.ts` - Общие хуки для работы с API

**Зачем:**
- Повторное использование логики
- Разделение бизнес-логики от UI
- Легкость тестирования
- Упрощение компонентов

### 📁 `utils/` - Вспомогательные функции

**Назначение:** Утилитарные функции и константы.

**Файлы:**
- `constants.ts` - Константы приложения
- `helpers.ts` - Вспомогательные функции (форматирование дат, валидация и т.д.)

**Зачем:**
- Централизованное хранение вспомогательной логики
- Повторное использование
- Легкость тестирования
- Чистота компонентов

### 📁 `routes/` - Конфигурация маршрутов

**Назначение:** Централизованная конфигурация маршрутов приложения.

**Файлы:**
- `index.tsx` - Все маршруты приложения

**Зачем:**
- Единое место для управления маршрутами
- Легкость добавления/удаления страниц
- Поддержка вложенных маршрутов
- Защита маршрутов (auth guards)

## 🎯 Преимущества такой архитектуры

### 🔧 Масштабируемость
- Легко добавлять новые функции и модули
- Четкое разделение ответственности
- Минимальные конфликты при командной разработке

### 🛡️ Поддерживаемость
- Легко находить нужные файлы
- Предсказуемая структура
- Четкие границы между слоями

### 🚀 Готовность к интеграции
- Все подготовлено для подключения к бэкенду
- Централизованное управление API
- Готовая система аутентификации

### 🧪 Тестируемость
- Изолированные компоненты
- Централизованное состояние
- Переиспользуемые хуки

## 📈 План миграции

1. **Создание базовой структуры** - создать все директории и файлы-заглушки
2. **Перенос типов** - переместить существующие интерфейсы в `types/`
3. **Настройка API слоя** - создать `client.ts` и API сервисы
4. **Миграция компонентов** - перенести существующие компоненты в новую структуру
5. **Настройка состояния** - реализовать хранилища Zustand
6. **Настройка маршрутов** - создать систему навигации
7. **Интеграция с бэкендом** - заменить моки на реальные API вызовы

Эта архитектура обеспечивает четкую организацию кода, легкость поддержки и готовность к интеграции с бэкендом на Java + PostgreSQL.

sport-app-backend/
├── src/
│   └── main/
│       ├── java/com/sportapp/
│       │   ├── SportAppApplication.java
│       │   ├── config/
│       │   ├── controller/
│       │   ├── service/
│       │   ├── repository/
│       │   ├── model/
│       │   ├── dto/
│       │   └── exception/
│       └── resources/
│           ├── application.properties
│           └── schema.sql (если нужно)
├── pom.xml
└── README.md