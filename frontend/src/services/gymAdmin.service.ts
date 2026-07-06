import api from './api';
import type { GymAdminStats, GymActivity, SetterManagementItem } from '../types/gymAdmin';
import type { RouteDto } from '../types/route';
import type { PaginatedList } from '../types/common';

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
  const response = await api.get<GymAdminStats>(`/gyms/${gymId}/admin-stats`);
  return response.data;
}

export async function getAdminRoutes(gymId: string, params?: GetAdminRoutesParams): Promise<PaginatedList<RouteDto>> {
  const response = await api.get<PaginatedList<RouteDto>>(`/gyms/${gymId}/admin-routes`, { params });
  return response.data;
}

export async function getGymActivity(gymId: string): Promise<GymActivity> {
  const response = await api.get<GymActivity>(`/gyms/${gymId}/activity`);
  return response.data;
}

export async function getGymSetters(gymId: string): Promise<SetterManagementItem[]> {
  const response = await api.get<SetterManagementItem[]>(`/gyms/${gymId}/setters`);
  return response.data;
}

export async function linkSetter(gymId: string, userId: string): Promise<void> {
  await api.post(`/gyms/${gymId}/setters`, { userId });
}

export async function unlinkSetter(gymId: string, userId: string): Promise<void> {
  await api.delete(`/gyms/${gymId}/setters/${userId}`);
}

export async function exportGymData(gymId: string, entity: 'routes' | 'ascents' | 'reviews'): Promise<Blob> {
  const response = await api.get(`/admin/export/${entity}?gymId=${gymId}`, { responseType: 'blob' });
  return response.data;
}
