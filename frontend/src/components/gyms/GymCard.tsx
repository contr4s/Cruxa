import { Box, Typography, useTheme } from '@mui/material';
import { Star, ShowChart, Height, SpaceDashboard, NearMe } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { GymDto } from '../../types/gym';
import { Card } from '../../theme/cardStyles';
import { MediaCarousel } from '../ui/MediaCarousel';
import { FavoriteButton } from '../ui/FavoriteButton';
import { GymBadge } from '../ui/GymBadge';
import { getRatingColor } from '../../constants/rating';
import { pluralize } from '../../utils/pluralize';
import { gymDistance, formatDistance } from '../../utils/geo';
import { useUserLocation } from '../../hooks/useUserLocation';

interface GymCardProps {
  gym: GymDto;
  onFavoriteToggle: (id: string) => void;
}

export function GymCard({ gym, onFavoriteToggle }: GymCardProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const userLoc = useUserLocation();

  return (
    <Box
      sx={{
        ...Card(theme),
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,.3)',
          borderColor: theme.palette.primary.main,
        },
      }}
      onClick={() => navigate(`/gyms/${gym.id}`)}
    >
      <Box sx={{ position: 'relative' }}>
        <MediaCarousel images={gym.photoUrls} aspectRatio="16 / 10" />
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }} onClick={(e) => e.stopPropagation()}>
          <FavoriteButton isFavorite={gym.isFavorite} onToggle={() => onFavoriteToggle(gym.id)} size={22} />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: theme.palette.text.primary, lineHeight: 1.3 }}>
            {gym.name}
          </Typography>
          <Typography sx={{ fontSize: '0.78rem', color: theme.palette.text.secondary, mt: 0.25 }}>
            {gym.address}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flexShrink: 0, color: getRatingColor(gym.rating) }}>
          <Star sx={{ fontSize: 16 }} />
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>
            {gym.rating.toFixed(1)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', alignItems: 'center' }}>
          <GymBadge icon={<ShowChart sx={{ fontSize: 12 }} />} label={`${gym.activeRouteCount} ${pluralize(gym.activeRouteCount, ['трасса', 'трассы', 'трасс'])}`} />
          {gym.maxHeight && <GymBadge icon={<Height sx={{ fontSize: 12 }} />} label={`${gym.maxHeight} м`} />}
          {gym.wallArea && <GymBadge icon={<SpaceDashboard sx={{ fontSize: 12 }} />} label={`${gym.wallArea} м²`} />}
        </Box>
        {(gym.distance != null || (gym.lat && gym.lon)) && (
          <GymBadge
            icon={<NearMe sx={{ fontSize: 13 }} />}
            label={gym.distance != null ? formatDistance(gym.distance) : (gymDistance(gym.lat, gym.lon, userLoc?.lat, userLoc?.lon) ?? '')}
            sx={{ bgcolor: 'transparent', border: `1px solid ${theme.palette.divider}`, color: theme.palette.text.primary, fontSize: '0.7rem', height: 20 }}
          />
        )}
      </Box>
    </Box>
  );
}
