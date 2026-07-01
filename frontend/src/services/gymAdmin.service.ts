import type { GymAdminStats, GymActivity, SetterManagementItem } from '../../types/gymAdmin';
import type { RouteDto } from '../../types/route';
import type { PaginatedList } from '../../types/common';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export interface GetAdminRoutesParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  type?: string;
  holdColor?: string;
  minGradeIndex?: number;
  maxGradeIndex?: number;
  sort?: string;
  status?: string;
  sector?: string;
  setterId?: string;
  minRating?: number;
  maxRating?: number;
  minAscents?: number;
  maxAscents?: number;
  createdWithin?: number;
  tags?: string;
}

export async function getGymAdminStats(gymId: string): Promise<GymAdminStats> {
  if (USE_MOCK) {
    const { mockGetGymAdminStats } = await import('./mock/gymAdmin.mock');
    return mockGetGymAdminStats(gymId);
  }
  const { default: api } = await import('./api');
  const response = await api.get<GymAdminStats>(`/gyms/${gymId}/admin-stats`);
  return response.data;
}

export async function getAdminRoutes(gymId: string, params?: GetAdminRoutesParams): Promise<PaginatedList<RouteDto>> {
  if (USE_MOCK) {
    const { mockGetAdminRoutes } = await import('./mock/gymAdmin.mock');
    return mockGetAdminRoutes(gymId, params);
  }
  const { default: api } = await import('./api');
  const response = await api.get<PaginatedList<RouteDto>>(`/gyms/${gymId}/admin-routes`, { params });
  return response.data;
}

export async function getGymActivity(gymId: string): Promise<GymActivity> {
  if (USE_MOCK) {
    const { mockGetGymActivity } = await import('./mock/gymAdmin.mock');
    return mockGetGymActivity(gymId);
  }
  const { default: api } = await import('./api');
  const response = await api.get<GymActivity>(`/gyms/${gymId}/activity`);
  return response.data;
}

export async function getGymSetters(gymId: string): Promise<SetterManagementItem[]> {
  if (USE_MOCK) {
    const { mockGetGymSetters } = await import('./mock/gymAdmin.mock');
    return mockGetGymSetters(gymId);
  }
  const { default: api } = await import('./api');
  const response = await api.get<SetterManagementItem[]>(`/gyms/${gymId}/setters`);
  return response.data;
}

export async function linkSetter(gymId: string, userId: string): Promise<void> {
  if (USE_MOCK) {
    const { mockLinkSetter } = await import('./mock/gymAdmin.mock');
    return mockLinkSetter(gymId, userId);
  }
  const { default: api } = await import('./api');
  await api.post(`/gyms/${gymId}/setters`, { userId });
}

export async function unlinkSetter(gymId: string, userId: string): Promise<void> {
  if (USE_MOCK) {
    const { mockUnlinkSetter } = await import('./mock/gymAdmin.mock');
    return mockUnlinkSetter(gymId, userId);
  }
  const { default: api } = await import('./api');
  await api.delete(`/gyms/${gymId}/setters/${userId}`);
}

export async function exportGymData(gymId: string, entity: 'routes' | 'ascents' | 'reviews'): Promise<Blob> {
  if (USE_MOCK) {
    const { mockExportGymData } = await import('./mock/gymAdmin.mock');
    return mockExportGymData(gymId, entity);
  }
  const { default: api } = await import('./api');
  const response = await api.get(`/admin/export/${entity}?gymId=${gymId}`, { responseType: 'blob' });
  return response.data;
}
