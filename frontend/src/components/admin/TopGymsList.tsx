import { Box, Typography, useTheme } from '@mui/material';
import { Card } from '../../theme/cardStyles';
import { GymChip } from '../ui/GymChip';
import type { TopGymItem } from '../../types/admin';

interface TopGymsListProps {
  items: TopGymItem[];
}

export function TopGymsList({ items }: TopGymsListProps) {
  const theme = useTheme();

  return (
    <Box sx={Card(theme)}>
      <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: theme.palette.text.primary, mb: 1.5 }}>
        Топ залов по активностям
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {items.map((item) => (
          <Box
            key={item.gymId}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}
          >
            <GymChip name={item.gymName} gymId={item.gymId} />
            <Typography sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: '0.82rem' }}>
              {item.ascentsCount.toLocaleString()} пролазов
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
