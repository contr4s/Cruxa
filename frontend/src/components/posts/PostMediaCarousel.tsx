import { Box } from '@mui/material';
import { MediaCarousel } from '../ui/MediaCarousel';

interface PostMediaCarouselProps {
  images: string[];
  aspectRatio?: string;
}

export function PostMediaCarousel({ images, aspectRatio = '4/5' }: PostMediaCarouselProps) {
  if (!images || images.length === 0) return null;

  return (
    <Box sx={{ width: '100%' }}>
      <MediaCarousel images={images} aspectRatio={aspectRatio} />
    </Box>
  );
}