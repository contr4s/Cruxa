import { useQuery } from '@tanstack/react-query';
import { getManagedGym } from '../managedGym.service';

export function useManagedGym() {
  return useQuery({
    queryKey: ['managed-gym'],
    queryFn: getManagedGym,
  });
}
