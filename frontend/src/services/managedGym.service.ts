import api from './api';

export interface ManagedGymResponse {
  gymId: string;
}

export async function getManagedGym(): Promise<ManagedGymResponse> {
  const response = await api.get<ManagedGymResponse>('/users/me/managed-gym');
  return response.data;
}
