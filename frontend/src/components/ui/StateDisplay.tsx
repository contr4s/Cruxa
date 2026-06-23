import { Box, Typography, CircularProgress, useTheme } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import InboxIcon from '@mui/icons-material/Inbox';
import type { SxProps } from '@mui/system';
import type { ReactNode } from 'react';

type StateType = 'loading' | 'error' | 'empty';

interface StateDisplayProps {
  type: StateType;
  message?: string;
  description?: string;
  icon?: ReactNode;
  sx?: SxProps;
  size?: 'sm' | 'md' | 'lg';
}

const DEFAULT_PROPS: Record<StateType, { icon: ReactNode; message: string }> = {
  loading: { icon: null, message: 'Загрузка...' },
  error: { icon: <WarningIcon sx={{ fontSize: '2.5rem', color: '#FFB300' }} />, message: 'Что-то пошло не так' },
  empty: { icon: <InboxIcon sx={{ fontSize: '2.5rem', color: '#757575' }} />, message: 'Нет данных' },
};

const SIZE_STYLES = {
  sm: { iconSize: '1.5rem', textSize: '0.82rem', py: 3 },
  md: { iconSize: '2.5rem', textSize: '0.9rem', py: 5 },
  lg: { iconSize: '3rem', textSize: '1rem', py: 8 },
};

export function StateDisplay({
  type,
  message,
  description,
  icon,
  sx,
  size = 'md',
}: StateDisplayProps) {
  const theme = useTheme();
  const defaults = DEFAULT_PROPS[type];
  const sizeStyle = SIZE_STYLES[size];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 1,
        py: sizeStyle.py,
        px: 2,
        ...sx,
      }}
    >
      {type === 'loading' ? (
        <CircularProgress size={28} sx={{ color: theme.custom.text3 }} />
      ) : (
        <Box sx={{ fontSize: sizeStyle.iconSize, lineHeight: 1 }}>
          {icon ?? defaults.icon}
        </Box>
      )}
      <Typography
        sx={{
          fontSize: sizeStyle.textSize,
          fontWeight: 600,
          color: theme.palette.text.secondary,
        }}
      >
        {message ?? defaults.message}
      </Typography>
      {description && (
        <Typography
          sx={{
            fontSize: '0.78rem',
            color: theme.custom.text3,
            maxWidth: 300,
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
}
