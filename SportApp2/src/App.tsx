// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { NavbarSegmented } from './components/NavbarSegmented';
import { TrainingComponent } from './components/Training/TrainingComponent';

// Типы для props
interface AppProps {
  toggleColorScheme: (value?: 'light' | 'dark') => void;
  colorScheme: 'light' | 'dark';
}

export default function App({ toggleColorScheme, colorScheme }: AppProps) {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <NavbarSegmented toggleColorScheme={toggleColorScheme} colorScheme={colorScheme} />
      <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
        <Routes>
          <Route path="/training" element={<TrainingComponent />} />
          <Route path="/" element={<div>Главная страница</div>} />
        </Routes>
      </div>
    </div>
  );
}