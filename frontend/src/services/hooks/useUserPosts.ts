import { useInfiniteQuery } from '@tanstack/react-query';
import { getUserPosts } from '../posts.service';
import type { PostDto } from '../../types/post';
import type { PaginatedList } from '../../types/common';

export function useUserPosts(userId: string | undefined, pageSize = 10) {
  return useInfiniteQuery<PaginatedList<PostDto>, Error>({
    queryKey: ['user', userId, 'posts'],
    queryFn: ({ pageParam = 1 }) => getUserPosts(userId ?? '', pageParam as number, pageSize),
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
    initialPageParam: 1,
    enabled: !!userId,
  });
}
