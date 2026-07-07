import { Box, Typography, TextField, Button, IconButton, useTheme } from '@mui/material';
import { Add, Delete, Save, Close } from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '../../theme/cardStyles';
import type { GymDto, UpdateGymPayload } from '../../types/gym';

interface GymProfileEditorProps {
  gym: GymDto;
  editing?: boolean;
  onSave?: (data: UpdateGymPayload) => void;
  onCancel?: () => void;
  saving?: boolean;
}

export function GymProfileEditor({ gym, editing = false, onSave, onCancel, saving }: GymProfileEditorProps) {

  if (!editing) {
    return <ReadOnlyView gym={gym} />;
  }
  return <EditForm key={gym.id} gym={gym} onSave={onSave} onCancel={onCancel} saving={saving} />;
}

/* ---------- Read-only ---------- */
function ReadOnlyView({ gym }: { gym: GymDto }) {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
      <Box sx={{ ...Card(theme), display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: theme.palette.text.primary }}>
          Основная информация
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <InfoRow label="Название" value={gym.name} />
          <InfoRow label="Город" value={gym.city} />
          <InfoRow label="Адрес" value={gym.address} />
          <InfoRow label="Описание" value={gym.description || '—'} />
          <InfoRow label="Телефон" value={gym.phone || '—'} />
          <InfoRow label="Email" value={gym.email || '—'} />
          <InfoRow label="Сайт" value={gym.website || '—'} />
        </Box>
      </Box>
      <Box sx={{ ...Card(theme), display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: theme.palette.text.primary }}>
          Часы и цены
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          {Array.isArray(gym.hours) ? gym.hours.map((entry) => (
            <InfoRow key={entry.days} label={entry.days} value={`${entry.from} – ${entry.to}`} />
          )) : null}
          {gym.prices.map((price) => (
            <InfoRow key={price.name} label={price.name} value={`${price.price} ₽`} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  return (
    <Box>
      <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: theme.palette.text.secondary, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.primary, mt: 0.25 }}>
        {value}
      </Typography>
    </Box>
  );
}

/* ---------- Edit Form ---------- */

// ── Zod schema ───────────────────────────────────────────

const hourEntrySchema = z.object({ days: z.string(), from: z.string(), to: z.string() });
const priceEntrySchema = z.object({ name: z.string(), price: z.string() });

const gymProfileSchema = z.object({
  name: z.string().min(1, 'Обязательное поле'),
  city: z.string().min(1, 'Обязательное поле'),
  address: z.string().min(1, 'Обязательное поле'),
  description: z.string().optional().or(z.literal('')),
  phone: z.string().regex(/^[\d\s+\-()]*$/, 'Некорректный формат').optional().or(z.literal('')),
  email: z.string().email('Некорректный email').optional().or(z.literal('')),
  website: z.string().optional().or(z.literal('')),
  socialLinks: z.string().optional().or(z.literal('')),
  latitude: z.union([z.coerce.number().min(-90).max(90), z.literal('')]).optional(),
  longitude: z.union([z.coerce.number().min(-180).max(180), z.literal('')]).optional(),
  area: z.union([z.coerce.number().positive('Положительное число'), z.literal('')]).optional(),
  maxHeight: z.union([z.coerce.number().positive('Положительное число'), z.literal('')]).optional(),
  yearOpened: z.union([z.coerce.number().int().min(1900, 'От 1900').max(2030, 'До 2030'), z.literal('')]).optional(),
  metroStations: z.string().optional().or(z.literal('')),
  tags: z.string().optional().or(z.literal('')),
  hours: z.array(hourEntrySchema),
  prices: z.array(priceEntrySchema),
  photoUrls: z.array(z.string()),
});

type GymFormValues = z.infer<typeof gymProfileSchema>;

function EditForm({ gym, onSave, onCancel, saving }: {
  gym: GymDto;
  onSave?: (data: UpdateGymPayload) => void;
  onCancel?: () => void;
  saving?: boolean;
}) {
  const theme = useTheme();

  const { control, handleSubmit, formState: { errors } } = useForm<GymFormValues>({
    resolver: zodResolver(gymProfileSchema) as any,
    defaultValues: {
      name: gym.name,
      city: gym.city,
      address: gym.address,
      description: gym.description ?? '',
      phone: gym.phone ?? '',
      email: gym.email ?? '',
      website: gym.website ?? '',
      socialLinks: (gym.socialLinks ?? []).join('\n'),
      latitude: gym.lat?.toString() ?? '',
      longitude: gym.lon?.toString() ?? '',
      area: gym.wallArea?.toString() ?? '',
      maxHeight: gym.maxHeight?.toString() ?? '',
      yearOpened: gym.yearFounded?.toString() ?? '',
      metroStations: gym.metroStations.join(', '),
      tags: gym.tags.join(', '),
      hours: (gym.hours ?? []).map((entry) => ({
        days: entry.days,
        from: entry.from,
        to: entry.to,
      })),
      prices: gym.prices,
      photoUrls: gym.photoUrls,
    } as any,
  });

  const { fields: hourFields, append: appendHour, remove: removeHour } = useFieldArray({ control, name: 'hours' });
  const { fields: priceFields, append: appendPrice, remove: removePrice } = useFieldArray({ control, name: 'prices' });
  const { fields: photoFields, append: appendPhoto, remove: removePhoto } = useFieldArray({ control, name: 'photoUrls' as 'hours' });

  const onSubmit = (values: GymFormValues) => {
    onSave?.({
      name: values.name || undefined,
      city: values.city || undefined,
      address: values.address || undefined,
      description: values.description || null,
      phone: values.phone || null,
      email: values.email || null,
      website: values.website || null,
      socialLinks: values.socialLinks ? values.socialLinks.split('\n').map(s => s.trim()).filter(Boolean) : undefined,
      latitude: values.latitude ? Number(values.latitude) : null,
      longitude: values.longitude ? Number(values.longitude) : null,
      area: values.area ? Number(values.area) : null,
      maxHeight: values.maxHeight ? Number(values.maxHeight) : null,
      yearOpened: values.yearOpened ? Number(values.yearOpened) : null,
      metroStations: values.metroStations ? values.metroStations.split(',').map(s => s.trim()).filter(Boolean) : [],
      tags: values.tags ? values.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
      photoUrls: values.photoUrls.filter(Boolean),
      hours: values.hours.filter(h => h.days),
      prices: values.prices.filter(p => p.name),
    });
  };

  const fieldSx = { '& .MuiInputBase-root': { fontSize: '0.85rem' }, '& .MuiInputLabel-root': { fontSize: '0.82rem' } };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit as any)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button type="submit" variant="contained" color="primary" size="small" startIcon={<Save />} disabled={saving}>
          {saving ? 'Сохранение…' : 'Сохранить'}
        </Button>
        <Button variant="outlined" size="small" startIcon={<Close />} onClick={onCancel} disabled={saving}>
          Отмена
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
        {/* Left — Основная информация */}
        <Box sx={{ ...Card(theme), display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: theme.palette.text.primary }}>
            Основная информация
          </Typography>
          <Controller name="name" control={control} render={({ field }) => (
            <TextField {...field} label="Название" size="small" sx={fieldSx} required error={!!errors.name} helperText={errors.name?.message} />
          )} />
          <Controller name="city" control={control} render={({ field }) => (
            <TextField {...field} label="Город" size="small" sx={fieldSx} required error={!!errors.city} helperText={errors.city?.message} />
          )} />
          <Controller name="address" control={control} render={({ field }) => (
            <TextField {...field} label="Адрес" size="small" sx={fieldSx} required error={!!errors.address} helperText={errors.address?.message} />
          )} />
          <Controller name="description" control={control} render={({ field }) => (
            <TextField {...field} label="Описание" size="small" multiline minRows={3} sx={fieldSx} />
          )} />
          <Controller name="metroStations" control={control} render={({ field }) => (
            <TextField {...field} label="Метро (через запятую)" size="small" sx={fieldSx} />
          )} />
          <Controller name="tags" control={control} render={({ field }) => (
            <TextField {...field} label="Теги (через запятую)" size="small" sx={fieldSx} />
          )} />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <Controller name="area" control={control} render={({ field }) => (
              <TextField {...field} label="Площадь (м²)" size="small" type="number" sx={fieldSx} error={!!errors.area} helperText={errors.area?.message} />
            )} />
            <Controller name="maxHeight" control={control} render={({ field }) => (
              <TextField {...field} label="Макс. высота (м)" size="small" type="number" sx={fieldSx} error={!!errors.maxHeight} helperText={errors.maxHeight?.message} />
            )} />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <Controller name="yearOpened" control={control} render={({ field }) => (
              <TextField {...field} label="Год открытия" size="small" type="number" sx={fieldSx} error={!!errors.yearOpened} helperText={errors.yearOpened?.message} />
            )} />
            <Box />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <Controller name="latitude" control={control} render={({ field }) => (
              <TextField {...field} label="Широта" size="small" type="number" sx={fieldSx} slotProps={{ htmlInput: { step: 0.0001 } }} error={!!errors.latitude} helperText={errors.latitude?.message} />
            )} />
            <Controller name="longitude" control={control} render={({ field }) => (
              <TextField {...field} label="Долгота" size="small" type="number" sx={fieldSx} slotProps={{ htmlInput: { step: 0.0001 } }} error={!!errors.longitude} helperText={errors.longitude?.message} />
            )} />
          </Box>
        </Box>

        {/* Right — Контакты, часы, цены */}
        <Box sx={{ ...Card(theme), display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: theme.palette.text.primary }}>
            Контакты
          </Typography>
          <Controller name="phone" control={control} render={({ field }) => (
            <TextField {...field} label="Телефон" size="small" sx={fieldSx} error={!!errors.phone} helperText={errors.phone?.message} />
          )} />
          <Controller name="email" control={control} render={({ field }) => (
            <TextField {...field} label="Email" size="small" sx={fieldSx} error={!!errors.email} helperText={errors.email?.message} />
          )} />
          <Controller name="website" control={control} render={({ field }) => (
            <TextField {...field} label="Сайт" size="small" sx={fieldSx} error={!!errors.website} helperText={errors.website?.message} />
          )} />
          <Controller name="socialLinks" control={control} render={({ field }) => (
            <TextField {...field} label="Соцсети (по одной на строку)" size="small" multiline rows={3} sx={fieldSx} />
          )} />

          {/* Часы работы (useFieldArray) */}
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: theme.palette.text.primary, mt: 1 }}>
            Часы работы
          </Typography>
          {hourFields.map((item, i) => (
            <Box key={item.id} sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <Controller name={`hours.${i}.days`} control={control} render={({ field }) => (
                <TextField {...field} size="small" placeholder="Пн-Пт" sx={{ minWidth: 90, ...fieldSx }} />
              )} />
              <Controller name={`hours.${i}.from`} control={control} render={({ field }) => (
                <TextField {...field} size="small" placeholder="08:00" sx={{ maxWidth: 80, ...fieldSx }} />
              )} />
              <Typography sx={{ color: theme.palette.text.secondary }}>–</Typography>
              <Controller name={`hours.${i}.to`} control={control} render={({ field }) => (
                <TextField {...field} size="small" placeholder="23:00" sx={{ maxWidth: 80, ...fieldSx }} />
              )} />
              <IconButton size="small" onClick={() => removeHour(i)} color="error"><Delete fontSize="small" /></IconButton>
            </Box>
          ))}
          <Button size="small" startIcon={<Add />} onClick={() => appendHour({ days: '', from: '', to: '' })} sx={{ alignSelf: 'flex-start', fontSize: '0.82rem' }}>
            Добавить день
          </Button>

          {/* Цены (useFieldArray) */}
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: theme.palette.text.primary, mt: 1 }}>
            Цены
          </Typography>
          {priceFields.map((item, i) => (
            <Box key={item.id} sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <Controller name={`prices.${i}.name`} control={control} render={({ field }) => (
                <TextField {...field} size="small" placeholder="Название" sx={{ flex: 1, ...fieldSx }} />
              )} />
              <Controller name={`prices.${i}.price`} control={control} render={({ field }) => (
                <TextField {...field} size="small" placeholder="Цена" type="number" sx={{ maxWidth: 100, ...fieldSx }} />
              )} />
              <Typography sx={{ color: theme.palette.text.secondary }}>₽</Typography>
              <IconButton size="small" onClick={() => removePrice(i)} color="error"><Delete fontSize="small" /></IconButton>
            </Box>
          ))}
          <Button size="small" startIcon={<Add />} onClick={() => appendPrice({ name: '', price: '' })} sx={{ alignSelf: 'flex-start', fontSize: '0.82rem' }}>
            Добавить цену
          </Button>

          {/* Фото (useFieldArray) */}
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: theme.palette.text.primary, mt: 1 }}>
            Фото (URL)
          </Typography>
          {photoFields.map((item, i) => (
            <Box key={item.id} sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <Controller name={`photoUrls.${i}`} control={control} render={({ field }) => (
                <TextField {...field} size="small" placeholder="https://…" sx={{ flex: 1, ...fieldSx }} />
              )} />
              <IconButton size="small" onClick={() => removePhoto(i)} color="error"><Delete fontSize="small" /></IconButton>
            </Box>
          ))}
          <Button size="small" startIcon={<Add />} onClick={() => appendPhoto('' as any as any)} sx={{ alignSelf: 'flex-start', fontSize: '0.82rem' }}>
            Добавить фото
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
