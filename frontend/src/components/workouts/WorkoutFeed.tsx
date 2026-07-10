import { Box } from '@mui/material';
import { PostCard } from '../posts/PostCard';
import { StateDisplay } from '../ui/StateDisplay';
import { useAuthStore } from '../../stores/authStore';
import type { PostDto, CommentDto } from '../../types/post';

interface WorkoutFeedProps {
  posts: PostDto[];
  isLoading?: boolean;
  emptyStateMessage?: string;
  defaultTab?: number;
  getComments: (postId: string) => Promise<CommentDto[] | { items: CommentDto[] }>;
  onLikeToggle: (postId: string, wasLiked: boolean) => void;
  onCommentAdded: () => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

export function WorkoutFeed({ posts, isLoading, emptyStateMessage, defaultTab = 1, getComments, onLikeToggle, onCommentAdded, onEdit, onDelete }: WorkoutFeedProps) {
  const currentUserId = useAuthStore((s) => s.userId);

  if (isLoading) {
    return <StateDisplay type="loading" message="Загрузка тренировок…" />;
  }

  return (
    <Box>
      {posts.length === 0 ? (
        <StateDisplay
          type="empty"
          message={emptyStateMessage ?? 'У вас пока нет тренировок'}
          description={emptyStateMessage ? undefined : 'Нажмите ＋ внизу экрана, чтобы добавить тренировку'}
        />
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
              onEdit={onEdit ? () => onEdit(post.id) : undefined}
              onDelete={onDelete ? () => onDelete(post.id) : undefined}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
