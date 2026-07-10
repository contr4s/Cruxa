import { useQuery } from '@tanstack/react-query';
import { getGradingSystems, getGradingSystemById } from '../gradingSystems.service';

export function useGradingSystems() {
  return useQuery({
    queryKey: ['gradingSystems'],
    queryFn: getGradingSystems,
  });
}

export function useGradingSystem(id: string) {
  return useQuery({
    queryKey: ['gradingSystem', id],
    queryFn: () => getGradingSystemById(id),
    enabled: !!id,
  });
}
