import { useNavigate, useSearchParams } from 'react-router-dom';
import { TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../stores/authStore';
import { AuthFormLayout } from '../components/ui/AuthFormLayout';
import DevLoginDialog from '../components/features/DevLoginDialog';
import { useState } from 'react';

const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль не менее 6 символов'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoading, error } = useAuthStore();
  const [devOpen, setDevOpen] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    await login(values.email, values.password);
    const state = useAuthStore.getState();
    if (!state.error) {
      const fromRedirect = searchParams.get('redirect');
      if (fromRedirect) {
        navigate(decodeURIComponent(fromRedirect), { replace: true });
      } else {
        const roleRoutes: Record<string, string> = {
          Routesetter: '/routesetter',
          GymAdmin: '/gym-admin',
          Admin: '/admin',
        };
        navigate(roleRoutes[state.role ?? ''] || '/feed', { replace: true });
      }
    }
  };

  return (
    <>
    <AuthFormLayout
      subtitle="Войдите в своё пространство"
      submitLabel="Войти"
      isLoading={isLoading}
      error={error}
      validationError={errors.email?.message || errors.password?.message || null}
      onSubmit={handleSubmit(onSubmit)}
      footerText="Нет аккаунта?"
      footerLinkLabel="Зарегистрироваться"
      footerLinkTo="/register"
      footerExtra={import.meta.env.VITE_DEV_ACCOUNTS_ENABLED === 'true' ? (
        <button
          onClick={() => setDevOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#26A69A',
            fontSize: '0.78rem',
            fontFamily: 'inherit',
            padding: 0,
            transition: 'opacity .15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '.7')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Войти в тестовый аккаунт →
        </button>
      ) : undefined}
    >
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email"
            type="email"
            fullWidth
            required
            autoFocus
            size="small"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Пароль"
            type="password"
            fullWidth
            required
            size="small"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        )}
      />
    </AuthFormLayout>
    <DevLoginDialog open={devOpen} onClose={() => setDevOpen(false)} />
    </>
  );
}
