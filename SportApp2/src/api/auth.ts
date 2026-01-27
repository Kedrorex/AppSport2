import { apiClient } from './client';
import type { User, LoginRequest, RegisterRequest } from '../types';

export interface AuthResponse {
  user: User;
  token: string;
}

// API методы для аутентификации
export const authApi = {
  // Вход в систему
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
    return response.data;
  },

  // Регистрация нового пользователя
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', userData);
    return response.data;
  },

  // Получение информации о текущем пользователе
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/auth/me');
    return response.data;
  },

  // Выход из системы
  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout');
  }
};