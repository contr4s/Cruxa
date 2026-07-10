import { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, TextField, Button, Autocomplete, Chip, CircularProgress, Rating, useTheme, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ModalOverlay } from '../../ui/ModalOverlay';
import { MediaUploader } from './MediaUploader';
import { useDraftStore } from '../../../stores/draftWorkoutStore';
import { useAddAscent } from '../../../services/hooks/useDraftPost';
import { useInfiniteRoutesByGym } from '../../../services/hooks/useRoutes';
import { uploadMedia } from '../../../services/mediaUpload.service';
import { ASCENT_COLORS } from '../../../constants/ascent';
import type { RouteDto } from '../../../types/route';
import type { AscentStyle } from '../../../types/post';
import { useGradingSystems } from '../../../services/hooks/useGradingSystems';
import { useSaveRouteFeedback } from '../../../services/hooks/useRoutes';

const BOULDER_STYLES: AscentStyle[] = ['Flash', 'Redpoint', 'Attempt', 'Repeat'];
const LEAD_STYLES: AscentStyle[] = ['Onsight', 'Flash', 'Redpoint', 'TopRope', 'Attempt', 'Repeat'];

const STYLE_HINTS: Record<string, string> = {
  Flash: 'Пройдено с первой попытки',
  Onsight: 'Пройдено с первой попытки без предварительной информации о трассе',
  Redpoint: 'Пройдено после нескольких попыток',
  TopRope: 'Пройдено с верхней страховкой',
  Attempt: 'Попытка, не долез до топа',
  Repeat: 'Повторно пройденная трасса',
};

const ascentFormSchema = z.object({
  routeId: z.string().min(1, 'Выберите трассу'),
  style: z.string(),
  notes: z.string().optional().or(z.literal('')),
  rating: z.number().min(1).max(5).nullable().optional(),
  review: z.string().optional().or(z.literal('')),
  gradeIndex: z.number().nullable().optional(),
});

type AscentFormValues = z.infer<typeof ascentFormSchema>;

interface AscentFormModalProps {
  open: boolean;
  onClose: () => void;
  prefilledRouteId?: string;
}

export function AscentFormModal({ open, onClose, prefilledRouteId }: AscentFormModalProps) {
  const theme = useTheme();
  const { postId, gymId, addAscent: addToStore } = useDraftStore();
  const { mutateAsync: addAscentApi, isPending } = useAddAscent(postId);
  const { mutateAsync: saveFeedback } = useSaveRouteFeedback();
  const { data: gradingSystems } = useGradingSystems();

  const [searchInput, setSearchInput] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<RouteDto | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);

  const {
    data: routesPages,
    isLoading: routesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteRoutesByGym(gymId ?? '', {
    searchQuery: searchInput || undefined,
    pageSize: 20,
  });
  const routes = useMemo(() => routesPages?.pages.flatMap((p) => p.items) ?? [], [routesPages]);

  const { control, handleSubmit, reset, setValue } = useForm<AscentFormValues>({
    resolver: zodResolver(ascentFormSchema),
    defaultValues: {
      routeId: '',
      style: 'Flash',
      notes: '',
      rating: null,
      review: '',
      gradeIndex: null,
    },
  });

  // Reset on open
  useEffect(() => {
    if (open) {
      reset();
      setSearchInput('');
      setSelectedRoute(null);
      setFiles([]);
      setMediaUrls([]);
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
    const mediaUrlsFromFiles = files.length > 0
      ? await Promise.all(files.map((f) => uploadMedia(f).then((r) => r.url)))
      : [];

    const allMediaUrls = [...mediaUrls, ...mediaUrlsFromFiles];

    const result = await addAscentApi({
      routeId: values.routeId,
      style: values.style as AscentStyle,
      notes: values.notes || undefined,
      mediaUrls: allMediaUrls.length > 0 ? allMediaUrls : undefined,
    });

    const route = selectedRoute;
    addToStore({
      id: result.id,
      routeId: result.routeId,
      routeName: result.routeName,
      grade: result.grade,
      gradeIndex: route?.gradeIndex ?? 0,
      holdColor: result.holdColor,
      type: route?.type ?? 'Bouldering',
      style: result.style,
      notes: result.notes,
      mediaUrls: result.mediaUrls ?? [],
    });

    // Save route feedback (rating, grade opinion, review) if any filled
    const hasFeedback = values.rating || values.gradeIndex != null || values.review || values.notes;
    if (hasFeedback && route) {
      await saveFeedback({
        routeId: route.id,
        body: {
          rating: values.rating ?? undefined,
          gradeIndex: values.gradeIndex ?? undefined,
          publicReview: values.review || undefined,
          privateNotes: values.notes || undefined,
        },
      });
    }

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
              slotProps={{
                listbox: {
                  onScroll: (e: React.UIEvent<HTMLUListElement>) => {
                    const list = e.currentTarget;
                    if (list.scrollHeight - list.scrollTop - list.clientHeight < 80 && hasNextPage && !isFetchingNextPage) {
                      fetchNextPage();
                    }
                  },
                },
              }}
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

        {/* Everything after route selection — hidden until a route is chosen */}
        {selectedRoute && (<>
          {/* Style chips */}
          <Controller
            name="style"
            control={control}
            render={({ field }) => {
              const typeOptions = selectedRoute.type === 'Bouldering' ? BOULDER_STYLES : LEAD_STYLES;
              if (!typeOptions.includes(field.value as AscentStyle)) {
                setTimeout(() => field.onChange(typeOptions[0]));
              }
              return (
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                  Стиль
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {typeOptions.map((s) => (
                    <Chip
                      key={s}
                      label={s}
                      size="small"
                      title={STYLE_HINTS[s]}
                      onClick={() => field.onChange(s)}
                      variant={field.value === s ? 'filled' : 'outlined'}
                      sx={{
                        bgcolor: field.value === s ? ASCENT_COLORS[s] : undefined,
                        color: field.value === s ? '#fff' : undefined,
                      }}
                    />
                  ))}
                </Box>
                <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block', fontSize: '0.7rem' }}>
                  {STYLE_HINTS[field.value] ?? ''}
                </Typography>
              </Box>
            );}}
          />

          {/* Private notes */}
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Заметки (только для вас)" multiline minRows={2} />
            )}
          />

          {/* Grade opinion — collapsed under "Добавить отзыв о трассе" */}
          {(() => {
            const defaultSystem = gradingSystems?.[0];
            const gradeOptions = defaultSystem
              ? Object.entries(defaultSystem.gradeMapping).sort((a, b) => a[1] - b[1])
              : [];

            return (
              <details style={{ cursor: 'pointer', border: `1px solid ${theme.palette.divider}`, borderRadius: '8px', padding: '8px 12px' }}>
                <summary style={{ fontSize: '0.82rem', fontWeight: 600, color: theme.palette.text.secondary, cursor: 'pointer' }}>
                  Добавить отзыв о трассе
                </summary>
                <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {/* Rating */}
                  <Controller
                    name="rating"
                    control={control}
                    render={({ field }) => (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption">Оценка:</Typography>
                        <Rating value={field.value} onChange={(_, v) => field.onChange(v)} size="small" />
                      </Box>
                    )}
                  />
                  {/* Grade opinion */}
                  <Controller
                    name="gradeIndex"
                    control={control}
                    render={({ field }) => (
                      <FormControl size="small" fullWidth>
                        <InputLabel>Моё мнение о сложности</InputLabel>
                        <Select
                          value={field.value?.toString() ?? ''}
                          label="Моё мнение о сложности"
                          displayEmpty
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                        >
                          <MenuItem value="">—</MenuItem>
                          {gradeOptions.map(([grade, idx]) => (
                            <MenuItem key={grade} value={String(idx)}>{grade}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                  {/* Public review */}
                  <Controller
                    name="review"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} placeholder="Публичный отзыв" multiline minRows={2} fullWidth />
                    )}
                  />
                </Box>
              </details>
            );
          })()}

          {/* Media */}
          <MediaUploader files={files} existingUrls={[]} onFilesChange={setFiles} urls={mediaUrls} onUrlsChange={setMediaUrls} />
        </>)}

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
