import { useQuery } from '@tanstack/react-query';
import {
  getRoutesetterStats,
  getSetterRoutes,
  getSetterReviews,
  getLinkedGyms,
} from '../routesetter.service';
import type { GetSetterRoutesParams } from '../routesetter.service';

export function useRoutesetterStats() {
  return useQuery({
    queryKey: ['routesetter', 'stats'],
    queryFn: () => getRoutesetterStats(),
  });
}

export function useSetterRoutes(params?: GetSetterRoutesParams) {
  return useQuery({
    queryKey: ['routesetter', 'routes', params],
    queryFn: () => getSetterRoutes(params),
  });
}

export function useSetterReviews() {
  return useQuery({
    queryKey: ['routesetter', 'reviews'],
    queryFn: () => getSetterReviews(),
  });
}

export function useLinkedGyms() {
  return useQuery({
    queryKey: ['routesetter', 'gyms'],
    queryFn: () => getLinkedGyms(),
  });
}
