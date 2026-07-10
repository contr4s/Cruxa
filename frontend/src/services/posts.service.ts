import api from './api';
import type { PostDto, CommentDto, PostDetailDto, FeedSuggestionsDto, PostAscentDto, CreateAscentRequest } from '../types/post';
import type { PaginatedList } from '../types/common';

export async function getFeed(filter?: 'subs' | 'recommended', page = 1, pageSize = 10): Promise<PaginatedList<PostDto>> {
  const response = await api.get<PaginatedList<PostDto>>('/posts/feed', { params: { filter, page, pageSize } });
  return response.data;
}

export async function getPostById(postId: string): Promise<PostDetailDto | null> {
  const response = await api.get<PostDetailDto>(`/posts/${postId}`);
  return response.data;
}

export async function getComments(postId: string): Promise<PaginatedList<CommentDto>> {
  const response = await api.get<PaginatedList<CommentDto>>(`/posts/${postId}/comments`);
  return response.data;
}

export async function toggleLike(postId: string, isLiked: boolean): Promise<void> {
  if (isLiked) {
    await api.delete(`/posts/${postId}/unlike`);
  } else {
    await api.post(`/posts/${postId}/like`);
  }
}

export async function addComment(postId: string, text: string): Promise<CommentDto> {
  const response = await api.post<CommentDto>(`/posts/${postId}/comments`, { text });
  return response.data;
}

export async function deletePost(postId: string): Promise<void> {
  await api.delete(`/posts/${postId}`);
}

export async function createPost(): Promise<PostDto> {
  const response = await api.post<PostDto>('/posts');
  return response.data;
}

export async function getFeedSuggestions(): Promise<FeedSuggestionsDto> {
  const response = await api.get<FeedSuggestionsDto>('/feed/suggestions');
  return response.data;
}

export async function getUserPosts(userId: string, page = 1, pageSize = 10): Promise<PaginatedList<PostDto>> {
  const response = await api.get<PaginatedList<PostDto>>(`/posts/user/${userId}`, { params: { page, pageSize } });
  return response.data;
}

// ── Draft workout ──────────────────────────────────────────

export async function createDraftPost(gymId: string): Promise<PostDto> {
  const response = await api.post<PostDto>('/posts', { gymId, status: 'draft' });
  return response.data;
}

export async function updatePost(id: string, data: Partial<PostDto> & { status?: string; duration?: number; visibility?: string; body?: string }): Promise<PostDto> {
  const response = await api.put<PostDto>(`/posts/${id}`, data);
  return response.data;
}

export async function addAscent(postId: string, data: CreateAscentRequest & { mediaUrls?: string[] }): Promise<PostAscentDto> {
  const response = await api.post<PostAscentDto>(`/posts/${postId}/ascents`, data);
  return response.data;
}

export async function removeAscentEndpoint(postId: string, ascentId: string): Promise<void> {
  await api.delete(`/posts/${postId}/ascents/${ascentId}`);
}

export async function publishPost(id: string, selectedMediaUrls?: string[]): Promise<void> {
  await api.put(`/posts/${id}/publish`, selectedMediaUrls ? { selectedMediaUrls } : {});
}
