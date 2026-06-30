import { Box, Typography, Chip, useTheme } from '@mui/material';
import { Star, LocationOn, Train } from '@mui/icons-material';
import type { GymDto } from '../../../types/gym';
import { FavoriteButton } from '../../ui/FavoriteButton';
import { getRatingColor } from '../../../constants/rating';

interface GymInfoBlockProps {
  gym: GymDto;
  onFavoriteToggle: () => void;
}

export function GymInfoBlock({ gym, onFavoriteToggle }: GymInfoBlockProps) {
  const theme = useTheme();

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h2" sx={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.3 }}>
          {gym.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, ml: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, color: getRatingColor(gym.rating) }}>
            <Star sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700 }}>{gym.rating.toFixed(1)}</Typography>
          </Box>
          <FavoriteButton isFavorite={gym.isFavorite} onToggle={onFavoriteToggle} size={22} />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, color: theme.palette.text.secondary }}>
        <LocationOn sx={{ fontSize: 14 }} />
        <Typography sx={{ fontSize: '0.82rem' }}>
          {gym.address}
        </Typography>
      </Box>
      {gym.metroStations.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5, alignItems: 'center' }}>
          {gym.metroStations.map((m) => (
            <Chip
              key={m}
              icon={<Train sx={{ fontSize: 14 }} />}
              label={m}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.68rem',
                background: theme.custom.surface2,
                color: theme.palette.text.secondary,
              }}
            />
          ))}
        </Box>
      )}
      {gym.description && (
        <Typography sx={{ fontSize: '0.88rem', color: theme.palette.text.secondary, lineHeight: 1.5, mt: 1.5 }}>
          {gym.description}
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1.5 }}>
        {gym.tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            sx={{
              height: 22,
              fontSize: '0.68rem',
              fontWeight: 600,
              background: theme.custom.surface3,
              color: theme.palette.text.primary,
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
