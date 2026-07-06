import { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Autocomplete, Chip, CircularProgress, Rating,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ModalOverlay } from '../../ui/ModalOverlay';
import { MediaUploader } from './MediaUploader';
import { useDraftStore } from '../../../stores/draftWorkoutStore';
import { useAddAscent } from '../../../services/hooks/useDraftPost';
import { useRoutesByGym } from '../../../services/hooks/useRoutes';
import { uploadMedia } from '../../../services/mediaUpload.service';
import { ASCENT_COLORS } from '../../../constants/ascent';
import type { RouteDto } from '../../../types/route';
import type { AscentStyle } from '../../../types/post';

const STYLE_OPTIONS: AscentStyle[] = ['Flash', 'Onsight', 'Redpoint', 'Attempt', 'Project', 'Repeat'];

const ascentFormSchema = z.object({
  routeId: z.string().min(1, 'Выберите трассу'),
  style: z.enum(['Flash', 'Onsight', 'Redpoint', 'Attempt', 'Project', 'Repeat']),
  notes: z.string().optional().or(z.literal('')),
  rating: z.number().min(1).max(5).nullable().optional(),
  review: z.string().optional().or(z.literal('')),
});

type AscentFormValues = z.infer<typeof ascentFormSchema>;

interface AscentFormModalProps {
  open: boolean;
  onClose: () => void;
  prefilledRouteId?: string;
}

export function AscentFormModal({ open, onClose, prefilledRouteId }: AscentFormModalProps) {
  const { postId, gymId, addAscent: addToStore } = useDraftStore();
  const { mutateAsync: addAscentApi, isPending } = useAddAscent(postId);

  const [searchInput, setSearchInput] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<RouteDto | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const { data: routesData, isLoading: routesLoading } = useRoutesByGym(gymId ?? '', {
    searchQuery: searchInput || undefined,
    pageSize: 20,
  });
  const routes = routesData?.items ?? [];

  const { control, handleSubmit, reset, setValue } = useForm<AscentFormValues>({
    resolver: zodResolver(ascentFormSchema),
    defaultValues: {
      routeId: '',
      style: 'Flash',
      notes: '',
      rating: null,
      review: '',
    },
  });

  // Reset on open
  useEffect(() => {
    if (open) {
      reset();
      setSearchInput('');
      setSelectedRoute(null);
      setFiles([]);
    }
  }, [open, reset]);

  // Prefill route
  useEffect(() => {
    if (open && prefilledRouteId && routes.length > 0) {
      const found = routes.find((r) => r.id === prefilledRouteId);
      if (found) {
        setSelectedRoute(found);
        setValue('routeId', found.id);
      }
    }
  }, [open, prefilledRouteId, routes, setValue]);

  const onSubmit = async (values: AscentFormValues) => {
    if (!postId) return;

    // ponytail: upload files in parallel, replace with queued upload when backend ready
    const mediaUrls = files.length > 0
      ? await Promise.all(files.map((f) => uploadMedia(f).then((r) => r.url)))
      : [];

    const result = await addAscentApi({
      routeId: values.routeId,
      style: values.style,
      notes: values.notes || undefined,
      mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
    });

    const route = selectedRoute;
    addToStore({
      id: result.id,
      routeId: result.routeId,
      routeName: result.routeName,
      grade: result.grade,
      gradeIndex: route?.gradeIndex ?? 0,
      holdColor: result.holdColor,
      type: route?.type ?? 'Boulder',
      style: result.style,
      notes: result.notes,
      mediaUrls: result.mediaUrls ?? [],
    });

    onClose();
  };

  return (
    <ModalOverlay open={open} onClose={onClose} maxWidth={520}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6">Добавить пролаз</Typography>

        {/* Route search */}
        <Controller
          name="routeId"
          control={control}
          render={({ field, formState: { errors } }) => (
            <Autocomplete
              options={routes}
              value={selectedRoute}
              inputValue={searchInput}
              onInputChange={(_, v) => setSearchInput(v)}
              onChange={(_, v) => {
                setSelectedRoute(v);
                field.onChange(v?.id ?? '');
              }}
              getOptionLabel={(o) => `${o.name} (${o.grade})`}
              loading={routesLoading}
              renderInput={(params) => (
                <TextField {...params} label="Трасса" placeholder="Поиск по названию…" error={!!errors.routeId} helperText={errors.routeId?.message} />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: option.holdColor, flexShrink: 0 }} />
                    <Typography variant="body2">{option.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{option.grade}</Typography>
                  </Box>
                </li>
              )}
            />
          )}
        />

        {/* Style chips */}
        <Controller
          name="style"
          control={control}
          render={({ field }) => (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                Стиль
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {STYLE_OPTIONS.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    size="small"
                    onClick={() => field.onChange(s)}
                    variant={field.value === s ? 'filled' : 'outlined'}
                    sx={{
                      bgcolor: field.value === s ? ASCENT_COLORS[s] : undefined,
                      color: field.value === s ? '#fff' : undefined,
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        />

        {/* Private notes */}
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Заметки (только для вас)" multiline minRows={2} />
          )}
        />

        {/* Review */}
        {selectedRoute && (
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              Отзыв о трассе
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <Rating
                    value={field.value}
                    onChange={(_, v) => field.onChange(v)}
                    size="small"
                  />
                )}
              />
              {/** rating label is handled by UI, not critical */}
            </Box>
            <Controller
              name="review"
              control={control}
              render={({ field }) => (
                <TextField {...field} placeholder="Ваш комментарий (публичный)" multiline minRows={2} fullWidth />
              )}
            />
          </Box>
        )}

        {/* Media */}
        <MediaUploader files={files} existingUrls={[]} onFilesChange={setFiles} />

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? <CircularProgress size={20} /> : 'Добавить'}
          </Button>
        </Box>
      </Box>
    </ModalOverlay>
  );
}
