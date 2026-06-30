import type { GymDto } from '../types/gym';
import type { PaginatedList } from '../types/common';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export interface GetGymsParams {
  city?: string;
  status?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export async function getGyms(params?: GetGymsParams): Promise<PaginatedList<GymDto>> {
  if (USE_MOCK) {
    const { mockGetGyms } = await import('./mock/gyms.mock');
    return mockGetGyms(params);
  }
  const { default: api } = await import('./api');
  const response = await api.get<PaginatedList<GymDto>>('/gyms', { params });
  return response.data;
}

export async function getGymById(id: string): Promise<GymDto | null> {
  if (USE_MOCK) {
    const { mockGetGymById } = await import('./mock/gyms.mock');
    return mockGetGymById(id);
  }
  const { default: api } = await import('./api');
  const response = await api.get<GymDto>(`/gyms/${id}`);
  return response.data;
}

export async function toggleGymFavorite(id: string): Promise<void> {
  if (USE_MOCK) {
    const { mockToggleGymFavorite } = await import('./mock/gyms.mock');
    return mockToggleGymFavorite(id);
  }
  const { default: api } = await import('./api');
  await api.post(`/gyms/${id}/favorite`);
}
