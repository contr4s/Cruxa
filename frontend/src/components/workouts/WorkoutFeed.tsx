import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { FitnessCenter, Newspaper } from '@mui/icons-material';
import { PostCard } from '../posts/PostCard';
import { useAuthStore } from '../../stores/authStore';
import type { PostDto, CommentDto } from '../../types/post';

interface WorkoutFeedProps {
  posts: PostDto[];
  isLoading?: boolean;
  emptyStateMessage?: string;
  defaultTab?: number;
  getComments: (postId: string) => Promise<CommentDto[]>;
  onLikeToggle: (postId: string, wasLiked: boolean) => void;
  onCommentAdded: () => void;
}

export function WorkoutFeed({ posts, isLoading, emptyStateMessage, defaultTab = 1, getComments, onLikeToggle, onCommentAdded }: WorkoutFeedProps) {
  const theme = useTheme();
  const currentUserId = useAuthStore((s) => s.userId);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  return (
    <Box>
      {posts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          {emptyStateMessage ? (
            <>
              <Newspaper sx={{ fontSize: 40, color: theme.palette.text.secondary, mb: 1 }} />
              <Typography sx={{ fontSize: '0.9rem', color: theme.palette.text.secondary }}>
                {emptyStateMessage}
              </Typography>
            </>
          ) : (
            <>
              <FitnessCenter sx={{ fontSize: 40, color: theme.palette.text.secondary, mb: 1 }} />
              <Typography sx={{ fontSize: '0.9rem', color: theme.palette.text.secondary }}>
                У вас пока нет тренировок. Нажмите ＋ внизу экрана.
              </Typography>
            </>
          )}
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2}}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isOwner={post.userId === currentUserId}
              defaultTab={defaultTab}
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
