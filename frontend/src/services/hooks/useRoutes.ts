import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoutesByGym, getRouteById, getRouteConsensus, getRouteReviews, createRoute, updateRoute } from '../routes.service';
import type { GetRoutesParams } from '../routes.service';
import type { CreateRoutePayload, UpdateRoutePayload } from '../../types/route';

export function useRoutesByGym(gymId: string, params?: GetRoutesParams) {
  return useQuery({
    queryKey: ['routes', gymId, params],
    queryFn: () => getRoutesByGym(gymId, params),
    enabled: !!gymId,
  });
}

export function useRoute(id: string) {
  return useQuery({
    queryKey: ['route', id],
    queryFn: () => getRouteById(id),
    enabled: !!id,
  });
}

export function useRouteConsensus(routeId: string) {
  return useQuery({
    queryKey: ['route', routeId, 'consensus'],
    queryFn: () => getRouteConsensus(routeId),
    enabled: !!routeId,
  });
}

export function useRouteReviews(routeId: string) {
  return useQuery({
    queryKey: ['route', routeId, 'reviews'],
    queryFn: () => getRouteReviews(routeId),
    enabled: !!routeId,
  });
}

export function useInfiniteRoutesByGym(gymId: string, params?: Omit<GetRoutesParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: ['routes', gymId, 'infinite', params],
    queryFn: ({ pageParam = 1 }) => getRoutesByGym(gymId, { ...params, page: pageParam, pageSize: params?.pageSize ?? 10 }),
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
    initialPageParam: 1,
    enabled: !!gymId,
  });
}

export function useCreateRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRoutePayload) => createRoute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      queryClient.invalidateQueries({ queryKey: ['gymAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['routesetter'] });
    },
  });
}

export function useUpdateRoute(routeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateRoutePayload) => updateRoute(routeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      queryClient.invalidateQueries({ queryKey: ['route', routeId] });
      queryClient.invalidateQueries({ queryKey: ['gymAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['routesetter'] });
    },
  });
}
