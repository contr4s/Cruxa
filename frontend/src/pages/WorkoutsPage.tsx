import { useMemo, useRef, useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useToggleLike } from '../services/hooks/useFeed';
import { deletePost as deletePostApi } from '../services/posts.service';
import { useUserPosts } from '../services/hooks/useUserPosts';
import { useAuthStore } from '../stores/authStore';
import { WorkoutFeed } from '../components/workouts/WorkoutFeed';
import { WeekStats, AchievementsPanel } from '../components/workouts';
import { GoalsPanel } from '../components/workouts/goals/GoalsPanel';
import { EditPostModal } from '../components/posts/EditPostModal';
import { StateDisplay } from '../components/ui/StateDisplay';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { getComments } from '../services/posts.service';
import { PageContainer } from '../components/layout/PageContainer';
import { AsidePanel } from '../components/layout/AsidePanel';
import { useQueryClient } from '@tanstack/react-query';
import type { PostDto } from '../types/post';

export default function WorkoutsPage() {
  const userId = useAuthStore((s) => s.userId);
  const {
    data: pages,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserPosts(userId ?? undefined);
  const posts = useMemo(() => pages?.pages.flatMap((p) => p.items) ?? [], [pages]);
  const toggleLikeMutation = useToggleLike();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<PostDto | null>(null);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deletePostApi(deleteTarget);
      enqueueSnackbar('Пост удалён', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['user', userId, 'posts'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    } catch {
      enqueueSnackbar('Не удалось удалить пост', { variant: 'error' });
    } finally {
      setDeleteTarget(null);
    }
  };

  if (isError) {
    return (
      <PageContainer>
        <StateDisplay type="error" message="Ошибка загрузки тренировок" onRetry={() => refetch()} />
      </PageContainer>
    );
  }
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: '300px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, pages]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', gap: 1 }}>
      <PageContainer sx={{ mx: 0, maxWidth: 720 }}>
        <WorkoutFeed
          posts={posts}
          isLoading={isLoading}
          getComments={getComments}
          onLikeToggle={(postId, wasLiked) => toggleLikeMutation.mutate({ postId, isLiked: wasLiked })}
          onCommentAdded={() => {}}
          onEdit={(id) => {
            const p = posts.find((post) => post.id === id);
            if (p) setEditTarget(p);
          }}
          onDelete={(id) => setDeleteTarget(id)}
        />
        {isFetchingNextPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        <div ref={sentinelRef} />
      </PageContainer>
      <AsidePanel>
        <WeekStats />
        <GoalsPanel variant="sidebar" />
        <AchievementsPanel />
      </AsidePanel>
      {editTarget && (
        <EditPostModal
          open={editTarget !== null}
          post={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}
      <ConfirmDialog
        open={deleteTarget !== null}
        title="Удалить пост?"
        message="Пост и все его пролазы будут удалены. Это действие нельзя отменить."
        confirmLabel="Удалить"
        severity="error"
        loading={false}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
