import { Box, Typography, useTheme } from '@mui/material';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

interface GoalsPanelProps {
  variant?: 'default' | 'sidebar';
}

export function GoalsPanel({ variant = 'default' }: GoalsPanelProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        background: theme.palette.background.paper,
        borderRadius: `${theme.shape.borderRadius}px`,
        p: variant === 'sidebar' ? 2 : 3,
        border: `1px solid ${theme.palette.divider}`,
        textAlign: 'center',
      }}
    >
      <Typography sx={{ fontSize: '0.9rem', color: theme.custom.text3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75 }}>
        <TrackChangesIcon sx={{ fontSize: 20 }} /> Цели — скоро
      </Typography>
    </Box>
  );
}
