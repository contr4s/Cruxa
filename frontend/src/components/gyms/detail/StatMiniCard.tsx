import { Box, Typography, useTheme } from '@mui/material';
import type { ReactNode } from 'react';

interface StatMiniCardProps {
  icon?: ReactNode;
  label: string;
  value: string;
}

export function StatMiniCard({ icon, label, value }: StatMiniCardProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: `${theme.shape.borderRadius}px`,
        p: 1.25,
        textAlign: 'center',
      }}
    >
      <Typography sx={{ fontSize: '0.68rem', color: theme.palette.text.secondary, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
        {icon}{label}
      </Typography>
      <Typography sx={{ fontSize: '0.95rem', fontWeight: 800, color: theme.palette.text.primary, mt: 0.25 }}>
        {value}
      </Typography>
    </Box>
  );
}
