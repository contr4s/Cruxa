import { useState, useCallback } from 'react';
import {
  Box, Typography, TextField, Button, Autocomplete, Chip, IconButton, useTheme,
} from '@mui/material';
import { Add, Delete, Save, Close } from '@mui/icons-material';
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

  return (
    <ModalOverlay open={open} onClose={onClose} maxWidth={720}>
      {open && <RouteFormContent
        key={route?.id ?? 'new'}
        route={route}
        gymId={gymId}
        gymOptions={gymOptions}
        setterOptions={setterOptions}
        onClose={onClose}
        saving={saving}
        onSave={!!route
          ? async (data: UpdateRoutePayload) => { await updateMutate(data); onClose(); }
          : async (data: CreateRoutePayload) => { await createMutate(data); onClose(); }
        }
        isEdit={!!route}
        allTagOptions={allTagOptions}
      />}
    </ModalOverlay>
  );
}

function RouteFormContent({ route, gymId, gymOptions, setterOptions, onClose, saving, onSave, isEdit, allTagOptions }: {
  route?: RouteDto;
  gymId?: string;
  gymOptions?: { id: string; name: string }[];
  setterOptions?: { id: string; name: string }[];
  onClose: () => void;
  saving: boolean;
  onSave: (data: CreateRoutePayload | UpdateRoutePayload) => Promise<void>;
  isEdit: boolean;
  allTagOptions: string[];
}) {
  const theme = useTheme();

  const [selectedGymId, setSelectedGymId] = useState(gymId ?? '');
  const [selectedSetterId, setSelectedSetterId] = useState(route?.setterId ?? '');
  const [name, setName] = useState(route?.name ?? '');
  const [gradeRaw, setGradeRaw] = useState(route?.grade ?? '');
  const [type, setType] = useState<RouteType>(route?.type ?? 'Boulder');
  const [holdColor, setHoldColor] = useState(route?.holdColor ?? 'Red');
  const [sector, setSector] = useState(route?.sector ?? '');
  const [tags, setTags] = useState<string[]>(route?.tags ?? []);
  const [description, setDescription] = useState(route?.description ?? '');
  const [photoUrls, setPhotoUrls] = useState<string[]>(route?.photoUrls.length ? route.photoUrls : ['']);
  const [isActive, setIsActive] = useState(route ? route.status === 'Active' : true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const effectiveGymId = gymId || selectedGymId;

  const validate = useCallback((): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Обязательное поле';
    if (!gradeRaw) e.gradeRaw = 'Обязательное поле';
    if (!type) e.type = 'Обязательное поле';
    if (!holdColor) e.holdColor = 'Обязательное поле';
    if (!isEdit && !effectiveGymId) e.gymId = 'Выберите зал';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [name, gradeRaw, type, holdColor, isEdit, effectiveGymId]);

  const addPhoto = useCallback(() => setPhotoUrls((u) => [...u, '']), []);
  const removePhoto = useCallback((i: number) => setPhotoUrls((u) => u.filter((_, idx) => idx !== i)), []);
  const updatePhoto = useCallback((i: number, val: string) => {
    setPhotoUrls((u) => u.map((e, idx) => (idx === i ? val : e)));
  }, []);

  const handleSubmit = async () => {
    if (!validate()) return;
    const cleanedPhotos = photoUrls.filter(Boolean);
    if (isEdit && route) {
      const payload: UpdateRoutePayload = {
        name: name.trim(),
        gradeRaw,
        type,
        holdColor,
        sector: sector.trim() || null,
        tags,
        description: description.trim() || null,
        photoUrls: cleanedPhotos,
        isActive,
        setterId: selectedSetterId || undefined,
      };
      await onSave(payload);
    } else if (effectiveGymId) {
      const payload: CreateRoutePayload = {
        gymId: effectiveGymId,
        name: name.trim(),
        gradeRaw,
        type,
        holdColor,
        sector: sector.trim() || undefined,
        tags,
        description: description.trim() || undefined,
        photoUrls: cleanedPhotos,
        isActive,
        setterId: selectedSetterId || undefined,
      };
      await onSave(payload);
    }
  };

  const fieldSx = {
    '& .MuiInputBase-root': { fontSize: '0.85rem' },
    '& .MuiInputLabel-root': { fontSize: '0.82rem' },
  };

  return (
      <Box sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 2.5, height: '100%' }}>
        <Typography sx={{ fontSize: '1.15rem', fontWeight: 800, color: theme.palette.text.primary }}>
          {isEdit ? 'Редактировать трассу' : 'Новая трасса'}
        </Typography>

        {/* Основные поля */}
        {!isEdit && !gymId && gymOptions && gymOptions.length > 0 && (
          <Autocomplete
            size="small"
            options={gymOptions}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, val) => option.id === val.id}
            value={gymOptions.find((g) => g.id === selectedGymId) ?? null}
            onChange={(_, v) => setSelectedGymId(v?.id ?? '')}
            renderInput={(params) => (
              <TextField {...params} label="Скалодром" error={!!errors.gymId} helperText={errors.gymId} sx={fieldSx} required />
            )}
            sx={fieldSx}
          />
        )}
        {!isEdit && !gymId && (!gymOptions || gymOptions.length === 0) && (
          <Typography sx={{ fontSize: '0.82rem', color: 'error.main' }}>
            Нет доступных скалодромов для создания трассы
          </Typography>
        )}

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <TextField
            label="Название"
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            sx={fieldSx}
            required
          />
          <Autocomplete
            size="small"
            freeSolo
            options={GRADE_OPTIONS}
            value={gradeRaw}
            onChange={(_, v) => setGradeRaw(v || '')}
            onInputChange={(_, v) => setGradeRaw(v)}
            renderInput={(params) => (
              <TextField {...params} label="Грейд" error={!!errors.gradeRaw} helperText={errors.gradeRaw} sx={fieldSx} required />
            )}
            sx={fieldSx}
          />
        </Box>

        {/* Тип (чипы) */}
        <Box>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'text.secondary', mb: 0.75 }}>
            Тип {errors.type && <span style={{ color: theme.palette.error.main }}> — {errors.type}</span>}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            {ROUTE_TYPE_VALUES.map((t) => (
              <Chip
                key={t}
                label={ROUTE_TYPE_OPTIONS.find((o) => o.value === t)?.label || t}
                size="small"
                onClick={() => setType(t)}
                sx={{
                  background: type === t ? theme.palette.primary.main : theme.custom.surface2,
                  color: type === t ? theme.palette.primary.contrastText : theme.palette.text.secondary,
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.85 },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Цвет зацепок (круги) */}
        <Box>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'text.secondary', mb: 0.75 }}>
            Цвет зацепок {errors.holdColor && <span style={{ color: theme.palette.error.main }}> — {errors.holdColor}</span>}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            {HOLD_COLOR_NAMES.filter((c) => c !== 'all').map((color) => (
              <Box
                key={color}
                onClick={() => setHoldColor(color)}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: HOLD_COLORS[color] || color,
                  border: holdColor === color ? `3px solid ${theme.palette.primary.main}` : `2px solid ${theme.palette.divider}`,
                  cursor: 'pointer',
                  transition: 'transform 0.15s',
                  '&:hover': { transform: 'scale(1.15)' },
                  boxShadow: holdColor === color ? `0 0 0 2px ${theme.palette.primary.main}` : 'none',
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Сектор + статус */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <TextField label="Сектор" size="small" value={sector} onChange={(e) => setSector(e.target.value)} sx={fieldSx} />
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
                  onClick={() => setIsActive(opt.value)}
                  sx={{
                    background: isActive === opt.value ? theme.palette.primary.main : theme.custom.surface2,
                    color: isActive === opt.value ? theme.palette.primary.contrastText : theme.palette.text.secondary,
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Рутсеттер (только для админа зала) */}
        {setterOptions && setterOptions.length > 0 && (
          <Autocomplete
            size="small"
            options={setterOptions}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, val) => option.id === val.id}
            value={setterOptions.find((s) => s.id === selectedSetterId) ?? null}
            onChange={(_, v) => setSelectedSetterId(v?.id ?? '')}
            renderInput={(params) => <TextField {...params} label="Рутсеттер" sx={fieldSx} />}
            sx={fieldSx}
          />
        )}

        {/* Теги */}
        <Autocomplete
          multiple
          freeSolo
          size="small"
          options={allTagOptions}
          value={tags}
          onChange={(_, v) => setTags(v)}
          renderInput={(params) => <TextField {...params} label="Теги" sx={fieldSx} placeholder="Добавить тег…" />}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                sx={{ fontSize: '0.75rem', fontWeight: 600 }}
              />
            ))
          }
          sx={fieldSx}
        />

        {/* Описание */}
        <TextField
          label="Описание"
          size="small"
          multiline
          minRows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={fieldSx}
        />

        {/* Медиа */}
        <Box>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'text.secondary', mb: 0.75 }}>
            Фото (URL)
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {photoUrls.map((url, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="https://…"
                  value={url}
                  onChange={(e) => updatePhoto(i, e.target.value)}
                  sx={{ flex: 1, ...fieldSx }}
                />
                {url && (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      background: theme.custom.surface2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      color: theme.custom.text3,
                      flexShrink: 0,
                      overflow: 'hidden',
                    }}
                  >
                    📷
                  </Box>
                )}
                <IconButton size="small" onClick={() => removePhoto(i)} color="error" disabled={photoUrls.length <= 1}>
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            ))}
            <Button size="small" startIcon={<Add />} onClick={addPhoto} sx={{ alignSelf: 'flex-start', fontSize: '0.82rem' }}>
              Добавить фото
            </Button>
          </Box>
        </Box>

        {/* Кнопки */}
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 'auto' }}>
          <Button variant="contained" color="primary" startIcon={<Save />} onClick={handleSubmit} disabled={saving}>
            {saving ? 'Сохранение…' : 'Сохранить'}
          </Button>
          <Button variant="outlined" startIcon={<Close />} onClick={onClose} disabled={saving}>
            Отмена
          </Button>
        </Box>
      </Box>
  );
}
