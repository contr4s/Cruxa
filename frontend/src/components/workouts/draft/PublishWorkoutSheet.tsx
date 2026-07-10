import { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, CircularProgress, Checkbox, IconButton,
} from '@mui/material';
import { ArrowUpward, ArrowDownward, Delete } from '@mui/icons-material';
import dayjs from 'dayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { ModalOverlay } from '../../ui/ModalOverlay';
import { PostAscentList } from '../../posts/PostAscentList';
import { MediaUploader } from './MediaUploader';
import { useDraftStore } from '../../../stores/draftWorkoutStore';
import { useUpdatePost } from '../../../services/hooks/useDraftPost';
import type { PostVisibility } from '../../../types/post';

interface PublishWorkoutSheetProps {
  open: boolean;
  onClose: () => void;
}

export function PublishWorkoutSheet({ open, onClose }: PublishWorkoutSheetProps) {
  const { postId, createdAt, ascents, clearDraft } = useDraftStore();
  const { mutateAsync: publishPost, isPending } = useUpdatePost(postId);

  const defaultDuration = useMemo(() => {
    if (!createdAt) return dayjs().startOf('day').add(1, 'hour');
    const diffMin = Math.round((Date.now() - new Date(createdAt).getTime()) / 60000);
    return dayjs().startOf('day').add(diffMin, 'minute');
  }, [createdAt]);

  const [body, setBody] = useState('');
  const [duration, setDuration] = useState<dayjs.Dayjs>(defaultDuration);
  const [visibility, setVisibility] = useState<PostVisibility>('Public');
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());
  const [mediaOrder, setMediaOrder] = useState<string[]>([]);
  const [extraUrls, setExtraUrls] = useState<string[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  // On mount, init with ascent media
  useEffect(() => {
    if (open && !hasInitialized) {
      const urls = ascents.flatMap((a) => a.mediaUrls ?? []);
      setMediaOrder(urls);
      setSelectedMedia(new Set(urls));
      setHasInitialized(true);
    }
    if (!open) setHasInitialized(false);
  }, [open, ascents, hasInitialized]);

  const moveUp = (idx: number) => {
    if (idx <= 0) return;
    setMediaOrder((prev) => {
      const next = [...prev];
      [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
      return next;
    });
  };

  const moveDown = (idx: number) => {
    if (idx >= mediaOrder.length - 1) return;
    setMediaOrder((prev) => {
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  };

  const toggleMedia = (url: string) => {
    setSelectedMedia((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url); else next.add(url);
      return next;
    });
  };

  const removeUrl = (url: string) => {
    setMediaOrder((prev) => prev.filter((u) => u !== url));
    setSelectedMedia((prev) => { const n = new Set(prev); n.delete(url); return n; });
  };

  // Remove declaration of unused addUrls


  const handlePublish = async () => {
    if (!postId) return;
    const durationMinutes = duration.hour() * 60 + duration.minute();
    const orderedSelected = mediaOrder.filter((url) => selectedMedia.has(url));
    await publishPost({
      body: body || undefined,
      duration: durationMinutes,
      visibility,
      mediaUrls: orderedSelected,
      status: 'published',
    });
    clearDraft();
    onClose();
  };

  return (
    <ModalOverlay open={open} onClose={onClose} maxWidth={520}>
      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6">Завершить тренировку</Typography>

        {/* Ascent list */}
        {ascents.length > 0 && (
          <PostAscentList ascents={ascents} />
        )}

        {/* Media gallery — ordered, selectable, reorderable */}
        {mediaOrder.length > 0 && (
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              Фото для галереи поста ({selectedMedia.size} из {mediaOrder.length} выбрано)
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {mediaOrder.map((url, idx) => {
                const checked = selectedMedia.has(url);
                const ascentUrls = ascents.flatMap((a) => a.mediaUrls ?? []);
                const isAscent = ascentUrls.includes(url);
                return (
                  <Box
                    key={url}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 0.5, borderRadius: 1, bgcolor: 'action.hover' }}
                  >
                    <Checkbox
                      checked={checked}
                      onChange={() => toggleMedia(url)}
                      size="small"
                    />
                    <Box
                      component="img"
                      src={url}
                      sx={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 0.5, flexShrink: 0, opacity: checked ? 1 : 0.35 }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                    <Typography variant="caption" sx={{ flex: 1, wordBreak: 'break-all', fontSize: '0.7rem', opacity: checked ? 1 : 0.35 }}>
                      {isAscent ? '📷 из пролаза' : '🔗 по ссылке'}
                    </Typography>
                    <IconButton size="small" onClick={() => moveUp(idx)} disabled={idx === 0}><ArrowUpward sx={{ fontSize: 16 }} /></IconButton>
                    <IconButton size="small" onClick={() => moveDown(idx)} disabled={idx === mediaOrder.length - 1}><ArrowDownward sx={{ fontSize: 16 }} /></IconButton>
                    {!isAscent && (
                      <IconButton size="small" onClick={() => removeUrl(url)}><Delete sx={{ fontSize: 16 }} /></IconButton>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}

        {/* Extra photos */}
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Добавить фото по ссылке
          </Typography>
          <MediaUploader files={[]} existingUrls={[]} onFilesChange={() => {}} urls={extraUrls} onUrlsChange={(urls) => {
            setExtraUrls(urls);
            urls.forEach((url) => {
              setMediaOrder((prev) => prev.includes(url) ? prev : [...prev, url]);
              setSelectedMedia((prev) => new Set(prev).add(url));
            });
          }} />
        </Box>

        {/* Body */}
        <TextField
          label="Описание тренировки"
          multiline
          minRows={2}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        {/* Duration */}
        <TimePicker
          label="Длительность"
          value={duration}
          onChange={(v) => v && setDuration(v)}
          ampm={false}
          views={['hours', 'minutes']}
        />

        {/* Visibility */}
        <FormControl>
          <FormLabel>Видимость</FormLabel>
          <RadioGroup row value={visibility} onChange={(e) => setVisibility(e.target.value as PostVisibility)}>
            <FormControlLabel value="Public" control={<Radio />} label="Публично" />
            <FormControlLabel value="Followers" control={<Radio />} label="Подписчики" />
            <FormControlLabel value="Private" control={<Radio />} label="Только я" />
          </RadioGroup>
        </FormControl>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>Отмена</Button>
          <Button variant="contained" disabled={isPending} onClick={handlePublish}>
            {isPending ? <CircularProgress size={20} /> : 'Опубликовать'}
          </Button>
        </Box>
      </Box>
    </ModalOverlay>
  );
}
