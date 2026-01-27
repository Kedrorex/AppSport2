import { Routes, Route, Navigate } from 'react-router-dom';
import { NavbarSegmented } from './components/NavbarSegmented';
import { TrainingComponent } from './components/Training/TrainingComponent';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { useAuth } from './hooks/useAuth';
import { ExercisesPage } from './pages/exercises/ExercisesPage';

// Типы для props
interface AppProps {
  toggleColorScheme: (value?: 'light' | 'dark') => void;
  colorScheme: 'light' | 'dark';
}

// Компонент для защищенных маршрутов
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div style={{ padding: '20px' }}>Загрузка...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function App({ toggleColorScheme, colorScheme }: AppProps) {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Защищенные маршруты */}
        <Route 
          path="/training" 
          element={
            <ProtectedRoute>
              <NavbarSegmented toggleColorScheme={toggleColorScheme} colorScheme={colorScheme} />
              <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
                <TrainingComponent />
              </div>
            </ProtectedRoute>
          } 
        />
        <Route
          path="/exercises"
          element={
            <ProtectedRoute>
              <NavbarSegmented toggleColorScheme={toggleColorScheme} colorScheme={colorScheme} />
              <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
                <ExercisesPage />
              </div>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <NavbarSegmented toggleColorScheme={toggleColorScheme} colorScheme={colorScheme} />
              <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
                <div>Главная страница</div>
              </div>
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}