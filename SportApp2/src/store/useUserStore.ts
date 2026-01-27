import { create } from 'zustand';
import { authApi } from '../api/auth';
import type { User } from '../types';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadUser: () => Promise<void>; // Добавляем метод
  clearError: () => void; // Добавляем метод для очистки ошибок
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  
  login: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, isAuthenticated: true, error: null });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },
  
  setUser: (user) => set({ user }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
  
  // Новый метод для загрузки текущего пользователя
  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        set({ loading: true, error: null });
        const user = await authApi.getCurrentUser();
        set({ user, isAuthenticated: true, loading: false });
      } catch (err: unknown) {
        const error = err as { response?: { status?: number } };
        // Не удаляем токен автоматически при 401 - даем пользователю шанс
        // Токен будет удален только при явном логауте или новой авторизации
        if (error.response?.status === 401) {
          console.warn('Token expired or invalid, but keeping it for potential refresh');
        } else {
          console.error('Failed to load user:', err);
        }
        set({ user: null, isAuthenticated: false, loading: false });
      }
    }
  }
}));