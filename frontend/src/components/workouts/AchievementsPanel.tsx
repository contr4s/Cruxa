import { Box, Typography, useTheme } from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';

export function AchievementsPanel() {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 2 }}>
      <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', mb: 1.5, color: theme.palette.text.primary, display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <EmojiEvents sx={{ fontSize: 16 }} /> Достижения
      </Typography>
      <Typography sx={{ fontSize: '0.78rem', color: theme.palette.text.secondary, textAlign: 'center', py: 2 }}>
        Скоро
      </Typography>
    </Box>
  );
}
