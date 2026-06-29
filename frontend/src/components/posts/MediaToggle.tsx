import { useEffect } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { CameraAlt, BarChart, ListAlt } from '@mui/icons-material';

interface MediaToggleProps {
  value: number;
  onChange: (value: number) => void;
  showAscents?: boolean;
  hasMedia?: boolean;
}

export function MediaToggle({ value, onChange, showAscents = true, hasMedia = true }: MediaToggleProps) {
  const showPhoto = hasMedia;
  const effectiveValue = !showPhoto && value === 0 ? 1 : value;
  const tabsCount = (showPhoto ? 1 : 0) + 1 + (showAscents ? 1 : 0);

  // Если активный таб стал недоступен — переключаем
  useEffect(() => {
    if (effectiveValue !== value) onChange(effectiveValue);
  }, [effectiveValue, value, onChange]);

  if (tabsCount <= 1) return null;

  return (
    <ToggleButtonGroup
      value={effectiveValue}
      exclusive
      onChange={(_, v) => v !== null && onChange(v)}
      size="small"
      sx={{
        '& .MuiToggleButton-root': {
          border: `1px solid`,
          borderColor: 'divider',
          color: 'text.secondary',
          textTransform: 'none',
          fontSize: '0.78rem',
          fontWeight: 600,
          px: { xs: 0.75, sm: 1.25 },
          mx: 'auto',
          py: 0.25,
          '&.Mui-selected': {
            bgcolor: 'primary.main',
            color: '#fff',
            borderColor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' },
          },
        },
      }}
    >
      {showPhoto && (
        <ToggleButton value={0}>
          <CameraAlt sx={{ fontSize: 14, mr: 0.5 }} />
          Фото
        </ToggleButton>
      )}
      <ToggleButton value={1}>
        <BarChart sx={{ fontSize: 14, mr: 0.5 }} />
        Статистика
      </ToggleButton>
      {showAscents && (
        <ToggleButton value={2}>
          <ListAlt sx={{ fontSize: 14, mr: 0.5 }} />
          Трассы
        </ToggleButton>
      )}
    </ToggleButtonGroup>  );
}
