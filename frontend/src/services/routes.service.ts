import api from './api';
import type { RouteDto, GradeConsensus, RouteReviewDto, CreateRoutePayload, UpdateRoutePayload } from '../types/route';
import type { PaginatedList } from '../types/common';

export interface GetRoutesParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  type?: string;
  holdColor?: string;
  minGradeIndex?: number;
  maxGradeIndex?: number;
  setterId?: string;
  sort?: string;
  status?: string;
  minRating?: number;
  maxRating?: number;
  minAscents?: number;
  maxAscents?: number;
  createdWithin?: number;
  tags?: string;
}

export async function getRoutesByGym(gymId: string, params?: GetRoutesParams): Promise<PaginatedList<RouteDto>> {
  const response = await api.get<PaginatedList<RouteDto>>(`/routes/gym/${gymId}`, { params });
  return response.data;
}

export async function getRouteById(id: string): Promise<RouteDto | null> {
  const response = await api.get<RouteDto | null>(`/routes/${id}`);
  return response.data;
}

export async function getRouteConsensus(routeId: string): Promise<GradeConsensus | null> {
  const response = await api.get<GradeConsensus | null>(`/routes/${routeId}/consensus`);
  return response.data;
}

export interface SaveRouteFeedbackBody {
  rating?: number;
  publicReview?: string;
  privateNote?: string;
  gradeIndex?: number;
}

export async function saveRouteFeedback(routeId: string, body: SaveRouteFeedbackBody): Promise<void> {
  await api.put(`/routes/${routeId}/feedback`, body);
}

export async function getRouteReviews(routeId: string): Promise<PaginatedList<RouteReviewDto>> {
  const response = await api.get<PaginatedList<RouteReviewDto>>(`/routes/${routeId}/reviews`);
  return response.data;
}

export async function saveRouteNote(routeId: string, note: string): Promise<void> {
  await api.put(`/routes/${routeId}/notes`, { note });
}

export async function createRoute(data: CreateRoutePayload): Promise<RouteDto> {
  const response = await api.post<RouteDto>('/routes', data);
  return response.data;
}

export async function updateRoute(id: string, data: UpdateRoutePayload): Promise<RouteDto | null> {
  const response = await api.put<RouteDto>(`/routes/${id}`, data);
  return response.data;
}
