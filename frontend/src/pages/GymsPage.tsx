import { useState, useMemo, useRef, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useInfiniteGyms, useToggleFavorite } from '../services/hooks/useGyms';
import { PageContainer } from '../components/layout/PageContainer';
import { StateDisplay } from '../components/ui/StateDisplay';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { GymCard } from '../components/gyms/GymCard';
import { GymFilters } from '../components/gyms/GymFilters';
import { GymSort } from '../components/gyms/GymSort';
import type { FilterConfig } from '../components/gyms/GymFilters';

const CITIES = [
  { value: 'all', label: 'Все города' },
  { value: 'Москва', label: 'Москва' },
  { value: 'Санкт-Петербург', label: 'Санкт-Петербург' },
];

export default function GymsPage() {
  const [city, setCity] = useState('all');
  const [sort, setSort] = useState('rating');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const params = { city, sort } as const;
  const {
    data: pages,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteGyms(params);
  const allGyms = useMemo(() => pages?.pages.flatMap((p) => p.items) ?? [], [pages]);
  const gyms = useMemo(() => favoritesOnly ? allGyms.filter((g) => g.isFavorite) : allGyms, [allGyms, favoritesOnly]);

  const toggleFavorite = useToggleFavorite();

  const handleFavorite = (id: string) => {
    toggleFavorite.mutate({ gymId: id });
  };

  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, pages]);

  const filterConfig: FilterConfig[] = [
    { key: 'city', label: 'Город', type: 'select', options: CITIES, value: city, onChange: setCity },
    { key: 'favorites', label: 'Избранное', type: 'chips', options: [{ value: 'all', label: 'Все' }, { value: 'fav', label: 'Избранные' }], value: favoritesOnly ? 'fav' : 'all', onChange: (v) => setFavoritesOnly(v === 'fav') },
  ];

  return (
    <PageContainer sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        <GymFilters filters={filterConfig} />
        <GymSort sort={sort} onSortChange={setSort} />
      </Box>

      {isLoading && (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} count={1} height={260} />
          ))}
        </Box>
      )}

      {error && (
        <StateDisplay
          type="error"
          message="Ошибка загрузки"
          description={error instanceof Error ? error.message : 'Не удалось загрузить список залов'}
        />
      )}

      {!isLoading && !error && gyms.length === 0 && (
        <StateDisplay
          type="empty"
          message="Нет залов"
          description="Попробуйте изменить фильтры"
        />
      )}

      {!isLoading && !error && gyms.length > 0 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
          {gyms.map((gym) => (
            <GymCard key={gym.id} gym={gym} onFavoriteToggle={handleFavorite} />
          ))}
        </Box>
      )}

      {isFetchingNextPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      <div ref={sentinelRef} />
    </PageContainer>
  );
}
