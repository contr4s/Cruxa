import { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, useTheme } from '@mui/material';
import { Close, AddLink, InfoOutlined, BrokenImage } from '@mui/icons-material';
import { flexCenter } from '../../../theme/commonStyles';

interface MediaUploaderProps {
  files: File[];
  existingUrls: string[];
  onFilesChange: (files: File[]) => void;
  urls?: string[];
  onUrlsChange?: (urls: string[]) => void;
}

export function MediaUploader({ existingUrls, urls: externalUrls, onUrlsChange }: MediaUploaderProps) {
  const theme = useTheme();
  const [localUrls, setLocalUrls] = useState<string[]>(existingUrls);
  const [inputUrl, setInputUrl] = useState('');
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const urls = externalUrls ?? localUrls;
  const updateUrls = onUrlsChange ?? setLocalUrls;

  const addUrl = () => {
    const trimmed = inputUrl.trim();
    if (!trimmed || urls.includes(trimmed)) return;
    const next = [...urls, trimmed];
    updateUrls(next);
    setInputUrl('');
  };

  const removeUrl = (url: string) => {
    updateUrls(urls.filter((u) => u !== url));
    setImgErrors((prev) => { const n = { ...prev }; delete n[url]; return n; });
  };

  return (
    <Box>
      {/* Preview */}
      {urls.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          {urls.map((url) => {
            const hasError = imgErrors[url];
            return (
              <Box
                key={url}
                sx={{ position: 'relative', width: 96, height: 96, borderRadius: 1, overflow: 'hidden', border: `1px solid ${theme.palette.divider}` }}
              >
                {hasError ? (
                  <Box sx={{ width: '100%', height: '100%', ...flexCenter(), flexDirection: 'column', gap: 0.25, bgcolor: theme.custom.surface2, color: theme.custom.text3 }}>
                    <BrokenImage sx={{ fontSize: 22, opacity: 0.5 }} />
                    <Typography variant="caption" sx={{ fontSize: '0.62rem', lineHeight: 1.1, textAlign: 'center', px: 0.5 }}>
                      Ошибка
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    component="img"
                    src={url}
                    onError={() => setImgErrors((prev) => ({ ...prev, [url]: true }))}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                )}
                <IconButton
                  size="small"
                  onClick={() => removeUrl(url)}
                  sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', p: 0.25, '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
                >
                  <Close sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            );
          })}
        </Box>
      )}

      {/* URL input */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          size="small"
          placeholder="https://example.com/photo.jpg"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') addUrl(); }}
          sx={{ flex: 1 }}
        />
        <Button variant="outlined" size="small" onClick={addUrl} startIcon={<AddLink />}>
          Добавить
        </Button>
      </Box>

      {/* Banner below */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 1.5,
          mt: 1.5,
          borderRadius: 1,
          bgcolor: 'action.hover',
          color: 'text.secondary',
          fontSize: '0.78rem',
          lineHeight: 1.4,
        }}
      >
        <InfoOutlined sx={{ fontSize: 16, flexShrink: 0 }} />
        Загрузка фото и видео недоступна в демо. Вы можете указать ссылку на публичный ресурс (YouTube, VK, Instagram и др.).
      </Box>
    </Box>
  );
}
