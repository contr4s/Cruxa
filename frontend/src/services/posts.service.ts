import type { PostDto, CommentDto, PostDetailDto, FeedSuggestionsDto } from '../types/post';
import { mockGetWorkoutFeed, mockGetFeedPosts, mockGetComments, mockToggleLike, mockAddComment, mockGetPostById, mockDeletePost, mockCreatePost, mockGetFeedSuggestions } from './mock/posts.mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export async function getFeed(filter?: 'subs' | 'recommended'): Promise<PostDto[]> {
  if (USE_MOCK) return filter ? mockGetFeedPosts(filter) : mockGetWorkoutFeed();
  const { default: api } = await import('./api');
  const response = await api.get<PostDto[]>('/posts/feed', { params: filter ? { filter } : {} });
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
