import { useRef } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Close, AddPhotoAlternate } from '@mui/icons-material';

interface MediaUploaderProps {
  files: File[];
  existingUrls: string[];
  onFilesChange: (files: File[]) => void;
}

export function MediaUploader({ files, existingUrls, onFilesChange }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    onFilesChange([...files, ...selected]);
    e.target.value = '';
  };

  const removeFile = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    onFilesChange(next);
  };

  return (
    <Box>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
        {existingUrls.map((url, i) => (
          <Box
            key={`url-${i}`}
            component="img"
            src={url}
            sx={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 1 }}
          />
        ))}
        {files.map((f, i) => (
          <Box key={`file-${i}`} sx={{ position: 'relative', width: 72, height: 72 }}>
            <Box
              component="img"
              src={URL.createObjectURL(f)}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 1 }}
            />
            <IconButton
              size="small"
              onClick={() => removeFile(i)}
              sx={{ position: 'absolute', top: -6, right: -6, bgcolor: 'background.paper', p: 0.25 }}
            >
              <Close sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        ))}
      </Box>
      <Box
        onClick={handleSelect}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          cursor: 'pointer',
          color: 'text.secondary',
          '&:hover': { color: 'primary.main' },
        }}
      >
        <AddPhotoAlternate sx={{ fontSize: 20 }} />
        <Typography variant="caption">Добавить фото</Typography>
      </Box>
    </Box>
  );
}
