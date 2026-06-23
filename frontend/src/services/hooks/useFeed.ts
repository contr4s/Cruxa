import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFeed, toggleLike, getComments, addComment } from '../posts.service';
import type { PostDto, CommentDto } from '../../types/post';

export function useFeed() {
  return useQuery<PostDto[]>({
    queryKey: ['feed'],
    queryFn: getFeed,
  });
}

export function useComments(postId: string) {
  return useQuery<CommentDto[]>({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId),
    enabled: !!postId,
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, isLiked }: { postId: string; isLiked: boolean }) =>
      toggleLike(postId, isLiked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, text }: { postId: string; text: string }) =>
      addComment(postId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}
