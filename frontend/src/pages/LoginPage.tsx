import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TextField } from '@mui/material';
import { useAuthStore } from '../stores/authStore';
import { AuthFormLayout } from '../components/ui/AuthFormLayout';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoading, error } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!email.trim()) {
      setValidationError('Введите email');
      return;
    }
    if (!password) {
      setValidationError('Введите пароль');
      return;
    }

    try {
      await login(email, password);
      const redirect = searchParams.get('redirect') || '/feed';
      navigate(decodeURIComponent(redirect), { replace: true });
    } catch {
      // error is set in store
    }
  };

  return (
    <AuthFormLayout
      subtitle="Войдите в своё пространство"
      submitLabel="Войти"
      isLoading={isLoading}
      error={error}
      validationError={validationError}
      onSubmit={handleSubmit}
      footerText="Нет аккаунта?"
      footerLinkLabel="Зарегистрироваться"
      footerLinkTo="/register"
    >
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
        autoFocus
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
      />
    </AuthFormLayout>
  );
}
