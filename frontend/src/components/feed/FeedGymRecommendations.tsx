import { Box, Typography, useTheme } from '@mui/material';
import { FitnessCenter, Star, Height, SpaceDashboard } from '@mui/icons-material';
import type { RecommendedGymDto } from '../../types/post';
import { getRatingColor } from '../../constants/rating';

interface FeedGymRecommendationsProps {
  gyms: RecommendedGymDto[];
}

export function FeedGymRecommendations({ gyms }: FeedGymRecommendationsProps) {
  const theme = useTheme();

  return (
    <Box sx={{
      bgcolor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 2,
      p: 2,
      transition: 'box-shadow .2s ease, border-color .2s ease',
      '&:hover': {
        borderColor: theme.palette.primary.main,
        boxShadow: '0 4px 20px rgba(0,0,0,.3)',
      },
    }}>
      <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', mb: 1.5, color: theme.palette.text.primary, display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <FitnessCenter sx={{ fontSize: 16, color: theme.palette.primary.main }} /> Рекомендуемые залы
      </Typography>
      {gyms.map((gym) => (
        <Box
          key={gym.id}
          sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.5, px: 0.5, mx: -0.5, borderRadius: 1,
            transition: 'background .2s ease',
            cursor: 'pointer',
            '&:hover': { bgcolor: theme.custom.surface2 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: theme.palette.text.primary, pr: 0.5 }}>
              {gym.name}
            </Typography>
            {gym.maxHeight !== undefined && (
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, px: 0.5, py: 0.15, borderRadius: '8px', bgcolor: theme.custom.surface2, fontSize: '0.62rem', fontWeight: 600, color: theme.palette.text.secondary }}>
                <Height sx={{ fontSize: 12 }} /> {gym.maxHeight}м
              </Box>
            )}
            {gym.area !== undefined && (
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, px: 0.5, py: 0.15, borderRadius: '8px', bgcolor: theme.custom.surface2, fontSize: '0.62rem', fontWeight: 600, color: theme.palette.text.secondary }}>
                <SpaceDashboard sx={{ fontSize: 12 }} /> {gym.area}м²
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: getRatingColor(gym.rating), display: 'flex', alignItems: 'center', gap: 0.25 }}>
              <Star sx={{ fontSize: 14 }} /> {gym.rating.toFixed(1)}
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', color: theme.palette.text.secondary }}>
              {gym.distance}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
