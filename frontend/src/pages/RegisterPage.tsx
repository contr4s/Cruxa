import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import { useAuthStore } from '../stores/authStore';
import { AuthFormLayout } from '../components/ui/AuthFormLayout';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!username.trim()) {
      setValidationError('Введите имя пользователя');
      return;
    }
    if (!email.trim()) {
      setValidationError('Введите email');
      return;
    }
    if (password.length < 6) {
      setValidationError('Пароль должен быть не менее 6 символов');
      return;
    }
    if (password !== confirmPassword) {
      setValidationError('Пароли не совпадают');
      return;
    }

    try {
      await register(email, username, password);
      navigate('/feed', { replace: true });
    } catch {
      // error is set in store
    }
  };

  return (
    <AuthFormLayout
      subtitle="Присоединяйтесь к сообществу"
      submitLabel="Создать аккаунт"
      isLoading={isLoading}
      error={error}
      validationError={validationError}
      onSubmit={handleSubmit}
      footerText="Уже есть аккаунт?"
      footerLinkLabel="Войти"
      footerLinkTo="/login"
    >
      <TextField
        label="Имя пользователя"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        required
        autoFocus
        size="small"
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
        size="small"
      />
      <TextField
        label="Пароль"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
        size="small"
        helperText="Минимум 6 символов"
      />
      <TextField
        label="Подтвердите пароль"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
        required
        size="small"
      />
    </AuthFormLayout>
  );
}
