import { Box, useTheme } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';

interface GymBadgeProps {
  icon?: ReactNode;
  label: string;
  sx?: SxProps<Theme>;
}

export function GymBadge({ icon, label, sx }: GymBadgeProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        gap: 0.25,
        px: 0.5,
        py: 0.15,
        borderRadius: '8px',
        bgcolor: theme.custom.surface2,
        fontSize: '0.62rem',
        fontWeight: 600,
        color: theme.palette.text.secondary,
        height: 18,
        ...sx,
      }}
    >
      {icon}
      {label}
    </Box>
  );
}
