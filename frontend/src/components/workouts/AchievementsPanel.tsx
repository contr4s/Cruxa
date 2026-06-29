import { Box, Typography, useTheme } from '@mui/material';
import { EmojiEvents, LocalFireDepartment, Star, CameraAlt, CheckCircle } from '@mui/icons-material';

const BADGE_ITEMS = [
  { icon: <LocalFireDepartment sx={{ fontSize: 16 }} />, label: '15 дней подряд', badge: 'Новое!', badgeColor: '#26A69A' },
  { icon: <EmojiEvents sx={{ fontSize: 16 }} />, label: '50 трасс', badge: '+1', badgeColor: '#43A047' },
  { icon: <Star sx={{ fontSize: 16 }} />, label: '10 отзывов', badge: '✅' },
  { icon: <CameraAlt sx={{ fontSize: 16 }} />, label: '8 фото', badge: '✅' },
];

export function AchievementsPanel() {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 2 }}>
      <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', mb: 1.5, color: theme.palette.text.primary, display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <EmojiEvents sx={{ fontSize: 16 }} /> Достижения
      </Typography>
      {BADGE_ITEMS.map((item) => (
        <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.5 }}>
          <Typography sx={{ fontSize: '0.78rem', color: theme.palette.text.secondary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {item.icon}{item.label}
          </Typography>
          {item.badgeColor ? (
            <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 0.75, py: 0.15, borderRadius: '100px', bgcolor: `${item.badgeColor}22`, color: item.badgeColor, fontSize: '0.65rem', fontWeight: 700 }}>
              {item.badge}
            </Box>
          ) : (
            <CheckCircle sx={{ fontSize: 16, color: theme.palette.primary.main }} />
          )}
        </Box>
      ))}
    </Box>
  );
}
