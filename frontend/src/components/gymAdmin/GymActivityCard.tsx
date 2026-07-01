import { Box, Typography, useTheme } from '@mui/material';
import { AddRoad, TrendingUp, Reviews, People } from '@mui/icons-material';
import { Card } from '../../theme/cardStyles';
import type { GymActivity } from '../../types/gymAdmin';

interface GymActivityCardProps {
  activity: GymActivity;
}

export function GymActivityCard({ activity }: GymActivityCardProps) {
  const theme = useTheme();

  const items = [
    { icon: <AddRoad sx={{ fontSize: 18, color: theme.palette.primary.main }} />, label: 'Новых трасс', value: activity.newRoutes },
    { icon: <TrendingUp sx={{ fontSize: 18, color: theme.palette.success.main }} />, label: 'Пролазов', value: activity.ascents },
    { icon: <Reviews sx={{ fontSize: 18, color: theme.palette.secondary.main }} />, label: 'Отзывов', value: activity.reviews },
    { icon: <People sx={{ fontSize: 18, color: theme.palette.info.main }} />, label: 'Посетителей', value: activity.visitors },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
      {items.map((item) => (
        <Box key={item.label} sx={{ ...Card(theme), display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            {item.icon}
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: theme.palette.text.secondary }}>
              {item.label}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: theme.palette.text.primary }}>
            {item.value}
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: theme.custom.text3 }}>
            {activity.period}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
