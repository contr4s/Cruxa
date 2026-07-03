import { useState, useMemo, useRef, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useFeed, useToggleLike, useDeletePost, useFeedSuggestions } from '../services/hooks/useFeed';
import { WorkoutFeed } from '../components/workouts/WorkoutFeed';
import { FeedToggle } from '../components/feed/FeedToggle';
import { FeedUserSuggestions } from '../components/feed/FeedUserSuggestions';
import { FeedRouteRecommendations } from '../components/feed/FeedRouteRecommendations';
import { FeedGymRecommendations } from '../components/feed/FeedGymRecommendations';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { StateDisplay } from '../components/ui/StateDisplay';
import { getComments } from '../services/posts.service';
import { PageContainer } from '../components/layout/PageContainer';
import { AsidePanel } from '../components/layout/AsidePanel';

export default function FeedPage() {
  const [filter, setFilter] = useState<'subs' | 'recommended'>('subs');
  const {
    data: pages,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeed(filter);
  const posts = useMemo(() => pages?.pages.flatMap((p) => p.items) ?? [], [pages]);
  const toggleLikeMutation = useToggleLike();
  const deletePost = useDeletePost();
  const { enqueueSnackbar } = useSnackbar();
  const { data: suggestions } = useFeedSuggestions();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

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

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deletePost.mutateAsync(deleteTarget);
      enqueueSnackbar('Пост удалён', { variant: 'success' });
    } catch {
      enqueueSnackbar('Не удалось удалить пост', { variant: 'error' });
    } finally {
      setDeleteTarget(null);
    }
  };

  if (isError) {
    return (
      <PageContainer>
        <StateDisplay type="error" message="Ошибка загрузки ленты" onRetry={() => refetch()} />
      </PageContainer>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', gap: 2 }}>
      <PageContainer sx={{ mx: 0, maxWidth: 720 }}>
        <FeedToggle
          value={filter}
          onChange={setFilter}
          subsCount={8}
        />
        <Box sx={{ mt: 2 }}>
          <WorkoutFeed
            posts={posts}
            isLoading={isLoading}
            defaultTab={0}
            emptyStateMessage="В ленте пока пусто. Подпишитесь на других скалолазов!"
            getComments={getComments}
            onLikeToggle={(postId, wasLiked) => toggleLikeMutation.mutate({ postId, isLiked: wasLiked })}
            onCommentAdded={() => {}}
            onDelete={(id) => setDeleteTarget(id)}
          />
          {isFetchingNextPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
          <div ref={sentinelRef} />
        </Box>
      </PageContainer>
      <AsidePanel sx={{ width: 320 }}>
        <FeedUserSuggestions users={suggestions?.users ?? []} />
        <FeedGymRecommendations gyms={suggestions?.gyms ?? []} />
        <FeedRouteRecommendations routes={suggestions?.routes ?? []} />
      </AsidePanel>
      <ConfirmDialog
        open={deleteTarget !== null}
        title="Удалить пост?"
        message="Пост и все его пролазы будут удалены. Это действие нельзя отменить."
        confirmLabel="Удалить"
        severity="error"
        loading={deletePost.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
