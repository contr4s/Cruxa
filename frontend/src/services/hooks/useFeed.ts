import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFeed, toggleLike, getComments, addComment, getPostById, deletePost, createPost, getFeedSuggestions } from '../posts.service';
import type { PostDto, CommentDto, PostDetailDto, FeedFilter, FeedSuggestionsDto } from '../../types/post';

export function useFeed(filter?: FeedFilter) {
  return useInfiniteQuery({
    queryKey: ['feed', filter],
    queryFn: ({ pageParam = 1 }) => getFeed(filter, pageParam, 10),
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
    initialPageParam: 1,
  });
}

export function usePost(postId: string) {
  return useQuery<PostDetailDto | null>({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
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

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => createPost(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useFeedSuggestions() {
  return useQuery<FeedSuggestionsDto>({
    queryKey: ['feedSuggestions'],
    queryFn: getFeedSuggestions,
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
