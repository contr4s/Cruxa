import { useState, useCallback, useRef } from 'react';
import {
  Box, Typography, TextField, Button, Radio, RadioGroup,
  FormControlLabel, FormControl, FormLabel, FormHelperText,
  Avatar, IconButton, Divider, useTheme,
} from '@mui/material';
import { PhotoCamera, Save } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ModalOverlay } from '../ui/ModalOverlay';
import { useUpdateUserProfile, useChangePassword } from '../../services/hooks/useUser';
import type { UserDto } from '../../types/user';

// ── Zod schema ───────────────────────────────────────────

const profileEditSchema = z.object({
  firstName: z.string().min(1, 'Имя обязательно'),
  lastName: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  gender: z.enum(['M', 'F']).optional(),
  height: z.coerce.number().min(100, 'Минимум 100 см').max(250, 'Максимум 250 см').optional().or(z.literal('')),
  currentPassword: z.string().min(6, 'Минимум 6 символов').optional().or(z.literal('')),
  newPassword: z.string().min(6, 'Минимум 6 символов').optional().or(z.literal('')),
  confirmNewPassword: z.string().optional().or(z.literal('')),
}).refine(
  (data) => {
    if (!data.newPassword && !data.currentPassword && !data.confirmNewPassword) return true;
    return data.newPassword === data.confirmNewPassword;
  },
  { message: 'Пароли не совпадают', path: ['confirmNewPassword'] },
).refine(
  (data) => {
    if (!data.newPassword && !data.currentPassword) return true;
    return !!data.currentPassword && !!data.newPassword;
  },
  { message: 'Заполните оба поля для смены пароля', path: ['currentPassword'] },
);

type ProfileEditFormValues = z.infer<typeof profileEditSchema>;

// ── Props ────────────────────────────────────────────────

interface ProfileEditFormModalProps {
  open: boolean;
  user: UserDto;
  onClose: () => void;
}

// ── Modal wrapper (mutations) ────────────────────────────

export function ProfileEditFormModal({ open, user, onClose }: ProfileEditFormModalProps) {
  const { mutateAsync: updateProfile, isPending: saving } = useUpdateUserProfile();
  const { mutateAsync: changeUserPassword, isPending: changingPassword } = useChangePassword();

  return (
    <ModalOverlay open={open} onClose={onClose} maxWidth={520}>
      {open && (
        <ProfileEditFormContent
          user={user}
          onClose={onClose}
          saving={saving || changingPassword}
          onSave={async (values) => {
            const payload: Partial<UserDto> = {
              firstName: values.firstName,
              lastName: values.lastName || undefined,
              city: values.city || undefined,
              gender: values.gender || undefined,
              height: values.height ? Number(values.height) : undefined,
            };
            await updateProfile(payload);

            if (values.currentPassword && values.newPassword) {
              await changeUserPassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
              });
            }

            onClose();
          }}
        />
      )}
    </ModalOverlay>
  );
}

// ── Form content ─────────────────────────────────────────

interface ContentProps {
  user: UserDto;
  onClose: () => void;
  saving: boolean;
  onSave: (values: ProfileEditFormValues) => Promise<void>;
}

function ProfileEditFormContent({ user, onClose, saving, onSave }: ContentProps) {
  const theme = useTheme();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<ProfileEditFormValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      city: user.city ?? '',
      gender: (user.gender as 'M' | 'F') ?? undefined,
      height: user.height ?? '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const avatarPreview = avatarFile
    ? URL.createObjectURL(avatarFile)
    : user.avatarUrl ?? undefined;

  const initial = (user.firstName || user.username)[0].toUpperCase();

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSave)}
      sx={{ px: { xs: 2, sm: 3 }, py: 3 }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Редактировать профиль</Typography>
      </Box>

      {/* Avatar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={avatarPreview}
            sx={{
              width: 80, height: 80, fontSize: '2rem',
              bgcolor: theme.palette.primary.main,
              border: `3px solid ${theme.palette.primary.main}`,
            }}
          >
            {initial}
          </Avatar>
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            sx={{
              position: 'absolute', bottom: -4, right: -4,
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              width: 32, height: 32,
              '&:hover': { bgcolor: theme.palette.action.hover },
            }}
          >
            <PhotoCamera sx={{ fontSize: 16 }} />
          </IconButton>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
          />
        </Box>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>Аватар</Typography>
          <Typography variant="body2" sx={{ color: theme.custom.text3 }}>
            JPG, PNG или WebP. 1:1 рекомендован.
          </Typography>
        </Box>
      </Box>

      {/* ── Основная информация ── */}
      <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main, mb: 1.5, fontWeight: 600 }}>
        Основная информация
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mb: 2 }}>
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Имя"
              required
              fullWidth
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
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          )}
        />
      </Box>

      <Controller
        name="city"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Город"
            fullWidth
            sx={{ mb: 2 }}
            error={!!errors.city}
            helperText={errors.city?.message}
          />
        )}
      />

      {/* ── Дополнительно ── */}
      <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main, mb: 1.5, fontWeight: 600 }}>
        Дополнительно
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
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
              sx={{ minWidth: 140 }}
              slotProps={{ htmlInput: { min: 100, max: 250 } }}
              error={!!errors.height}
              helperText={errors.height?.message}
            />
          )}
        />
      </Box>

      {/* ── Смена пароля ── */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main, mb: 1.5, fontWeight: 600 }}>
        Смена пароля
      </Typography>
      <Typography variant="body2" sx={{ color: theme.custom.text3, mb: 2 }}>
        Оставьте поля пустыми, если не хотите менять пароль.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mb: 2 }}>
        <Controller
          name="currentPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Текущий пароль"
              type="password"
              fullWidth
              error={!!errors.currentPassword}
              helperText={errors.currentPassword?.message}
            />
          )}
        />
        <Controller
          name="newPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Новый пароль"
              type="password"
              fullWidth
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
            />
          )}
        />
      </Box>

      <Controller
        name="confirmNewPassword"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Подтвердите новый пароль"
            type="password"
            fullWidth
            sx={{ mb: 3 }}
            error={!!errors.confirmNewPassword}
            helperText={errors.confirmNewPassword?.message}
          />
        )}
      />

      {/* ── Actions ── */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, pt: 1 }}>
        <Button variant="outlined" onClick={onClose} disabled={saving}>
          Отмена
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={saving}
          startIcon={saving ? undefined : <Save />}
        >
          {saving ? 'Сохранение…' : 'Сохранить'}
        </Button>
      </Box>
    </Box>
  );
}
