import type { AdminDashboardStats, RecentActivityItem, TopGymItem, AdminGymFilterState } from '../../types/admin';
import type { PaginatedList } from '../../types/common';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export async function getAdminStats(): Promise<AdminDashboardStats> {
  if (USE_MOCK) {
    const { mockGetAdminStats } = await import('./mock/admin.mock');
    return mockGetAdminStats();
  }
  const { default: api } = await import('./api');
  const response = await api.get<AdminDashboardStats>('/api/admin/stats');
  return response.data;
}

export async function getRecentActivity(): Promise<RecentActivityItem[]> {
  if (USE_MOCK) {
    const { mockGetRecentActivity } = await import('./mock/admin.mock');
    return mockGetRecentActivity();
  }
  const { default: api } = await import('./api');
  const response = await api.get<RecentActivityItem[]>('/api/admin/recent-activity');
  return response.data;
}

export async function getTopGyms(): Promise<TopGymItem[]> {
  if (USE_MOCK) {
    const { mockGetTopGyms } = await import('./mock/admin.mock');
    return mockGetTopGyms();
  }
  const { default: api } = await import('./api');
  const response = await api.get<TopGymItem[]>('/api/admin/top-gyms');
  return response.data;
}

export async function getAdminGyms(
  params?: Partial<AdminGymFilterState> & { page?: number; pageSize?: number },
): Promise<PaginatedList<import('../../types/admin').AdminGymItem>> {
  if (USE_MOCK) {
    const { mockGetAdminGyms } = await import('./mock/admin.mock');
    return mockGetAdminGyms(params);
  }
  const { default: api } = await import('./api');
  const response = await api.get<PaginatedList<import('../../types/admin').AdminGymItem>>('/api/admin/gyms', { params });
  return response.data;
}
