import { Box } from '@mui/material';
import type { RouteDto } from '../../../types/route';
import { MediaCarousel } from '../../ui/MediaCarousel';

interface RoutePhotoBlockProps {
  route: RouteDto;
}

export function RoutePhotoBlock({ route }: RoutePhotoBlockProps) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <MediaCarousel images={route.photoUrls} aspectRatio="3/4" />
    </Box>
  );
}
