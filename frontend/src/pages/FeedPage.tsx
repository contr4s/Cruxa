import { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFeed, useToggleLike, useFeedSuggestions } from '../services/hooks/useFeed';
import { WorkoutFeed } from '../components/workouts/WorkoutFeed';
import { FeedToggle } from '../components/feed/FeedToggle';
import { FeedUserSuggestions } from '../components/feed/FeedUserSuggestions';
import { FeedRouteRecommendations } from '../components/feed/FeedRouteRecommendations';
import { FeedGymRecommendations } from '../components/feed/FeedGymRecommendations';
import { Fab } from '../components/ui/Fab';
import { getComments } from '../services/posts.service';
import { PageContainer } from '../components/layout/PageContainer';
import { AsidePanel } from '../components/layout/AsidePanel';

export default function FeedPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'subs' | 'recommended'>('subs');
  const { data: posts, isLoading } = useFeed(filter);
  const toggleLikeMutation = useToggleLike();
  const { data: suggestions } = useFeedSuggestions();

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
            posts={posts ?? []}
            isLoading={isLoading}
            defaultTab={0}
            emptyStateMessage="В ленте пока пусто. Подпишитесь на других скалолазов!"
            getComments={getComments}
            onLikeToggle={(postId, wasLiked) => toggleLikeMutation.mutate({ postId, isLiked: wasLiked })}
            onCommentAdded={() => {}}
          />
        </Box>
        <Fab onClick={() => navigate('/workouts/new')} />
      </PageContainer>
      <AsidePanel sx={{ width: 300 }}>
        <FeedUserSuggestions users={suggestions?.users ?? []} />
        <FeedGymRecommendations gyms={suggestions?.gyms ?? []} />
        <FeedRouteRecommendations routes={suggestions?.routes ?? []} />
      </AsidePanel>
    </Box>
  );
}
