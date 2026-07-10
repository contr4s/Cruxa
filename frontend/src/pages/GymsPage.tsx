import { useState, useMemo, useRef, useEffect } from 'react';
import { Box, CircularProgress, ToggleButtonGroup, ToggleButton, useTheme } from '@mui/material';
import { FormatListBulleted, Map } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useInfiniteGyms, useToggleFavorite, useCities } from '../services/hooks/useGyms';
import { PageContainer } from '../components/layout/PageContainer';
import { StateDisplay } from '../components/ui/StateDisplay';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { GymCard } from '../components/gyms/GymCard';
import { GymFilters } from '../components/gyms/GymFilters';
import { GymSort } from '../components/gyms/GymSort';
import type { FilterConfig } from '../components/gyms/GymFilters';

export default function GymsPage() {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [city, setCity] = useState('all');
  const [sort, setSort] = useState('rating');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const { data: citiesData } = useCities();
  const cityOptions = useMemo(() => [
    { value: 'all', label: 'Все города' },
    ...(citiesData ?? []).map((c: string) => ({ value: c, label: c })),
  ], [citiesData]);

  const params = useMemo(() => ({ city, sort } as const), [city, sort]);
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
    { key: 'city', label: 'Город', type: 'select', options: cityOptions, value: city, onChange: setCity },
    { key: 'favorites', label: 'Избранное', type: 'chips', options: [{ value: 'all', label: 'Все' }, { value: 'fav', label: 'Избранные' }], value: favoritesOnly ? 'fav' : 'all', onChange: (v) => setFavoritesOnly(v === 'fav') },
  ];

  return (
    <PageContainer sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
          <GymFilters filters={filterConfig} />
          <GymSort sort={sort} onSortChange={setSort} />
        </Box>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, v) => {
            if (v === 'map') { enqueueSnackbar('Карта — скоро', { variant: 'info' }); return; }
            if (v) setViewMode(v);
          }}
          size="small"
          sx={{
            bgcolor: theme.custom?.surface2 ?? 'transparent',
            '& .MuiToggleButton-root': {
              border: `1px solid ${theme.palette.divider}`,
              px: 1.5, py: 0.5,
              fontSize: '0.78rem',
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                bgcolor: theme.palette.primary.main,
                color: '#fff',
                '&:hover': { bgcolor: theme.palette.primary.dark },
              },
            },
          }}
        >
          <ToggleButton value="list"><FormatListBulleted sx={{ fontSize: 16, mr: 0.5 }} /> Список</ToggleButton>
          <ToggleButton value="map"><Map sx={{ fontSize: 16, mr: 0.5 }} /> Карта</ToggleButton>
        </ToggleButtonGroup>
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
