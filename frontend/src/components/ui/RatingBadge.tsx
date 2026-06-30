import { Typography } from '@mui/material';
import { Star } from '@mui/icons-material';
import { getRatingColor } from '../../constants/rating';

interface RatingBadgeProps {
  rating: number;
  size?: 'sm' | 'md';
  sx?: import('@mui/system').SxProps;
}

export function RatingBadge({ rating, size = 'sm', sx }: RatingBadgeProps) {
  const iconSize = size === 'md' ? 18 : 14;
  const fSize = size === 'md' ? '0.85rem' : '0.72rem';

  return (
    <Typography
      component="span"
      sx={{
        fontSize: fSize,
        fontWeight: 600,
        color: getRatingColor(rating),
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.25,
        ...sx,
      }}
    >
      <Star sx={{ fontSize: iconSize }} />
      {rating.toFixed(1)}
    </Typography>
  );
}
