import { useRef, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';
import { ProfileHeader, TopRoutes, ActivityCalendar } from '../components/profile';
import { WorkoutFeed } from '../components/workouts/WorkoutFeed';
import { StateDisplay } from '../components/ui/StateDisplay';
import { PageContainer } from '../components/layout/PageContainer';
import { Reveal } from '../components/ui/Reveal';
import { responsiveGrid } from '../theme/commonStyles';
import { useAuthStore } from '../stores/authStore';
import { useUserByUsername, useUserStats, useIsFollowing, useFollowUser, useUnfollowUser } from '../services/hooks/useUser';
import { useUserPosts } from '../services/hooks/useUserPosts';
import { useToggleLike } from '../services/hooks/useFeed';
import { getComments } from '../services/posts.service';

export default function UserProfilePage() {
  const theme = useTheme();

  const { username } = useParams<{ username: string }>();
  const currentUserId = useAuthStore((s) => s.userId);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data: user, isLoading: userLoading, isError: userNotFound } = useUserByUsername(username);

  // Redirect if it's our own profile
  if (user && currentUserId && user.id === currentUserId) {
    return <Navigate to="/profile" replace />;
  }

  const userId = user?.id;
  const { data: stats, isLoading: statsLoading } = useUserStats(userId ?? '');
  const { data: isFollowed, isLoading: isFollowingLoading } = useIsFollowing(userId);
  const {
    data: postsPages,
    isLoading: postsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserPosts(userId);

  const { mutate: doFollow, isPending: followPending } = useFollowUser();
  const { mutate: doUnfollow, isPending: unfollowPending } = useUnfollowUser();
  const { mutate: doToggleLike } = useToggleLike();

  const handleToggleFollow = () => {
    if (!userId) return;
    if (isFollowed) doUnfollow(userId);
    else doFollow(userId);
  };

  // Infinite scroll
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) fetchNextPage(); },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (userLoading || statsLoading) {
    return (
      <PageContainer>
        <StateDisplay type="loading" message="Загрузка профиля…" />
      </PageContainer>
    );
  }

  if (userNotFound || !user || !stats) {
    return (
      <PageContainer>
        <StateDisplay type="error" message="Пользователь не найден" />
      </PageContainer>
    );
  }

  const posts = postsPages?.pages.flatMap((p) => p.items) ?? [];

  return (
    <PageContainer sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Reveal>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ProfileHeader
            user={user}
            isOwner={false}
            isFollowed={isFollowed ?? false}
            isFollowLoading={followPending || unfollowPending || isFollowingLoading}
            onToggleFollow={handleToggleFollow}
            followersCount={stats.followersCount}
            followingCount={stats.followingCount}
            kruskorScore={stats.kruscore}
            totalWorkouts={stats.totalWorkouts}
          />
        </Box>
      </Reveal>

      {/* Top Routes + Activity Calendar (2 columns) */}
      <Reveal delay={0.1}>
        <Box sx={responsiveGrid()}>
          <TopRoutes userId={userId} />
          <ActivityCalendar userId={userId} />
        </Box>
      </Reveal>

      {/* Divider */}
      <Reveal delay={0.1}>
        <Box sx={{
          height: 2,
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, transparent 100%)`,
          borderRadius: '2px',
          width: '100%',
        }} />
      </Reveal>

      {/* Posts */}
      <Reveal delay={0.2}>
        <Box>
          <WorkoutFeed
            posts={posts}
            isLoading={postsLoading}
            emptyStateMessage="Пользователь пока ничего не опубликовал"
            defaultTab={1}
            getComments={(postId) => getComments(postId)}
            onLikeToggle={(postId, wasLiked) => doToggleLike({ postId, isLiked: wasLiked })}
            onCommentAdded={() => {}}
          />
        </Box>
      </Reveal>

      {/* Infinite scroll sentinel */}
      {hasNextPage && (
        <Box ref={loadMoreRef} sx={{ textAlign: 'center', py: 2 }}>
          <StateDisplay type="loading" message="Загрузка постов…" size="sm" />
        </Box>
      )}
    </PageContainer>
  );
}
