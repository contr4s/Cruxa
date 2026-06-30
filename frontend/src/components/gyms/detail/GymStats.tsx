import { Box, Typography, useTheme } from '@mui/material';
import { ShowChart, Star, TrendingUp } from '@mui/icons-material';
import { Card } from '../../../theme/cardStyles';

interface GymStatsProps {
  activeRoutes: number;
  avgRating: number;
  gradeRange?: string;
}

export function GymStats({ activeRoutes, avgRating, gradeRange }: GymStatsProps) {
  const theme = useTheme();

  const stats = [
    {
      icon: <ShowChart sx={{ fontSize: 20, color: theme.palette.primary.main }} />,
      label: 'Активных трасс',
      value: activeRoutes,
    },
    {
      icon: <Star sx={{ fontSize: 20, color: theme.palette.secondary.main }} />,
      label: 'Средний рейтинг',
      value: avgRating.toFixed(1),
    },
    {
      icon: <TrendingUp sx={{ fontSize: 20, color: theme.palette.primary.light }} />,
      label: 'Сложность',
      value: gradeRange ?? '—',
    },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: { xs: 1, sm: 2 } }}>
      {stats.map((s) => (
        <Box
          key={s.label}
          sx={{
            ...Card(theme),
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.75, sm: 1.5 },
            p: { xs: 1, sm: 2.5 },
          }}
        >
          <Box sx={{ fontSize: 0 }}>{s.icon}</Box>
          <Box>
            <Typography sx={{ fontSize: { xs: '0.6rem', sm: '0.68rem' }, color: theme.palette.text.secondary, fontWeight: 600 }}>
              {s.label}
            </Typography>
            <Typography sx={{ fontSize: { xs: '0.85rem', sm: '1.1rem' }, fontWeight: 800, color: theme.palette.text.primary }}>
              {s.value}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
