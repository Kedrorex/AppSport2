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
    } catch (err) { // <-- переименовали переменную
      console.error('Failed to load user:', err); // <-- используем переменную
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false, loading: false });
    }
  }
}
}));