import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDraftPost, updatePost, addAscent, removeAscentEndpoint } from '../posts.service';
import type { CreateAscentRequest } from '../../types/post';

export function useCreateDraftPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gymId: string) => createDraftPost(gymId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useUpdatePost(postId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => updatePost(postId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useAddAscent(postId: string | null) {
  return useMutation({
    mutationFn: (data: CreateAscentRequest & { mediaUrls?: string[] }) =>
      addAscent(postId!, data),
  });
}

export function useRemoveAscent(postId: string | null) {
  return useMutation({
    mutationFn: (ascentId: string) => removeAscentEndpoint(postId!, ascentId),
  });
}
