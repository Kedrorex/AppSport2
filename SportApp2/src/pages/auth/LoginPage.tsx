import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, setLoading, setError } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Здесь будет API вызов
      // const response = await authApi.login({ email, password });
      // login(response.data.user, response.data.token);
      
      // Пока используем мок данные
      const mockUser = {
        id: 1,
        email,
        name: 'Пользователь',
        createdAt: new Date().toISOString()
      };
      login(mockUser, 'mock-token');
      navigate('/trainings');
    } catch (error) {
      // Используем error, чтобы избежать ESLint ошибки
      console.error('Login error:', error);
      setError('Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}