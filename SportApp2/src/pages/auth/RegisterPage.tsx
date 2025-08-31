import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';

export function RegisterPage() {
  const [name, setName] = useState('');
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
      // const response = await authApi.register({ name, email, password });
      // login(response.data.user, response.data.token);
      
      // Пока используем мок данные
      const mockUser = {
        id: 1,
        email,
        name,
        createdAt: new Date().toISOString()
      };
      login(mockUser, 'mock-token');
      navigate('/trainings');
    } catch (error) {
      // Используем error, чтобы избежать ESLint ошибки
      console.error('Registration error:', error);
      setError('Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
}