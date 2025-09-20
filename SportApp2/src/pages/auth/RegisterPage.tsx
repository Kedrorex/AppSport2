import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';
import { authApi } from '../../api/auth';
import type { RegisterRequest } from '../../types';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Anchor,
  Container,
  Alert
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { login: setUserLogin, isAuthenticated } = useUserStore();

  // Если пользователь уже авторизован, перенаправляем на тренировки
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/training');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const userData: RegisterRequest = { name, email, password };
      const response = await authApi.register(userData);
      setUserLogin(response.user, response.token);
      navigate('/training');
    } catch (err) {
      // Более типобезопасная обработка ошибки
      let errorMessage = 'Произошла ошибка при регистрации';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        // Обработка ошибок от axios
        const axiosError = err as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      
      setError(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={400} my={40}>
      <Title ta="center" mb="xl">Регистрация</Title>
      
      {error && (
        <Alert 
          icon={<IconAlertCircle size="1rem" />} 
          title="Ошибка!" 
          color="red" 
          mb="md"
        >
          {error}
        </Alert>
      )}
      
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Имя"
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            mb="md"
          />
          
          <TextInput
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            mb="md"
          />
          
          <PasswordInput
            label="Пароль"
            placeholder="Ваш пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
            mb="xl"
          />
          
          <Button 
            type="submit" 
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Зарегистрироваться
          </Button>
        </form>
        
        <Text ta="center" mt="md">
          Уже есть аккаунт?{' '}
          <Anchor component={Link} to="/login">
            Войдите
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}