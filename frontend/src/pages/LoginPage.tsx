import { useNavigate, useSearchParams } from 'react-router-dom';
import { TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../stores/authStore';
import { AuthFormLayout } from '../components/ui/AuthFormLayout';

const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль не менее 6 символов'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoading, error } = useAuthStore();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    await login(values.email, values.password);
    const state = useAuthStore.getState();
    if (!state.error) {
      const redirect = searchParams.get('redirect') || '/feed';
      navigate(decodeURIComponent(redirect), { replace: true });
    }
  };

  return (
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
  );
}
