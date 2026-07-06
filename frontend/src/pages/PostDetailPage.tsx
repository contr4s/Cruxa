import { Box, useTheme } from '@mui/material';
import { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { usePost } from '../services/hooks/useFeed';
import { getComments } from '../services/posts.service';

import { CommentSection } from '../components/workouts/CommentSection';
import { PostDetailAuthor, PostDescription, PostActions, MediaToggle, PostMediaCarousel, PostAscentList } from '../components/posts';
import { ChartsCarousel } from '../components/charts/ChartsCarousel';
import { PageContainer } from '../components/layout/PageContainer';
import { ModalOverlay } from '../components/ui/ModalOverlay';
import { StateDisplay } from '../components/ui/StateDisplay';
import { computePyramid, computeDistribution, computeCategories } from '../utils/ascentStats';

export default function PostDetailPage() {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: post, isLoading } = usePost(id || '');
  const [tab, setTab] = useState(0);

  const state = location.state as { backgroundLocation?: Location } | undefined;
  const isModal = !!state?.backgroundLocation;

  const pyramid = useMemo(() => (post ? computePyramid(post.ascents) : []), [post]);
  const distribution = useMemo(() => (post ? computeDistribution(post.ascents) : []), [post]);
  const categories = useMemo(() => (post ? computeCategories(post.ascents) : {}), [post]);

  const handleClose = () => {
    if (isModal) navigate(-1);
    else navigate('/feed');
  };

  if (isLoading) {
    const fallback = <StateDisplay type="loading" message="Загрузка поста…" />;
    if (isModal) {
      return (
        <Box
          sx={{
            position: 'fixed', inset: 0, zIndex: 1300,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: 'rgba(0,0,0,0.85)',
          }}
        >
          {fallback}
        </Box>
      );
    }
    return <PageContainer>{fallback}</PageContainer>;
  }

  if (!post) {
    const fallback = <StateDisplay type="error" message="Пост не найден" />;
    if (isModal) {
      return (
        <Box
          sx={{
            position: 'fixed', inset: 0, zIndex: 1300,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: 'rgba(0,0,0,0.85)',
          }}
        >
          {fallback}
        </Box>
      );
    }
    return <PageContainer>{fallback}</PageContainer>;
  }

  const tabContentDesktop = (
    <>
      {tab === 0 && (
        <PostMediaCarousel images={post.mediaUrls} aspectRatio="4/5" />
      )}
      {tab === 1 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ChartsCarousel
            pyramid={pyramid}
            distribution={distribution}
            categories={categories}
          />
          <PostAscentList ascents={post.ascents} direction="row" />
        </Box>
      )}
    </>
  );

  const tabContentMobile = (
    <>
      {tab === 0 && (
        <PostMediaCarousel images={post.mediaUrls} aspectRatio="4/5" />
      )}
      {tab === 1 && (
        <ChartsCarousel
          pyramid={pyramid}
          distribution={distribution}
          categories={categories}
        />
      )}
      {tab === 2 && (
        <PostAscentList ascents={post.ascents} direction="row" />
      )}
    </>
  );

  const desktopContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Left column */}
      <Box
        sx={{
          flex: '1 1 58%',
          maxWidth: '58%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ px: 2, pt: 2, pb: 1, mx: 'auto' }}>
          <MediaToggle value={tab} onChange={setTab} showAscents={false} hasMedia={post.mediaUrls.length > 0} />
        </Box>
        <Box sx={{ flex: 1, overflow: 'auto', px: 2, pb: 2 }}>          {tabContentDesktop}
        </Box>
      </Box>

      {/* Right column */}
      <Box
        sx={{
          flex: '0 0 38%',
          maxWidth: '38%',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ px: 2.5, pt: 2, pb: 1 }}>
          <PostDetailAuthor
            username={post.username}
            displayName={post.displayName}
            avatarUrl={post.userAvatarUrl}
            gymName={post.gymName}
            gymId={post.gymId}
            createdAt={post.createdAt}
          />
        </Box>
        <Box sx={{ px: 2.5, pb: 1.5 }}>
          <PostDescription
            body={post.body}
            totalKruskor={post.stats.totalKruskor}
            avgGrade={post.stats.avgGrade}
            duration={post.stats.duration}
            totalRoutes={post.stats.totalRoutes}
            maxGrade={post.stats.maxGrade}
          />
        </Box>
        <PostActions
          isLiked={post.isLiked}
          likesCount={post.likesCount}
          commentsCount={post.commentsCount}
        />
        <Box sx={{ flex: 1, minHeight: 200, px: 2.5, pb: 2 }}>
          <CommentSection
            postId={post.id}
            getComments={getComments}
            onCommentAdded={() => {}}
          />
        </Box>
      </Box>
    </Box>
  );

  const mobileContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <Box sx={{ px: 2.5, pt: 2, pb: 1 }}>
        <PostDetailAuthor
          username={post.username}
          displayName={post.displayName}
          avatarUrl={post.userAvatarUrl}
          gymName={post.gymName}
          gymId={post.gymId}
          createdAt={post.createdAt}
        />
      </Box>
      <Box sx={{ px: 2.5, pb: 1.5 }}>
        <PostDescription
          body={post.body}
          totalKruskor={post.stats.totalKruskor}
          avgGrade={post.stats.avgGrade}
          duration={post.stats.duration}
          totalRoutes={post.stats.totalRoutes}
          maxGrade={post.stats.maxGrade}
        />
      </Box>
      <Box sx={{ px: 2, pt: 1, pb: 1, mx: 'auto' }}>
        <MediaToggle value={tab} onChange={setTab} hasMedia={post.mediaUrls.length > 0} />
      </Box>
      <Box sx={{ px: 2, pb: 2 }}>        {tabContentMobile}
      </Box>
      <PostActions
        isLiked={post.isLiked}
        likesCount={post.likesCount}
        commentsCount={post.commentsCount}
      />
      <Box sx={{ px: 2.5, pb: 2 }}>
        <CommentSection
          postId={post.id}
          getComments={getComments}
          onCommentAdded={() => {}}
        />
      </Box>
    </Box>
  );

  const content = (
    <>
      <Box sx={{ display: { xs: 'none', md: 'flex' }, width: '100%', height: '100%' }}>
        {desktopContent}
      </Box>
      <Box sx={{ display: { xs: 'flex', md: 'none' }, width: '100%', height: '100%' }}>
        {mobileContent}
      </Box>
    </>
  );
  if (isModal) {
    return (
      <ModalOverlay open onClose={handleClose}>
        {content}
      </ModalOverlay>
    );
  }

  return (
    <PageContainer>
      <Box
        onClick={() => navigate(-1)}
        sx={{
          cursor: 'pointer',
          mb: 2,
          color: theme.palette.primary.main,
          fontSize: '0.9rem',
          '&:hover': { opacity: 0.8 },
        }}
      >
        ← Назад
      </Box>
      <Box
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          bgcolor: 'background.paper',
          overflow: 'hidden',
        }}
      >
        {content}
      </Box>
    </PageContainer>
  );
}