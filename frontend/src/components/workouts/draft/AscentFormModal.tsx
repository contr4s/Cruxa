import { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Autocomplete, Chip, CircularProgress, Rating,
} from '@mui/material';
import { ModalOverlay } from '../../ui/ModalOverlay';
import { MediaUploader } from './MediaUploader';
import { useDraftStore } from '../../../stores/draftWorkoutStore';
import { useAddAscent } from '../../../services/hooks/useDraftPost';
import { useRoutesByGym } from '../../../services/hooks/useRoutes';
import { ASCENT_COLORS } from '../../../constants/ascent';
import type { RouteDto } from '../../../types/route';
import type { AscentStyle } from '../../../types/post';

const STYLE_OPTIONS: AscentStyle[] = ['Flash', 'Onsight', 'Redpoint', 'Attempt', 'Project', 'Repeat'];

interface AscentFormModalProps {
  open: boolean;
  onClose: () => void;
  prefilledRouteId?: string;
}

export function AscentFormModal({ open, onClose, prefilledRouteId }: AscentFormModalProps) {
  const { postId, gymId, addAscent: addToStore } = useDraftStore();
  const { mutateAsync: addAscentApi, isPending } = useAddAscent(postId);

  const [selectedRoute, setSelectedRoute] = useState<RouteDto | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [style, setStyle] = useState<AscentStyle>('Flash');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState('');

  const { data: routesData, isLoading: routesLoading } = useRoutesByGym(gymId ?? '', {
    searchQuery: searchInput || undefined,
    pageSize: 20,
  });
  const routes = routesData?.items ?? [];

  // Reset on open
  useEffect(() => {
    if (open) {
      setSelectedRoute(null);
      setSearchInput('');
      setStyle('Flash');
      setNotes('');
      setFiles([]);
      setRating(null);
      setReview('');
    }
  }, [open]);

  // Prefill route
  useEffect(() => {
    if (open && prefilledRouteId && routes.length > 0) {
      const found = routes.find((r) => r.id === prefilledRouteId);
      if (found) setSelectedRoute(found);
    }
  }, [open, prefilledRouteId, routes]);

  const handleAdd = async () => {
    if (!selectedRoute || !postId) return;

    // "Upload" files — in mock mode just generate placeholder URLs
    // ponytail: replace with real multipart upload when backend endpoint is ready
    const mediaUrls = files.map((_, i) => `/mock/uploads/${Date.now()}-${i}.jpg`);

    const result = await addAscentApi({
      routeId: selectedRoute.id,
      style,
      notes: notes || undefined,
      mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
    });

    addToStore({
      id: result.id,
      routeId: result.routeId,
      routeName: result.routeName,
      grade: result.grade,
      gradeIndex: selectedRoute.gradeIndex,
      holdColor: result.holdColor,
      type: selectedRoute.type,
      style: result.style,
      notes: result.notes,
      mediaUrls: result.mediaUrls ?? [],
    });

    onClose();
  };

  return (
    <ModalOverlay open={open} onClose={onClose} maxWidth={520}>
      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6">Добавить пролаз</Typography>

        {/* Route search */}
        <Autocomplete
          options={routes}
          value={selectedRoute}
          inputValue={searchInput}
          onInputChange={(_, v) => setSearchInput(v)}
          onChange={(_, v) => setSelectedRoute(v)}
          getOptionLabel={(o) => `${o.name} (${o.grade})`}
          loading={routesLoading}
          renderInput={(params) => (
            <TextField {...params} label="Трасса" placeholder="Поиск по названию…" />
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

        {/* Style chips */}
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
                onClick={() => setStyle(s)}
                variant={style === s ? 'filled' : 'outlined'}
                sx={{
                  bgcolor: style === s ? ASCENT_COLORS[s] : undefined,
                  color: style === s ? '#fff' : undefined,
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Private notes */}
        <TextField
          label="Заметки (только для вас)"
          multiline
          minRows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Review */}
        {selectedRoute && (
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              Отзыв о трассе
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Rating
                value={rating}
                onChange={(_, v) => setRating(v)}
                size="small"
              />
              {rating && (
                <Typography variant="caption" color="text.secondary">
                  {rating === 1 ? 'Ужасно' : rating === 2 ? 'Плохо' : rating === 3 ? 'Нормально' : rating === 4 ? 'Хорошо' : 'Отлично'}
                </Typography>
              )}
            </Box>
            <TextField
              placeholder="Ваш комментарий (публичный)"
              multiline
              minRows={2}
              fullWidth
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </Box>
        )}

        {/* Media */}
        <MediaUploader files={files} existingUrls={[]} onFilesChange={setFiles} />

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>Отмена</Button>
          <Button
            variant="contained"
            disabled={!selectedRoute || isPending}
            onClick={handleAdd}
          >
            {isPending ? <CircularProgress size={20} /> : 'Добавить'}
          </Button>
        </Box>
      </Box>
    </ModalOverlay>
  );
}
