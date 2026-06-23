import { useQuery } from '@tanstack/react-query';
import { getUserGoals } from '../goals.service';

export function useGoals() {
  return useQuery({
    queryKey: ['goals'],
    queryFn: getUserGoals,
  });
}
