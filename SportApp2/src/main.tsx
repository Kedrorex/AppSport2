// src/main.tsx
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core'; // ✅ Убрал неиспользуемый ColorSchemeScript
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '@mantine/core/styles.css';

export function Main() {
  // Получаем сохраненную тему из localStorage или используем системную
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setColorScheme(savedTheme as 'light' | 'dark');
    } else {
      // Проверяем системную тему
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setColorScheme(systemTheme);
    }
  }, []);

  const toggleColorScheme = (value?: 'light' | 'dark') => {
    const newColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(newColorScheme);
    localStorage.setItem('theme', newColorScheme);
  };

  return (
    <MantineProvider 
      defaultColorScheme="light"
      forceColorScheme={colorScheme}
    >
      <BrowserRouter>
        <App toggleColorScheme={toggleColorScheme} colorScheme={colorScheme} />
      </BrowserRouter>
    </MantineProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);