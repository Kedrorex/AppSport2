import { create } from 'zustand';
import { authApi } from '../api/auth';
import type { Role, User } from '../types';
import { extractRoleFromToken } from '../utils/jwt';

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
  loadUser: () => Promise<void>;
  clearError: () => void;
}

const withTokenRole = (user: User, token: string): User => {
  const tokenRole = extractRoleFromToken(token);
  if (!tokenRole) {
    return user;
  }

  return {
    ...user,
    role: tokenRole as Role,
  };
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: (user, token) => {
    localStorage.setItem('token', token);
    set({ user: withTokenRole(user, token), isAuthenticated: true, error: null });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        set({ loading: true, error: null });
        const user = await authApi.getCurrentUser();
        set({ user: withTokenRole(user, token), isAuthenticated: true, loading: false });
      } catch {
        set({ user: null, isAuthenticated: false, loading: false });
      }
    }
  }
}));
