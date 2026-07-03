import { useNavigate } from 'react-router-dom';
import { Box, TextField, Radio, RadioGroup, FormControlLabel, FormHelperText, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../stores/authStore';
import { AuthFormLayout } from '../components/ui/AuthFormLayout';

const registerSchema = z.object({
  email: z.string().email('Введите корректный email'),
  username: z.string().min(2, 'Имя пользователя обязательно'),
  password: z.string().min(6, 'Пароль не менее 6 символов'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'Имя обязательно'),
  lastName: z.string().min(1, 'Фамилия обязательна'),
  gender: z.enum(['M', 'F']).optional(),
  height: z.coerce.number().min(100, 'Минимум 100 см').max(250, 'Максимум 250 см').optional().or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      gender: undefined,
      height: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await register(values.email, values.username, values.password, {
        firstName: values.firstName,
        lastName: values.lastName,
        gender: values.gender,
        height: values.height ? Number(values.height) : undefined,
      });
      navigate('/feed', { replace: true });
    } catch { /* error is set in store */ }
  };

  return (
    <AuthFormLayout
      subtitle="Присоединяйтесь к сообществу"
      submitLabel="Создать аккаунт"
      isLoading={isLoading}
      error={error}
      validationError={errors.confirmPassword?.message || null}
      onSubmit={handleSubmit(onSubmit)}
      footerText="Уже есть аккаунт?"
      footerLinkLabel="Войти"
      footerLinkTo="/login"
    >
      <Controller
        name="firstName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Имя"
            fullWidth
            required
            autoFocus
            size="small"
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
        )}
      />
      <Controller
        name="lastName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Фамилия"
            fullWidth
            required
            size="small"
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        )}
      />
      <Controller
        name="username"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Имя пользователя"
            fullWidth
            required
            size="small"
            error={!!errors.username}
            helperText={errors.username?.message}
          />
        )}
      />
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
            size="small"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />
      <Box sx={{ display: 'flex', gap: 2, flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Пол
              </Typography>
              <RadioGroup row {...field} value={field.value ?? ''} sx={{ flexDirection: 'row' }}>
                <FormControlLabel value="M" control={<Radio size="small" />} label="М" />
                <FormControlLabel value="F" control={<Radio size="small" />} label="Ж" />
              </RadioGroup>
              {errors.gender && <FormHelperText sx={{ m: 0 }}>{errors.gender.message}</FormHelperText>}
            </Box>
          )}
        />
        <Controller
          name="height"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Рост (см)"
              type="number"
              size="small"
              sx={{ minWidth: 140 }}
              slotProps={{ htmlInput: { min: 100, max: 250 } }}
              error={!!errors.height}
              helperText={errors.height?.message}
            />
          )}
        />
      </Box>
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
            helperText={errors.password?.message || 'Минимум 6 символов'}
            error={!!errors.password}
          />
        )}
      />
      <Controller
        name="confirmPassword"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Подтвердите пароль"
            type="password"
            fullWidth
            required
            size="small"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
        )}
      />
    </AuthFormLayout>
  );
}
