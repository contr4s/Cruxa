import { useQuery } from '@tanstack/react-query';
import { getAdminStats, getRecentActivity, getTopGyms, getAdminGyms } from '../admin.service';
import type { AdminGymFilterState } from '../../types/admin';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: getAdminStats,
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ['admin', 'recent-activity'],
    queryFn: getRecentActivity,
  });
}

export function useTopGyms() {
  return useQuery({
    queryKey: ['admin', 'top-gyms'],
    queryFn: getTopGyms,
  });
}

export function useAdminGyms(
  params?: Partial<AdminGymFilterState> & { page?: number; pageSize?: number },
) {
  return useQuery({
    queryKey: ['admin', 'gyms', params],
    queryFn: () => getAdminGyms(params),
  });
}
