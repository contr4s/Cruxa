const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export interface ManagedGymResponse {
  gymId: string;
}

export async function getManagedGym(): Promise<ManagedGymResponse> {
  if (USE_MOCK) {
    const { mockGetManagedGym } = await import('./mock/managedGym.mock');
    return mockGetManagedGym();
  }
  const { default: api } = await import('./api');
  const response = await api.get<ManagedGymResponse>('/users/me/managed-gym');
  return response.data;
}
