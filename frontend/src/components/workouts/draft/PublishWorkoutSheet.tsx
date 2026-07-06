import { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, CircularProgress, Checkbox, FormGroup,
} from '@mui/material';
import dayjs from 'dayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { ModalOverlay } from '../../ui/ModalOverlay';
import { PostAscentList } from '../../posts/PostAscentList';
import { MediaUploader } from './MediaUploader';
import { uploadMedia } from '../../../services/mediaUpload.service';
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
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [extraFiles, setExtraFiles] = useState<File[]>([]);

  // On mount, select all ascent media by default
  useEffect(() => {
    if (open) {
      const allUrls = ascents.flatMap((a) => a.mediaUrls ?? []);
      setSelectedMedia(allUrls);
    }
  }, [open]);

  const toggleMedia = (url: string) => {
    setSelectedMedia((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url],
    );
  };

  const handlePublish = async () => {
    if (!postId) return;
    const durationMinutes = duration.hour() * 60 + duration.minute();

    // ponytail: upload extraFiles to server when backend endpoint is ready
    const extraUrls = extraFiles.length > 0
      ? await Promise.all(extraFiles.map((f) => uploadMedia(f).then((r) => r.url)))
      : [];

    await publishPost({
      body: body || undefined,
      duration: durationMinutes,
      visibility,
      mediaUrls: [...selectedMedia, ...extraUrls],
      status: 'published',
    });
    clearDraft();
    onClose();
  };

  return (
    <ModalOverlay open={open} onClose={onClose} maxWidth={480}>
      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6">Завершить тренировку</Typography>

        {/* Ascent list */}
        {ascents.length > 0 && (
          <PostAscentList ascents={ascents} />
        )}

        {/* Media from ascents */}
        {ascents.some((a) => (a.mediaUrls ?? []).length > 0) && (
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              Фото из пролазов в галерею поста
            </Typography>
            <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 1 }}>
              {ascents.flatMap((a) =>
                (a.mediaUrls ?? []).map((url) => (
                  <Box
                    key={url}
                    sx={{ position: 'relative', width: 64, height: 64, cursor: 'pointer' }}
                    onClick={() => toggleMedia(url)}
                  >
                    <Box
                      component="img"
                      src={url}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 1, opacity: selectedMedia.includes(url) ? 1 : 0.35 }}
                    />
                    <Checkbox
                      checked={selectedMedia.includes(url)}
                      size="small"
                      sx={{ position: 'absolute', top: -4, right: -4, p: 0.25 }}
                    />
                  </Box>
                )),
              )}
            </FormGroup>
          </Box>
        )}

        {/* Extra photos */}
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Дополнительные фото
          </Typography>
          <MediaUploader files={extraFiles} existingUrls={[]} onFilesChange={setExtraFiles} />
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
