import { Box, Typography, useTheme } from '@mui/material';
import { FitnessCenter, Star, Height, ShowChart, NearMe } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { RecommendedGymDto } from '../../types/post';
import { getRatingColor } from '../../constants/rating';
import { GymBadge } from '../ui/GymBadge';
import { pluralize } from '../../utils/pluralize';
import { gymDistance } from '../../utils/geo';
import { useUserLocation } from '../../hooks/useUserLocation';
import { StateDisplay } from '../ui/StateDisplay';

interface FeedGymRecommendationsProps {
  gyms: RecommendedGymDto[];
}

export function FeedGymRecommendations({ gyms }: FeedGymRecommendationsProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const userLoc = useUserLocation();

  if (gyms.length === 0) {
    return (
      <Box sx={{ bgcolor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: theme.palette.text.secondary, textAlign: 'center', py: 2 }}>
          Рекомендации — скоро
        </Typography>
      </Box>
    );
  }

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
      {gyms.length === 0 ? (
        <StateDisplay type="empty" size="sm" message="Нет рекомендаций" />
      ) : (
        <>
          {gyms.map((gym) => (
            <Box
              key={gym.id}
              onClick={() => navigate(`/gyms/${gym.id}`)}
              sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.5, px: 0.5, mx: -0.5, borderRadius: 1,
                transition: 'background .2s ease',
                cursor: 'pointer',
                '&:hover': { bgcolor: theme.custom.surface2 },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flex: 1, minWidth: 0, p: 0.25 }}>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: theme.palette.text.primary, pr: 0.25 }}>
                  {gym.name}
                </Typography>
                {gym.activeRouteCount != null && (
                  <GymBadge icon={<ShowChart sx={{ fontSize: 12 }} />} label={`${gym.activeRouteCount} ${pluralize(gym.activeRouteCount, ['трасса', 'трассы', 'трасс'])}`} />
                )}
                {gym.maxHeight !== undefined && (
                  <GymBadge icon={<Height sx={{ fontSize: 12 }} />} label={`${gym.maxHeight}м`} />
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: getRatingColor(gym.rating), display: 'flex', alignItems: 'center', gap: 0.25 }}>
                  <Star sx={{ fontSize: 14 }} /> {gym.rating.toFixed(1)}
                </Typography>
                {gym.lat && gym.lon && (
                  <GymBadge
                    icon={<NearMe sx={{ fontSize: 12 }} />}
                    label={gymDistance(gym.lat, gym.lon, userLoc?.lat, userLoc?.lon) ?? ''}
                    sx={{ bgcolor: 'transparent', border: `1px solid ${theme.palette.divider}`, color: theme.palette.text.primary }}
                  />
                )}
              </Box>
            </Box>
          ))}
        </>
      )}
    </Box>
  );
}
