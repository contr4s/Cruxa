import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFeed, useToggleLike } from '../services/hooks/useFeed';
import { WorkoutFeed } from '../components/workouts/WorkoutFeed';
import { WeekStats, AchievementsPanel } from '../components/workouts';
import { GoalsPanel } from '../components/workouts/goals/GoalsPanel';
import { Fab } from '../components/ui/Fab';
import { getComments } from '../services/posts.service';
import { PageContainer } from '../components/layout/PageContainer';
import { AsidePanel } from '../components/layout/AsidePanel';

export default function WorkoutsPage() {
  const navigate = useNavigate();
  const { data: posts, isLoading } = useFeed();
  const toggleLikeMutation = useToggleLike();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', gap: 1 }}>
      <PageContainer sx={{ mx: 0, maxWidth: 720 }}>
        <WorkoutFeed
          posts={posts ?? []}
          isLoading={isLoading}
          getComments={getComments}
          onLikeToggle={(postId, wasLiked) => toggleLikeMutation.mutate({ postId, isLiked: wasLiked })}
          onCommentAdded={() => {}}
        />
        <Fab onClick={() => navigate('/workouts/new')} />
      </PageContainer>
      <AsidePanel>
        <WeekStats workouts={3} ascents={27} kruscor={94} hours="5ч 25м" />
        <GoalsPanel variant="sidebar" />
        <AchievementsPanel />
      </AsidePanel>
    </Box>
  );
}
