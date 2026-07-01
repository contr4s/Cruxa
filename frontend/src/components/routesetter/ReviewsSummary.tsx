import { Box, Typography, useTheme } from '@mui/material';
import { Star, TrendingUp, Warning } from '@mui/icons-material';
import { Card } from '../../theme/cardStyles';
import type { RouteReviewSummary } from '../../types/routesetter';

interface ReviewsSummaryProps {
  reviews: RouteReviewSummary[];
}

export function ReviewsSummary({ reviews }: ReviewsSummaryProps) {
  const theme = useTheme();

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const bestReview = reviews.length
    ? reviews.reduce((best, r) => (r.rating > best.rating ? r : best), reviews[0])
    : null;

  const worstReview = reviews.length
    ? reviews.reduce((worst, r) => (r.rating < worst.rating ? r : worst), reviews[0])
    : null;

  const cards = [
    {
      icon: <Star sx={{ fontSize: 18, color: theme.palette.secondary.main }} />,
      label: 'Средняя оценка',
      value: avgRating.toFixed(1),
    },
    {
      icon: <TrendingUp sx={{ fontSize: 18, color: theme.palette.success.main }} />,
      label: 'Лучший отзыв',
      value: bestReview ? `${bestReview.rating}★ — ${bestReview.routeName}` : '—',
    },
    {
      icon: <Warning sx={{ fontSize: 18, color: theme.palette.warning.main }} />,
      label: 'Требует внимания',
      value: worstReview && worstReview.rating <= 3 ? `${worstReview.rating}★ — ${worstReview.routeName}` : 'Нет',
    },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
      {cards.map((c) => (
        <Box key={c.label} sx={{ ...Card(theme), display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            {c.icon}
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: theme.palette.text.secondary }}>
              {c.label}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: theme.palette.text.primary }}>
            {c.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
