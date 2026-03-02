import { Routes, Route, Navigate } from 'react-router-dom';
import { NavbarSegmented } from './components/NavbarSegmented';
import { TrainingComponent } from './components/Training/TrainingComponent';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { useAuth } from './hooks/useAuth';
import { ExercisesPage } from './pages/exercises/ExercisesPage';
import classes from './App.module.css';
import { RoleRoute } from './components/RoleRoute';
import { AdminPage } from './pages/admin/AdminPage';
import { SuperPage } from './pages/admin/SuperPage';
import { TrainerPage } from './pages/admin/TrainerPage';

interface AppProps {
  toggleColorScheme: (value?: 'light' | 'dark') => void;
  colorScheme: 'light' | 'dark';
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '20px' }}>Загрузка...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function App({ toggleColorScheme, colorScheme }: AppProps) {
  const renderProtectedPage = (content: React.ReactNode) => (
    <ProtectedRoute>
      <div className={classes.appShell}>
        <NavbarSegmented toggleColorScheme={toggleColorScheme} colorScheme={colorScheme} />
        <div className={classes.content}>{content}</div>
      </div>
    </ProtectedRoute>
  );

  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/training" element={renderProtectedPage(<TrainingComponent />)} />
        <Route path="/exercises" element={renderProtectedPage(<ExercisesPage />)} />
        <Route
          path="/trainer"
          element={renderProtectedPage(
            <RoleRoute allowedRoles={['TRAINER', 'ADMIN', 'SUPERD']}>
              <TrainerPage />
            </RoleRoute>
          )}
        />
        <Route
          path="/admin"
          element={renderProtectedPage(
            <RoleRoute allowedRoles={['ADMIN', 'SUPERD']}>
              <AdminPage />
            </RoleRoute>
          )}
        />
        <Route
          path="/super"
          element={renderProtectedPage(
            <RoleRoute allowedRoles={['SUPERD']}>
              <SuperPage />
            </RoleRoute>
          )}
        />
        <Route path="/" element={renderProtectedPage(<div>Главная страница</div>)} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
