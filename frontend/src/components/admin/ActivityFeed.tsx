import { Box, Typography, useTheme } from '@mui/material';
import { Card } from '../../theme/cardStyles';
import { GymChip } from '../ui/GymChip';
import type { RecentActivityItem } from '../../types/admin';

interface ActivityFeedProps {
  items: RecentActivityItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  const theme = useTheme();

  return (
    <Box sx={Card(theme)}>
      <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: theme.palette.text.primary, mb: 1.5 }}>
        Последние обновления
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {items.map((item) => (
          <Box
            key={`${item.gymId}-${item.timestamp}`}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontSize: '0.82rem' }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                flexShrink: 0,
                background: item.isOnline ? '#43A047' : '#757575',
                boxShadow: item.isOnline ? '0 0 6px rgba(67,160,71,0.5)' : 'none',
              }}
            />
            <GymChip name={item.gymName} gymId={item.gymId} />
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.82rem' }}>
              — {item.event}
            </Typography>
            <Typography sx={{ color: theme.custom.text3, fontSize: '0.78rem', ml: 'auto', flexShrink: 0 }}>
              {item.timestamp}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
