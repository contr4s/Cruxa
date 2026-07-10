import { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, CircularProgress, Chip, IconButton, Autocomplete, Checkbox,
} from '@mui/material';
import { Delete, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { ModalOverlay } from '../ui/ModalOverlay';
import { MediaUploader } from '../workouts/draft/MediaUploader';
import { useUpdatePost } from '../../services/hooks/useDraftPost';
import { addAscent, removeAscentEndpoint } from '../../services/posts.service';
import { useInfiniteRoutesByGym } from '../../services/hooks/useRoutes';
import { ASCENT_COLORS } from '../../constants/ascent';
import { useQueryClient } from '@tanstack/react-query';
import type { PostDto, PostVisibility, AscentStyle } from '../../types/post';

const STYLE_OPTIONS: AscentStyle[] = ['Flash', 'Onsight', 'Redpoint', 'TopRope', 'Attempt', 'Repeat'];

interface EditPostModalProps {
  open: boolean;
  post: PostDto;
  onClose: () => void;
}

export function EditPostModal({ open, post, onClose }: EditPostModalProps) {
  const { mutateAsync: updatePost, isPending } = useUpdatePost(post.id);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  const [body, setBody] = useState(post.body ?? '');
  const [visibility, setVisibility] = useState<PostVisibility>(post.visibility);
  const [duration, setDuration] = useState<dayjs.Dayjs>(
    post.stats.duration ? dayjs().startOf('day').add(post.stats.duration, 'minute') : dayjs().startOf('day').add(1, 'hour'),
  );
  const [mediaOrder, setMediaOrder] = useState<string[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());
  const [extraUrls, setExtraUrls] = useState<string[]>([]);
  const [ascents, setAscents] = useState(post.ascents);
  const [hasInit, setHasInit] = useState(false);

  const [addAscentMode, setAddAscentMode] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<{ id: string; name: string; grade: string; holdColor: string } | null>(null);
  const [newStyle, setNewStyle] = useState<AscentStyle>('Flash');
  const [adding, setAdding] = useState(false);

  const gymId = post.gymId ?? '';
  const { data: routesPages } = useInfiniteRoutesByGym(gymId, { pageSize: 50 });
  const routes = routesPages?.pages.flatMap((p) => p.items) ?? [];

  useEffect(() => {
    if (open && !hasInit) {
      setMediaOrder(post.mediaUrls);
      setSelectedMedia(new Set(post.mediaUrls));
      setAscents(post.ascents);
      setBody(post.body ?? '');
      setVisibility(post.visibility);
      setDuration(post.stats.duration ? dayjs().startOf('day').add(post.stats.duration, 'minute') : dayjs().startOf('day').add(1, 'hour'));
      setHasInit(true);
    }
    if (!open) { setHasInit(false); setAddAscentMode(false); }
  }, [open, post, hasInit]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const durationMinutes = duration.hour() * 60 + duration.minute();
      const orderedSelected = mediaOrder.filter((url) => selectedMedia.has(url));
      await updatePost({ description: body || undefined, visibility, duration: durationMinutes, mediaUrls: orderedSelected.length > 0 ? orderedSelected : undefined, status: 'published' });
      const removedIds = post.ascents.filter((a) => !ascents.find((na) => na.id === a.id)).map((a) => a.id);
      if (removedIds.length > 0) await Promise.all(removedIds.map((id) => removeAscentEndpoint(post.id, id)));
      enqueueSnackbar('Тренировка сохранена', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['user', post.userId, 'posts'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['post', post.id] });
      onClose();
    } catch { enqueueSnackbar('Ошибка сохранения', { variant: 'error' }); }
    finally { setSaving(false); }
  };

  const handleAddAscent = async () => {
    if (!selectedRoute) return;
    setAdding(true);
    try {
      const result = await addAscent(post.id, { routeId: selectedRoute.id, style: newStyle });
      setAscents((prev) => [...prev, { id: result.id, routeId: result.routeId, routeName: result.routeName, grade: result.grade, gradeIndex: result.gradeIndex, holdColor: result.holdColor, style: result.style, mediaUrls: result.mediaUrls ?? [] } as any]);
      setSelectedRoute(null); setSearchInput(''); setAddAscentMode(false);
      enqueueSnackbar('Пролаз добавлен', { variant: 'success' });
    } catch { enqueueSnackbar('Ошибка добавления пролаза', { variant: 'error' }); }
    finally { setAdding(false); }
  };

  const isBusy = isPending || saving;

  return (
    <ModalOverlay open={open} onClose={onClose} maxWidth={560}>
      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6">Редактировать тренировку</Typography>

        {ascents.length > 0 && (
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Пролазы</Typography>
            {ascents.map((a) => (
              <Box key={a.id} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, py: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.78rem' }}>{a.routeName}</Typography>
                <Box sx={{ display: 'flex', gap: 0.3, flexShrink: 0, flexWrap: 'wrap' }}>
                  {STYLE_OPTIONS.map((s) => (
                    <Chip key={s} label={s} size="small" onClick={() => setAscents((prev) => prev.map((x) => x.id === a.id ? { ...x, style: s } : x))}
                      variant={a.style === s ? 'filled' : 'outlined'} sx={{ height: 22, fontSize: '0.6rem', bgcolor: a.style === s ? ASCENT_COLORS[s] : undefined, color: a.style === s ? '#fff' : undefined }} />
                  ))}
                </Box>
                <IconButton size="small" onClick={() => setAscents((prev) => prev.filter((x) => x.id !== a.id))}><Delete sx={{ fontSize: 15 }} /></IconButton>
              </Box>
            ))}
          </Box>
        )}

        {!addAscentMode ? (
          <Button size="small" variant="outlined" onClick={() => setAddAscentMode(true)} disabled={!gymId}>+ Добавить пролаз</Button>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 1.5, borderRadius: 1, bgcolor: 'action.hover' }}>
            <Autocomplete options={routes} value={selectedRoute} inputValue={searchInput}
              onInputChange={(_, v) => setSearchInput(v)} onChange={(_, v) => setSelectedRoute(v)}
              getOptionLabel={(o) => `${o.name} (${o.grade})`}
              renderInput={(params) => <TextField {...params} size="small" label="Трасса" placeholder="Поиск…" />}
              renderOption={(props, option) => (<li {...props} key={option.id}><Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}><Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: option.holdColor, flexShrink: 0 }} /><Typography variant="body2">{option.name}</Typography><Typography variant="caption" color="text.secondary">{option.grade}</Typography></Box></li>)} />
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {STYLE_OPTIONS.map((s) => (<Chip key={s} label={s} size="small" onClick={() => setNewStyle(s)} variant={newStyle === s ? 'filled' : 'outlined'} sx={{ bgcolor: newStyle === s ? ASCENT_COLORS[s] : undefined, color: newStyle === s ? '#fff' : undefined, height: 24, fontSize: '0.7rem' }} />))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" variant="contained" disabled={!selectedRoute || adding} onClick={handleAddAscent}>{adding ? <CircularProgress size={16} /> : 'Добавить'}</Button>
              <Button size="small" onClick={() => setAddAscentMode(false)}>Отмена</Button>
            </Box>
          </Box>
        )}

        {mediaOrder.length > 0 && (
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Фото ({selectedMedia.size} из {mediaOrder.length} выбрано)</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {mediaOrder.map((url, idx) => (
                <Box key={url} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 0.5, borderRadius: 1, bgcolor: 'action.hover' }}>
                  <Checkbox checked={selectedMedia.has(url)} onChange={() => setSelectedMedia((prev) => { const n = new Set(prev); n.has(url) ? n.delete(url) : n.add(url); return n; })} size="small" />
                  <Box component="img" src={url} sx={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 0.5, flexShrink: 0, opacity: selectedMedia.has(url) ? 1 : 0.35 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                  <IconButton size="small" onClick={() => { if (idx > 0) setMediaOrder((prev) => { const n = [...prev]; [n[idx], n[idx-1]] = [n[idx-1], n[idx]]; return n; }); }} disabled={idx === 0}><ArrowUpward sx={{ fontSize: 16 }} /></IconButton>
                  <IconButton size="small" onClick={() => { if (idx < mediaOrder.length - 1) setMediaOrder((prev) => { const n = [...prev]; [n[idx], n[idx+1]] = [n[idx+1], n[idx]]; return n; }); }} disabled={idx === mediaOrder.length - 1}><ArrowDownward sx={{ fontSize: 16 }} /></IconButton>
                  <IconButton size="small" onClick={() => { setMediaOrder((prev) => prev.filter((u) => u !== url)); setSelectedMedia((prev) => { const n = new Set(prev); n.delete(url); return n; }); }}><Delete sx={{ fontSize: 16 }} /></IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <MediaUploader files={[]} existingUrls={[]} onFilesChange={() => {}} urls={extraUrls} onUrlsChange={(urls) => { setExtraUrls(urls); urls.forEach((url) => { setMediaOrder((prev) => prev.includes(url) ? prev : [...prev, url]); setSelectedMedia((prev) => new Set(prev).add(url)); }); }} />
        <TextField label="Описание тренировки" multiline minRows={2} value={body} onChange={(e) => setBody(e.target.value)} />
        <TimePicker label="Длительность" value={duration} onChange={(v) => v && setDuration(v)} ampm={false} views={['hours', 'minutes']} />

        <FormControl>
          <FormLabel>Видимость</FormLabel>
          <RadioGroup row value={visibility} onChange={(e) => setVisibility(e.target.value as PostVisibility)}>
            <FormControlLabel value="Public" control={<Radio />} label="Публично" />
            <FormControlLabel value="Followers" control={<Radio />} label="Подписчики" />
            <FormControlLabel value="Private" control={<Radio />} label="Только я" />
          </RadioGroup>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>Отмена</Button>
          <Button variant="contained" disabled={isBusy} onClick={handleSave}>{isBusy ? <CircularProgress size={20} /> : 'Сохранить'}</Button>
        </Box>
      </Box>
    </ModalOverlay>
  );
}
