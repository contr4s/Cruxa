import { Box } from '@mui/material';
import { SpaceDashboard, Height, CalendarMonth } from '@mui/icons-material';
import type { GymDto } from '../../../types/gym';
import { MediaCarousel } from '../../ui/MediaCarousel';
import { StatMiniCard } from './StatMiniCard';

interface GymPhotoBlockProps {
  gym: GymDto;
}

export function GymPhotoBlock({ gym }: GymPhotoBlockProps) {
  return (
    <Box sx={{ flex: 2, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <MediaCarousel images={gym.photoUrls} aspectRatio="4/3" />
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
        {gym.wallArea && (
          <StatMiniCard icon={<SpaceDashboard sx={{ fontSize: 16 }} />} label="Площадь" value={`${gym.wallArea} м²`} />
        )}
        {gym.maxHeight && (
          <StatMiniCard icon={<Height sx={{ fontSize: 16 }} />} label="Высота" value={`${gym.maxHeight} м`} />
        )}
        {gym.yearFounded && (
          <StatMiniCard icon={<CalendarMonth sx={{ fontSize: 16 }} />} label="Год открытия" value={String(gym.yearFounded)} />
        )}
      </Box>
    </Box>
  );
}
