import type { PostDto, CommentDto, PostDetailDto, FeedSuggestionsDto, PostAscentDto, CreateAscentRequest } from '../types/post';
import type { PaginatedList } from '../types/common';
import {
  mockGetWorkoutFeed, mockGetFeedPosts, mockGetComments, mockToggleLike, mockAddComment,
  mockGetPostById, mockDeletePost, mockCreatePost, mockGetFeedSuggestions, mockGetUserPosts,
} from './mock/posts.mock';
import {
  mockCreateDraftPost, mockUpdatePost, mockAddAscent, mockRemoveAscent,
} from './mock/workouts.mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export async function getFeed(filter?: 'subs' | 'recommended', page = 1, pageSize = 10): Promise<PaginatedList<PostDto>> {
  if (USE_MOCK) return filter ? mockGetFeedPosts(filter, page, pageSize) : mockGetWorkoutFeed(page, pageSize);
  const { default: api } = await import('./api');
  const response = await api.get<PaginatedList<PostDto>>('/posts/feed', { params: { filter, page, pageSize } });
  return response.data;
}

export async function getPostById(postId: string): Promise<PostDetailDto | null> {
  if (USE_MOCK) return mockGetPostById(postId);
  const { default: api } = await import('./api');
  const response = await api.get<PostDetailDto>(`/posts/${postId}`);
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
  if (USE_MOCK) return mockAddComment(postId, text);
  const { default: api } = await import('./api');
  const response = await api.post<CommentDto>(`/posts/${postId}/comments`, { text });
  return response.data;
}

export async function deletePost(postId: string): Promise<void> {
  if (USE_MOCK) return mockDeletePost(postId);
  const { default: api } = await import('./api');
  await api.delete(`/posts/${postId}`);
}

export async function createPost(): Promise<PostDto> {
  if (USE_MOCK) return mockCreatePost();
  const { default: api } = await import('./api');
  const response = await api.post<PostDto>('/posts');
  return response.data;
}

export async function getFeedSuggestions(): Promise<FeedSuggestionsDto> {
  if (USE_MOCK) return mockGetFeedSuggestions();
  const { default: api } = await import('./api');
  const response = await api.get<FeedSuggestionsDto>('/feed/suggestions');
  return response.data;
}

export async function getUserPosts(userId: string, page = 1, pageSize = 10): Promise<PaginatedList<PostDto>> {
  if (USE_MOCK) return mockGetUserPosts(userId, page, pageSize);
  const { default: api } = await import('./api');
  const response = await api.get<PaginatedList<PostDto>>(`/posts/user/${userId}`, { params: { page, pageSize } });
  return response.data;
}

// ── Draft workout ──────────────────────────────────────────

export async function createDraftPost(gymId: string): Promise<PostDto> {
  if (USE_MOCK) return mockCreateDraftPost(gymId);
  const { default: api } = await import('./api');
  const response = await api.post<PostDto>('/posts', { gymId, status: 'draft' });
  return response.data;
}

export async function updatePost(id: string, data: Partial<PostDto> & { status?: string; duration?: number; visibility?: string; body?: string }): Promise<PostDto> {
  if (USE_MOCK) return mockUpdatePost(id, data);
  const { default: api } = await import('./api');
  const response = await api.put<PostDto>(`/posts/${id}`, data);
  return response.data;
}

export async function addAscent(postId: string, data: CreateAscentRequest & { mediaUrls?: string[] }): Promise<PostAscentDto> {
  if (USE_MOCK) return mockAddAscent(postId, data);
  const { default: api } = await import('./api');
  const response = await api.post<PostAscentDto>(`/posts/${postId}/ascents`, data);
  return response.data;
}

export async function removeAscentEndpoint(postId: string, ascentId: string): Promise<void> {
  if (USE_MOCK) return mockRemoveAscent(postId, ascentId);
  const { default: api } = await import('./api');
  await api.delete(`/posts/${postId}/ascents/${ascentId}`);
}
