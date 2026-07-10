import { useQuery } from '@tanstack/react-query';
import api from '../api';
import type { PostDto } from '../../types/post';

export function useMyDraft() {
  return useQuery({
    queryKey: ['my-draft'],
    queryFn: () => api.get<PostDto | null>('/posts/my-draft').then((r) => r.data),
    retry: false,
  });
}
