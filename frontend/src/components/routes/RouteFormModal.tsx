import { useCallback as _useCallback } from 'react';
import {
  Box, Typography, TextField, Button, Autocomplete, Chip, IconButton, useTheme,
} from '@mui/material';
import { Add, Delete, Save, Close } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ModalOverlay } from '../ui/ModalOverlay';
import { HOLD_COLORS } from '../../constants/routes';
import { ROUTE_TYPE_OPTIONS, GRADE_LABELS, HOLD_COLOR_NAMES } from '../../constants/filters';
import { useCreateRoute, useUpdateRoute } from '../../services/hooks/useRoutes';
import { useTags } from '../../services/hooks/useTags';
import type { RouteDto, RouteType, CreateRoutePayload, UpdateRoutePayload } from '../../types/route';

const ROUTE_TYPE_VALUES = ROUTE_TYPE_OPTIONS.filter((o) => o.value !== 'all').map((o) => o.value as RouteType);
const GRADE_OPTIONS = Object.values(GRADE_LABELS);

const STATUS_OPTIONS: { value: boolean; label: string }[] = [
  { value: true, label: 'Активна' },
  { value: false, label: 'Архив' },
];

const routeFormSchema = z.object({
  gymId: z.string().optional(),
  setterId: z.string().optional(),
  name: z.string().min(1, 'Обязательное поле'),
  gradeRaw: z.string().min(1, 'Обязательное поле'),
  type: z.enum(['Boulder', 'Lead', 'TopRope', 'Speed']),
  holdColor: z.string().min(1, 'Обязательное поле'),
  sector: z.string().optional().or(z.literal('')),
  tags: z.array(z.string()),
  description: z.string().optional().or(z.literal('')),
  photoUrls: z.array(z.string()),
  isActive: z.boolean(),
});

type RouteFormValues = z.infer<typeof routeFormSchema>;

interface RouteFormModalProps {
  open: boolean;
  route?: RouteDto;
  gymId?: string;
  gymOptions?: { id: string; name: string }[];
  setterOptions?: { id: string; name: string }[];
  onClose: () => void;
}

export function RouteFormModal({ open, route, gymId, gymOptions, setterOptions, onClose }: RouteFormModalProps) {
  const { mutateAsync: createMutate, isPending: creating } = useCreateRoute();
  const { mutateAsync: updateMutate, isPending: updating } = useUpdateRoute(route?.id ?? '');
  const { data: apiTags } = useTags();
  const saving = creating || updating;
  const allTagOptions = (apiTags ?? []).map((t) => t.name);

  const handleSave = async (values: RouteFormValues) => {
    const cleanedPhotos = values.photoUrls.filter(Boolean);
    if (route) {
      const payload: UpdateRoutePayload = {
        name: values.name.trim(),
        gradeRaw: values.gradeRaw,
        type: values.type,
        holdColor: values.holdColor,
        sector: values.sector?.trim() || null,
        tags: values.tags,
        description: values.description?.trim() || null,
        photoUrls: cleanedPhotos,
        isActive: values.isActive,
        setterId: values.setterId || undefined,
      };
      await updateMutate(payload);
    } else {
      const effectiveGymId = gymId || values.gymId;
      if (!effectiveGymId) return;
      const payload: CreateRoutePayload = {
        gymId: effectiveGymId,
        name: values.name.trim(),
        gradeRaw: values.gradeRaw,
        type: values.type,
        holdColor: values.holdColor,
        sector: values.sector?.trim() || undefined,
        tags: values.tags,
        description: values.description?.trim() || undefined,
        photoUrls: cleanedPhotos,
        isActive: values.isActive,
        setterId: values.setterId || undefined,
      };
      await createMutate(payload);
    }
    onClose();
  };

  return (
    <ModalOverlay open={open} onClose={onClose} maxWidth={720}>
      {open && (
        <RouteFormContent
          key={route?.id ?? 'new'}
          route={route}
          gymId={gymId}
          gymOptions={gymOptions}
          setterOptions={setterOptions}
          onClose={onClose}
          saving={saving}
          onSave={handleSave}
          isEdit={!!route}
          allTagOptions={allTagOptions}
        />
      )}
    </ModalOverlay>
  );
}

function RouteFormContent({
  route, gymId, gymOptions, setterOptions, onClose, saving, onSave, isEdit, allTagOptions,
}: {
  route?: RouteDto;
  gymId?: string;
  gymOptions?: { id: string; name: string }[];
  setterOptions?: { id: string; name: string }[];
  onClose: () => void;
  saving: boolean;
  onSave: (data: RouteFormValues) => Promise<void>;
  isEdit: boolean;
  allTagOptions: string[];
}) {
  const theme = useTheme();

  const { control, handleSubmit, formState: { errors } } = useForm<RouteFormValues>({
    resolver: zodResolver(routeFormSchema),
    defaultValues: {
      gymId: gymId ?? '',
      setterId: route?.setterId ?? '',
      name: route?.name ?? '',
      gradeRaw: route?.grade ?? '',
      type: route?.type ?? 'Boulder',
      holdColor: route?.holdColor ?? 'Red',
      sector: route?.sector ?? '',
      tags: route?.tags ?? [],
      description: route?.description ?? '',
      photoUrls: route?.photoUrls.length ? route.photoUrls : [''],
      isActive: route ? route.status === 'Active' : true,
    },
  });

  const fieldSx = {
    '& .MuiInputBase-root': { fontSize: '0.85rem' },
    '& .MuiInputLabel-root': { fontSize: '0.82rem' },
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSave)} sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 2.5, height: '100%' }}>
      <Typography sx={{ fontSize: '1.15rem', fontWeight: 800, color: theme.palette.text.primary }}>
        {isEdit ? 'Редактировать трассу' : 'Новая трасса'}
      </Typography>

      {/* Скалодром (только при создании) */}
      {!isEdit && !gymId && gymOptions && gymOptions.length > 0 && (
        <Controller
          name="gymId"
          control={control}
          render={({ field }) => (
            <Autocomplete
              size="small"
              options={gymOptions}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, val) => option.id === val.id}
              value={gymOptions.find((g) => g.id === field.value) ?? null}
              onChange={(_, v) => field.onChange(v?.id ?? '')}
              renderInput={(params) => (
                <TextField {...params} label="Скалодром" error={!!errors.gymId} helperText={errors.gymId?.message} sx={fieldSx} required />
              )}
              sx={fieldSx}
            />
          )}
        />
      )}
      {!isEdit && !gymId && (!gymOptions || gymOptions.length === 0) && (
        <Typography sx={{ fontSize: '0.82rem', color: 'error.main' }}>
          Нет доступных скалодромов для создания трассы
        </Typography>
      )}

      {/* Название + Грейд */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Название"
              size="small"
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={fieldSx}
              required
            />
          )}
        />
        <Controller
          name="gradeRaw"
          control={control}
          render={({ field }) => (
            <Autocomplete
              size="small"
              freeSolo
              options={GRADE_OPTIONS}
              value={field.value}
              onChange={(_, v) => field.onChange(v || '')}
              onInputChange={(_, v) => field.onChange(v)}
              renderInput={(params) => (
                <TextField {...params} label="Грейд" error={!!errors.gradeRaw} helperText={errors.gradeRaw?.message} sx={fieldSx} required />
              )}
              sx={fieldSx}
            />
          )}
        />
      </Box>

      {/* Тип */}
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <Box>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'text.secondary', mb: 0.75 }}>
              Тип {errors.type && <span style={{ color: theme.palette.error.main }}> — {errors.type.message}</span>}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
              {ROUTE_TYPE_VALUES.map((t) => (
                <Chip
                  key={t}
                  label={ROUTE_TYPE_OPTIONS.find((o) => o.value === t)?.label || t}
                  size="small"
                  onClick={() => field.onChange(t)}
                  sx={{
                    background: field.value === t ? theme.palette.primary.main : theme.custom.surface2,
                    color: field.value === t ? theme.palette.primary.contrastText : theme.palette.text.secondary,
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    '&:hover': { opacity: 0.85 },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      />

      {/* Цвет зацепок */}
      <Controller
        name="holdColor"
        control={control}
        render={({ field }) => (
          <Box>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'text.secondary', mb: 0.75 }}>
              Цвет зацепок {errors.holdColor && <span style={{ color: theme.palette.error.main }}> — {errors.holdColor.message}</span>}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
              {HOLD_COLOR_NAMES.filter((c) => c !== 'all').map((color) => (
                <Box
                  key={color}
                  onClick={() => field.onChange(color)}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: HOLD_COLORS[color] || color,
                    border: field.value === color ? `3px solid ${theme.palette.primary.main}` : `2px solid ${theme.palette.divider}`,
                    cursor: 'pointer',
                    transition: 'transform 0.15s',
                    '&:hover': { transform: 'scale(1.15)' },
                    boxShadow: field.value === color ? `0 0 0 2px ${theme.palette.primary.main}` : 'none',
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      />

      {/* Сектор + статус */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <Controller
          name="sector"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Сектор" size="small" sx={fieldSx} />
          )}
        />
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <Box>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'text.secondary', mb: 0.75 }}>
                Статус
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.75 }}>
                {STATUS_OPTIONS.map((opt) => (
                  <Chip
                    key={String(opt.value)}
                    label={opt.label}
                    size="small"
                    onClick={() => field.onChange(opt.value)}
                    sx={{
                      background: field.value === opt.value ? theme.palette.primary.main : theme.custom.surface2,
                      color: field.value === opt.value ? theme.palette.primary.contrastText : theme.palette.text.secondary,
                      fontWeight: 600,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        />
      </Box>

      {/* Рутсеттер */}
      {setterOptions && setterOptions.length > 0 && (
        <Controller
          name="setterId"
          control={control}
          render={({ field }) => (
            <Autocomplete
              size="small"
              options={setterOptions}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, val) => option.id === val.id}
              value={setterOptions.find((s) => s.id === field.value) ?? null}
              onChange={(_, v) => field.onChange(v?.id ?? '')}
              renderInput={(params) => <TextField {...params} label="Рутсеттер" sx={fieldSx} />}
              sx={fieldSx}
            />
          )}
        />
      )}

      {/* Теги */}
      <Controller
        name="tags"
        control={control}
        render={({ field }) => (
          <Autocomplete<string, true, false, true>
            multiple
            freeSolo
            size="small"
            options={allTagOptions}
            value={field.value}
            onChange={(_, v) => field.onChange(v)}
            renderInput={(params) => <TextField {...params} label="Теги" sx={fieldSx} placeholder="Добавить тег…" />}
            slotProps={{ chip: { size: 'small' as const } }}
            sx={fieldSx}
          />
        )}
      />

      {/* Описание */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Описание"
            size="small"
            multiline
            minRows={3}
            sx={fieldSx}
          />
        )}
      />

      {/* Фото */}
      <Controller
        name="photoUrls"
        control={control}
        render={({ field }) => (
          <Box>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'text.secondary', mb: 0.75 }}>
              Фото (URL)
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {field.value.map((url, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                  <TextField
                    size="small"
                    placeholder="https://…"
                    value={url}
                    onChange={(e) => {
                      const next = [...field.value];
                      next[i] = e.target.value;
                      field.onChange(next);
                    }}
                    sx={{ flex: 1, ...fieldSx }}
                  />
                  {url && (
                    <Box
                      sx={{
                        width: 40, height: 40, borderRadius: 1, background: theme.custom.surface2,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.7rem', color: theme.custom.text3, flexShrink: 0, overflow: 'hidden',
                      }}
                    >
                      📷
                    </Box>
                  )}
                  <IconButton size="small" onClick={() => field.onChange(field.value.filter((_, idx) => idx !== i))} color="error" disabled={field.value.length <= 1}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              <Button size="small" startIcon={<Add />} onClick={() => field.onChange([...field.value, ''])} sx={{ alignSelf: 'flex-start', fontSize: '0.82rem' }}>
                Добавить фото
              </Button>
            </Box>
          </Box>
        )}
      />

      {/* Кнопки */}
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 'auto' }}>
        <Button type="submit" variant="contained" color="primary" startIcon={<Save />} disabled={saving}>
          {saving ? 'Сохранение…' : 'Сохранить'}
        </Button>
        <Button variant="outlined" startIcon={<Close />} onClick={onClose} disabled={saving}>
          Отмена
        </Button>
      </Box>
    </Box>
  );
}
