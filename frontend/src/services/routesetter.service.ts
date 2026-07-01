import type { RoutesetterStats, QuickOverview, RouteReviewSummary, LinkedGymSummary } from '../../types/routesetter';
import type { RouteDto } from '../../types/route';
import type { PaginatedList } from '../../types/common';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

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
  if (USE_MOCK) {
    const { mockGetRoutesetterStats } = await import('./mock/routesetter.mock');
    return mockGetRoutesetterStats();
  }
  const { default: api } = await import('./api');
  const response = await api.get<RoutesetterStats>('/routesetters/me/stats');
  return response.data;
}

export async function getSetterRoutes(params?: GetSetterRoutesParams): Promise<PaginatedList<RouteDto>> {
  if (USE_MOCK) {
    const { mockGetSetterRoutes } = await import('./mock/routesetter.mock');
    return mockGetSetterRoutes(params);
  }
  const { default: api } = await import('./api');
  const response = await api.get<PaginatedList<RouteDto>>('/routesetters/me/routes', { params });
  return response.data;
}

export async function getSetterReviews(): Promise<RouteReviewSummary[]> {
  if (USE_MOCK) {
    const { mockGetSetterReviews } = await import('./mock/routesetter.mock');
    return mockGetSetterReviews();
  }
  const { default: api } = await import('./api');
  const response = await api.get<RouteReviewSummary[]>('/routesetters/me/reviews');
  return response.data;
}

export async function getLinkedGyms(): Promise<LinkedGymSummary[]> {
  if (USE_MOCK) {
    const { mockGetLinkedGyms } = await import('./mock/routesetter.mock');
    return mockGetLinkedGyms();
  }
  const { default: api } = await import('./api');
  const response = await api.get<LinkedGymSummary[]>('/routesetters/me/gyms');
  return response.data;
}

export async function archiveRoute(routeId: string): Promise<void> {
  if (USE_MOCK) {
    const { mockArchiveRoute } = await import('./mock/routesetter.mock');
    return mockArchiveRoute(routeId);
  }
  const { default: api } = await import('./api');
  await api.patch(`/routes/${routeId}/deactivate`);
}

export async function restoreRoute(routeId: string): Promise<void> {
  if (USE_MOCK) {
    const { mockRestoreRoute } = await import('./mock/routesetter.mock');
    return mockRestoreRoute(routeId);
  }
  const { default: api } = await import('./api');
  await api.patch(`/routes/${routeId}/reactivate`);
}
