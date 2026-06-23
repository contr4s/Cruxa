import { PageContainer } from '../components/layout/PageContainer';
import { useFeed, useToggleLike } from '../services/hooks/useFeed';
import { getComments } from '../services/posts.service';
import { WorkoutFeed } from '../components/workouts/WorkoutFeed';

export default function WorkoutsPage() {
  const { data: posts, isLoading } = useFeed();
  const toggleLikeMutation = useToggleLike();

  const handleLikeToggle = (postId: string, wasLiked: boolean) => {
    toggleLikeMutation.mutate({ postId, isLiked: wasLiked });
  };

  return (
    <PageContainer>
      <WorkoutFeed
        posts={posts ?? []}
        isLoading={isLoading}
        getComments={getComments}
        onLikeToggle={handleLikeToggle}
        onCommentAdded={() => {}}
      />
    </PageContainer>
  );
}
