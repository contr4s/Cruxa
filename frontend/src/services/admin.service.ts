import api from './api';
import type { AdminDashboardStats, RecentActivityItem, TopGymItem, AdminGymItem, AdminGymFilterState } from '../types/admin';
import type { PaginatedList } from '../types/common';

export async function getAdminStats(): Promise<AdminDashboardStats> {
  const response = await api.get<AdminDashboardStats>('/admin/stats');
  return response.data;
}

export async function getRecentActivity(): Promise<RecentActivityItem[]> {
  const response = await api.get<RecentActivityItem[]>('/admin/recent-activity');
  return response.data;
}

export async function getTopGyms(): Promise<TopGymItem[]> {
  const response = await api.get<TopGymItem[]>('/admin/top-gyms');
  return response.data;
}

export async function getAdminGyms(
  params?: Partial<AdminGymFilterState> & { page?: number; pageSize?: number },
): Promise<PaginatedList<AdminGymItem>> {
  const response = await api.get<PaginatedList<AdminGymItem>>('/admin/gyms', { params });
  return response.data;
}
