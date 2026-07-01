import { useQuery } from '@tanstack/react-query';
import {
  getGymAdminStats,
  getAdminRoutes,
  getGymActivity,
  getGymSetters,
} from '../gymAdmin.service';
import type { GetAdminRoutesParams } from '../gymAdmin.service';

export function useGymAdminStats(gymId: string) {
  return useQuery({
    queryKey: ['gymAdmin', gymId, 'stats'],
    queryFn: () => getGymAdminStats(gymId),
    enabled: !!gymId,
  });
}

export function useAdminRoutes(gymId: string, params?: GetAdminRoutesParams) {
  return useQuery({
    queryKey: ['gymAdmin', gymId, 'routes', params],
    queryFn: () => getAdminRoutes(gymId, params),
    enabled: !!gymId,
  });
}

export function useGymActivity(gymId: string) {
  return useQuery({
    queryKey: ['gymAdmin', gymId, 'activity'],
    queryFn: () => getGymActivity(gymId),
    enabled: !!gymId,
  });
}

export function useGymSetters(gymId: string) {
  return useQuery({
    queryKey: ['gymAdmin', gymId, 'setters'],
    queryFn: () => getGymSetters(gymId),
    enabled: !!gymId,
  });
}
