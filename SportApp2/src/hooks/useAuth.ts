import { useEffect } from 'react';
import { useUserStore } from '../store/useUserStore';

export const useAuth = () => {
  const { loadUser, isAuthenticated, user, loading, error } = useUserStore();

  useEffect(() => {
    // Загружаем информацию о пользователе при монтировании
    if (!isAuthenticated && !user) {
      loadUser();
    }
  }, [isAuthenticated, user, loadUser]);

  return { isAuthenticated, user, loading, error };
};