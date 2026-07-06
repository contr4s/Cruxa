import api from './api';
import type { RoutesetterStats, RouteReviewSummary, LinkedGymSummary } from '../types/routesetter';
import type { RouteDto } from '../types/route';
import type { PaginatedList } from '../types/common';

export interface GetSetterRoutesParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  type?: string;
  holdColor?: string;
  minGradeIndex?: number;
  maxGradeIndex?: number;
  sort?: string;
  status?: string;
  gymId?: string;
  minRating?: number;
  maxRating?: number;
  minAscents?: number;
  maxAscents?: number;
  createdWithin?: number;
  tags?: string;
}

export async function getRoutesetterStats(): Promise<RoutesetterStats> {
  const response = await api.get<RoutesetterStats>('/routesetters/me/stats');
  return response.data;
}

export async function getSetterRoutes(params?: GetSetterRoutesParams): Promise<PaginatedList<RouteDto>> {
  const response = await api.get<PaginatedList<RouteDto>>('/routesetters/me/routes', { params });
  return response.data;
}

export async function getSetterReviews(): Promise<RouteReviewSummary[]> {
  const response = await api.get<RouteReviewSummary[]>('/routesetters/me/reviews');
  return response.data;
}

export async function getLinkedGyms(): Promise<LinkedGymSummary[]> {
  const response = await api.get<LinkedGymSummary[]>('/routesetters/me/gyms');
  return response.data;
}

export async function archiveRoute(routeId: string): Promise<void> {
  await api.patch(`/routes/${routeId}/deactivate`);
}

export async function restoreRoute(routeId: string): Promise<void> {
  await api.patch(`/routes/${routeId}/reactivate`);
}
