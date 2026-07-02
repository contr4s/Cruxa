import { useState, useEffect, useRef } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Star } from '@mui/icons-material';
import type { RouteReviewDto } from '../../../types/route';
import { Card, sectionTitleSx } from '../../../theme/cardStyles';
import { StateDisplay } from '../../ui/StateDisplay';
import { UserLink } from '../../user/UserLink';

interface RouteReviewsProps {
  reviews: RouteReviewDto[];
}

const INITIAL_COUNT = 3;
const LOAD_MORE_COUNT = 3;

export function RouteReviews({ reviews }: RouteReviewsProps) {
  const theme = useTheme();
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [reviews]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleCount < reviews.length) {
          setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, reviews.length));
        }
      },
      { rootMargin: '100px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visibleCount, reviews.length]);

  if (reviews.length === 0) {
    return (
      <Box sx={Card(theme)}>
        <Typography sx={sectionTitleSx(theme)}>Отзывы</Typography>
        <StateDisplay type="empty" message="Пока нет отзывов" size="sm" />
      </Box>
    );
  }

  const visibleReviews = reviews.slice(0, visibleCount);

  return (
    <Box sx={Card(theme)}>
      <Typography sx={sectionTitleSx(theme)}>Отзывы ({reviews.length})</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {visibleReviews.map((review) => (
          <Box key={review.id} sx={{ display: 'flex', gap: 1.5 }}>
            <UserLink
              username={review.username}
              displayName={review.displayName}
              avatarUrl={review.userAvatarUrl}
              size="sm"
              withAvatar
              subtitle={
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.15 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} sx={{ fontSize: 10, color: i < review.rating ? theme.palette.secondary.main : theme.custom.surface3 }} />
                    ))}
                  </Box>
                  <Typography component="span" sx={{ fontSize: '0.68rem', color: theme.custom.text3 }}>
                    {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                  </Typography>
                </Box>
              }
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.82rem', color: theme.palette.text.secondary, lineHeight: 1.4, wordBreak: 'break-word' }}>
                {review.comment}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
      {visibleCount < reviews.length && (
        <Box ref={sentinelRef} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Typography sx={{ fontSize: '0.72rem', color: theme.custom.text3 }}>Прокрутите для загрузки ещё отзывов…</Typography>
        </Box>
      )}
    </Box>
  );
}
