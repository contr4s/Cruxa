import { useQuery } from '@tanstack/react-query';
import { getTags } from '../tags.service';

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
    staleTime: 10 * 60 * 1000, // кэшируем на 10 минут
  });
}
