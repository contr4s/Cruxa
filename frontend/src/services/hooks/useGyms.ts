import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGyms, getGymById, getCities, toggleGymFavorite, updateGym } from '../gyms.service';
import type { GetGymsParams } from '../gyms.service';
import type { GymDto } from '../../types/gym';
import type { UpdateGymPayload } from '../../types/gym';

export function useGyms(params?: GetGymsParams) {
  return useQuery({
    queryKey: ['gyms', params],
    queryFn: () => getGyms(params),
  });
}

export function useInfiniteGyms(params?: Omit<GetGymsParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: ['gyms', 'infinite', params],
    queryFn: ({ pageParam = 1 }) => getGyms({ ...params, page: pageParam, pageSize: params?.pageSize ?? 10 }),
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
    initialPageParam: 1,
  });
}

export function useCities() {
  return useQuery({
    queryKey: ['gyms', 'cities'],
    queryFn: getCities,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGym(id: string) {
  return useQuery<GymDto | null>({
    queryKey: ['gym', id],
    queryFn: () => getGymById(id),
    enabled: !!id,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ gymId }: { gymId: string }) => toggleGymFavorite(gymId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gyms'] });
      queryClient.invalidateQueries({ queryKey: ['gym'] });
    },
  });
}

import { createGym } from '../gyms.service';

export function useCreateGym() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createGym(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      queryClient.invalidateQueries({ queryKey: ['gyms'] });
    },
  });
}

export function useUpdateGym(gymId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateGymPayload) => updateGym(gymId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gym', gymId] });
      queryClient.invalidateQueries({ queryKey: ['gyms'] });
    },
  });
}
