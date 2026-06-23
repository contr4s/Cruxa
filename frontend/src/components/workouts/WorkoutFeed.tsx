import { useState } from 'react';
import { Box, Typography, FormControl, Select, MenuItem, CircularProgress, useTheme } from '@mui/material';
import { PostCard } from './PostCard';
import { filterSelectStyle } from '../../theme/cardStyles';
import type { PostDto, CommentDto } from '../../types/post';

interface WorkoutFeedProps {
  posts: PostDto[];
  isLoading?: boolean;
  getComments: (postId: string) => Promise<CommentDto[]>;
  onLikeToggle: (postId: string, wasLiked: boolean) => void;
  onCommentAdded: (postId: string) => void;
}

const SORT_OPTIONS = [
  { value: 'recent', label: 'Сначала новые' },
  { value: 'popular', label: 'Популярные' },
  { value: 'subs', label: 'Подписки' },
  { value: 'recommended', label: 'Рекомендуемые' },
];

export function WorkoutFeed({ posts, isLoading, getComments, onLikeToggle, onCommentAdded }: WorkoutFeedProps) {
  const theme = useTheme();
  const [sort, setSort] = useState('recent');

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h3" sx={{ fontSize: '1.15rem', fontWeight: 700, color: theme.palette.text.primary }}>
          💪 Тренировки
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              sx={filterSelectStyle(theme)}
            >
              {SORT_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Create post CTA */}
      <Box
        sx={{
          background: theme.palette.background.paper,
          borderRadius: `${theme.shape.borderRadius}px`,
          border: `1px dashed ${theme.palette.divider}`,
          p: 2,
          mb: 2,
          cursor: 'pointer',
          transition: 'background .15s',
          '&:hover': { background: theme.custom.surface2 },
        }}
      >
        <Typography sx={{ fontSize: '0.85rem', color: theme.custom.text3, textAlign: 'center' }}>
          ✏️ Написать о тренировке...
        </Typography>
      </Box>

      {/* Post list */}
      {posts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography sx={{ fontSize: '0.9rem', color: theme.custom.text3 }}>
            Пока нет записей
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              getComments={getComments}
              onLikeToggle={onLikeToggle}
              onCommentAdded={onCommentAdded}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
