import { Box, Typography, useTheme } from '@mui/material';
import { Star, ShowChart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { LinkedGymSummary } from '../../types/routesetter';
import { Card } from '../../theme/cardStyles';
import { pluralize } from '../../utils/pluralize';

interface LinkedGymCardProps {
  gym: LinkedGymSummary;
}

export function LinkedGymCard({ gym }: LinkedGymCardProps) {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        ...Card(theme),
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.25,
        p: 2,
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,.3)',
          borderColor: theme.palette.primary.main,
        },
      }}
      onClick={() => navigate(`/gyms/${gym.id}`)}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: theme.custom.surface2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            flexShrink: 0,
          }}
        >
          🏔️
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: theme.palette.text.primary, lineHeight: 1.3 }}>
            {gym.name}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}>
            {gym.city}, {gym.address}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
          <ShowChart sx={{ fontSize: 14, color: theme.palette.primary.main }} />
          <Typography sx={{ fontSize: '0.78rem', color: theme.palette.text.secondary }}>
            {gym.activeRouteCount} {pluralize(gym.activeRouteCount, ['трасса', 'трассы', 'трасс'])}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
          <Star sx={{ fontSize: 14, color: theme.palette.secondary.main }} />
          <Typography sx={{ fontSize: '0.78rem', color: theme.palette.text.secondary }}>
            {gym.rating.toFixed(1)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
