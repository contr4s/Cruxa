import { Box, Typography, useTheme } from '@mui/material';
import { RatingBadge } from '../ui/RatingBadge';
import type { RouteReviewSummary } from '../../types/routesetter';
import { UserLink } from '../user/UserLink';

interface RouteReviewsListProps {
  reviews: RouteReviewSummary[];
}

export function RouteReviewsList({ reviews }: RouteReviewsListProps) {
  const theme = useTheme();

  if (reviews.length === 0) {
    return (
      <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.secondary, py: 2 }}>
        Отзывов пока нет
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {reviews.map((review) => (
        <Box
          key={review.id}
          sx={{
            display: 'flex',
            gap: 1.5,
            p: 1.5,
            borderRadius: `${theme.shape.borderRadius}px`,
            background: theme.custom.surface2,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <UserLink
            username={review.username}
            displayName={review.displayName}
            avatarUrl={review.userAvatarUrl}
            size="md"
            withAvatar
            subtitle={
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                <Typography component="span" sx={{ fontSize: '0.72rem', color: theme.custom.text3 }}>
                  {review.routeName} · {review.routeGrade}
                </Typography>
                <RatingBadge rating={review.rating} size="sm" />
              </Box>
            }
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.82rem', color: theme.palette.text.secondary, mt: 0.5, lineHeight: 1.4 }}>
              {review.comment}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
