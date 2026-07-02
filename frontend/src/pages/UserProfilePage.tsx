import { useRef, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ProfileHeader, TopRoutes, ActivityCalendar } from '../components/profile';
import { WorkoutFeed } from '../components/workouts/WorkoutFeed';
import { StateDisplay } from '../components/ui/StateDisplay';
import { PageContainer } from '../components/layout/PageContainer';
import { responsiveGrid } from '../theme/commonStyles';
import { useAuthStore } from '../stores/authStore';
import { useUserByUsername, useUserStats, useIsFollowing, useFollowUser, useUnfollowUser } from '../services/hooks/useUser';
import { useUserPosts } from '../services/hooks/useUserPosts';
import { useToggleLike } from '../services/hooks/useFeed';
import { getComments } from '../services/posts.service';

export default function UserProfilePage() {
  const theme = useTheme();
  useScrollReveal(0);

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
        <StateDisplay type="empty" message="Пользователь не найден" />
      </PageContainer>
    );
  }

  const posts = postsPages?.pages.flatMap((p) => p.items) ?? [];

  return (
    <PageContainer sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box className="scroll-reveal" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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

      {/* Top Routes + Activity Calendar (2 columns) */}
      <Box
        className="scroll-reveal scroll-reveal-delay-1"
        sx={responsiveGrid()}
      >
        <TopRoutes userId={userId} />
        <ActivityCalendar userId={userId} />
      </Box>

      {/* Divider */}
      <Box
        className="scroll-reveal scroll-reveal-delay-1"
        sx={{
          height: 2,
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, transparent 100%)`,
          borderRadius: '2px',
          width: '100%',
        }}
      />

      {/* Posts */}
      <Box className="scroll-reveal scroll-reveal-delay-2">
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

      {/* Infinite scroll sentinel */}
      {hasNextPage && (
        <Box ref={loadMoreRef} sx={{ textAlign: 'center', py: 2 }}>
          <StateDisplay type="loading" message="Загрузка постов…" size="sm" />
        </Box>
      )}
    </PageContainer>
  );
}
