import { Box, Typography, useTheme } from '@mui/material';
import type { LinkedGymSummary } from '../../types/routesetter';
import { LinkedGymCard } from '../gyms/LinkedGymCard';

interface LinkedGymsProps {
  gyms: LinkedGymSummary[];
}

export function LinkedGyms({ gyms }: LinkedGymsProps) {
  const theme = useTheme();

  if (gyms.length === 0) {
    return (
      <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.secondary, py: 2 }}>
        Нет привязанных залов
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
      {gyms.map((gym) => (
        <LinkedGymCard key={gym.id} gym={gym} />
      ))}
    </Box>
  );
}
