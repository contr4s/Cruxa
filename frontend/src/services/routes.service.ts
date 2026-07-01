import type { RouteDto, GradeConsensus, RouteReviewDto } from '../types/route';
import type { PaginatedList } from '../types/common';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

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
  if (USE_MOCK) {
    const { mockGetRoutesByGym } = await import('./mock/routes.mock');
    return mockGetRoutesByGym(gymId, params);
  }
  const { default: api } = await import('./api');
  const response = await api.get<PaginatedList<RouteDto>>(`/gyms/${gymId}/routes`, { params });
  return response.data;
}

export async function getRouteById(id: string): Promise<RouteDto | null> {
  if (USE_MOCK) {
    const { mockGetRouteById } = await import('./mock/routes.mock');
    return mockGetRouteById(id);
  }
  const { default: api } = await import('./api');
  const response = await api.get<RouteDto | null>(`/routes/${id}`);
  return response.data;
}

export async function getRouteConsensus(routeId: string): Promise<GradeConsensus | null> {
  if (USE_MOCK) {
    const { mockGetRouteConsensus } = await import('./mock/routes.mock');
    return mockGetRouteConsensus(routeId);
  }
  const { default: api } = await import('./api');
  const response = await api.get<GradeConsensus | null>(`/routes/${routeId}/consensus`);
  return response.data;
}

export async function getRouteReviews(routeId: string): Promise<RouteReviewDto[]> {
  if (USE_MOCK) {
    const { mockGetRouteReviews } = await import('./mock/routes.mock');
    return mockGetRouteReviews(routeId);
  }
  const { default: api } = await import('./api');
  const response = await api.get<RouteReviewDto[]>(`/routes/${routeId}/reviews`);
  return response.data;
}
