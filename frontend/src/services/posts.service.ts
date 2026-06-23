import type { PostDto, CommentDto } from '../types/post';
import { mockGetWorkoutFeed, mockGetComments, mockToggleLike } from './mock/workouts.mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export async function getFeed(): Promise<PostDto[]> {
  if (USE_MOCK) return mockGetWorkoutFeed();
  const { default: api } = await import('./api');
  const response = await api.get<PostDto[]>('/posts/feed');
  return response.data;
}

export async function getComments(postId: string): Promise<CommentDto[]> {
  if (USE_MOCK) return mockGetComments(postId);
  const { default: api } = await import('./api');
  const response = await api.get<CommentDto[]>(`/posts/${postId}/comments`);
  return response.data;
}

export async function toggleLike(postId: string, isLiked: boolean): Promise<void> {
  if (USE_MOCK) return mockToggleLike(postId, isLiked);
  const { default: api } = await import('./api');
  if (isLiked) {
    await api.delete(`/posts/${postId}/unlike`);
  } else {
    await api.post(`/posts/${postId}/like`);
  }
}

export async function addComment(postId: string, text: string): Promise<CommentDto> {
  if (USE_MOCK) {
    await mockGetComments(postId);
    return {
      id: crypto.randomUUID(),
      postId,
      userId: '550e8400-e29b-41d4-a716-446655440001',
      userName: 'Алексей К.',
      text,
      createdAt: new Date().toISOString(),
    };
  }
  const { default: api } = await import('./api');
  const response = await api.post<CommentDto>(`/posts/${postId}/comments`, { text });
  return response.data;
}
