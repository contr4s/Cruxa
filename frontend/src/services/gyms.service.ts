import api from './api';
import type { GymDto, UpdateGymPayload } from '../types/gym';
import type { PaginatedList } from '../types/common';

export interface GetGymsParams {
  city?: string;
  status?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
  lat?: number;
  lon?: number;
}

export async function getGyms(params?: GetGymsParams): Promise<PaginatedList<GymDto>> {
  const response = await api.get<PaginatedList<GymDto>>('/gyms', { params });
  return response.data;
}

export async function getGymById(id: string): Promise<GymDto | null> {
  const response = await api.get<GymDto>(`/gyms/${id}`);
  return response.data;
}

export async function toggleGymFavorite(id: string): Promise<void> {
  await api.post(`/gyms/${id}/favorite`);
}

export async function createGym(data: Record<string, unknown>): Promise<GymDto> {
  const response = await api.post<GymDto>('/gyms', data);
  return response.data;
}

export async function updateGym(id: string, data: UpdateGymPayload): Promise<GymDto | null> {
  const response = await api.put<GymDto>(`/gyms/${id}`, data);
  return response.data;
}

export async function getCities(): Promise<string[]> {
  const response = await api.get<string[]>('/gyms/cities');
  return response.data;
}
