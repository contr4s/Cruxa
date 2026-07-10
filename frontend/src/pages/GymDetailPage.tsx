import { useState, useMemo, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, useTheme } from '@mui/material';
import { useGym, useToggleFavorite } from '../services/hooks/useGyms';
import { useInfiniteRoutesByGym } from '../services/hooks/useRoutes';
import { useCreateDraftPost } from '../services/hooks/useDraftPost';
import { PageContainer } from '../components/layout/PageContainer';
import { StateDisplay } from '../components/ui/StateDisplay';
import { SectionHeader } from '../components/ui/SectionHeader';
import { FilterList, ExpandMore, ExpandLess } from '@mui/icons-material';
import { GymInfoBlock } from '../components/gyms/detail/GymInfoBlock';
import { GymPhotoBlock } from '../components/gyms/detail/GymPhotoBlock';
import { GymContactsBlock } from '../components/gyms/detail/GymContactsBlock';
import { GymHoursPricesBlock } from '../components/gyms/detail/GymHoursPricesBlock';
import { GymStats } from '../components/gyms/detail/GymStats';
import { RouteTable } from '../components/routes/RouteTable';
import { RouteFilters, type RouteFiltersValues } from '../components/ui/RouteFilters';
import { useDraftStore } from '../stores/draftWorkoutStore';

export default function GymDetailPage() {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  useDraftStore();
  useCreateDraftPost();
  const [filters, setFilters] = useState<RouteFiltersValues>({
    searchQuery: '',
    type: 'all',
    holdColor: 'all',
    status: 'all',
    sort: 'newest',
    gymId: id ?? '',
    sector: 'all',
    setterId: 'all',
    minGradeIndex: 400,
    maxGradeIndex: 800,
    minRating: 0,
    maxRating: 5,
    minAscents: 0,
    maxAscents: 10000,
    createdWithin: 0,
    tags: '',
  });

  const routeParams = useMemo(() => ({
    pageSize: 10,
    searchQuery: filters.searchQuery || undefined,
    type: filters.type !== 'all' ? filters.type : undefined,
    holdColor: filters.holdColor !== 'all' ? filters.holdColor : undefined,
    minGradeIndex: filters.minGradeIndex > 400 ? filters.minGradeIndex : undefined,
    maxGradeIndex: filters.maxGradeIndex < 800 ? filters.maxGradeIndex : undefined,
    setterId: filters.setterId !== 'all' ? filters.setterId : undefined,
    sort: filters.sort,
    status: filters.status !== 'all' ? filters.status : undefined,
    sector: filters.sector !== 'all' ? filters.sector : undefined,
    minRating: filters.minRating > 0 ? filters.minRating : undefined,
    maxRating: filters.maxRating < 5 ? filters.maxRating : undefined,
    minAscents: filters.minAscents > 0 ? filters.minAscents : undefined,
    maxAscents: filters.maxAscents < 10000 ? filters.maxAscents : undefined,
    createdWithin: filters.createdWithin > 0 ? filters.createdWithin : undefined,
    tags: filters.tags || undefined,
  } as const), [filters.searchQuery, filters.type, filters.holdColor, filters.minGradeIndex, filters.maxGradeIndex, filters.setterId, filters.sort, filters.status, filters.minRating, filters.maxRating, filters.minAscents, filters.maxAscents, filters.createdWithin, filters.tags]);

  const { data: gym, isLoading: gymLoading, error: gymError } = useGym(id ?? '');
  const {
    data: routesPages,
    isLoading: routesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteRoutesByGym(id ?? '', routeParams);

  const routes = useMemo(() => routesPages?.pages.flatMap((p) => p.items) ?? [], [routesPages]);

  const toggleFavorite = useToggleFavorite();

  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, routesPages]);

  const setters = useMemo(() => {
    const map = new Map<string, string>();
    routes.forEach((r) => {
      if (r.setterId) map.set(r.setterId, r.setterName);
    });
    return Array.from(map.entries()).map(([sid, name]) => ({ id: sid, name }));
  }, [routes]);

  const gradeRange = useMemo(() => {
    const pageItems = routesPages?.pages.flatMap((p) => p.items) ?? [];
    if (pageItems.length === 0) return undefined;
    const indices = pageItems.map((r) => r.gradeIndex);
    const min = Math.min(...indices);
    const max = Math.max(...indices);
    const items = routesPages?.pages.flatMap((p) => p.items) ?? [];
    const minR = items.find((r) => r.gradeIndex === min);
    const maxR = items.find((r) => r.gradeIndex === max);
    return `${minR?.grade ?? min}–${maxR?.grade ?? max}`;
  }, [routesPages]);

  if (gymLoading) {
    return (
      <PageContainer>
        <StateDisplay type="loading" message="Загрузка зала…" />
      </PageContainer>
    );
  }

  if (gymError || !gym) {
    console.error('[GymDetail] Failed to load gym:', id, gymError);
    return (
      <PageContainer>
        <StateDisplay
          type="error"
          message="Не удалось загрузить зал"
          description={gymError instanceof Error ? gymError.message : 'Проверьте соединение и попробуйте снова.'}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Mobile: info above photo */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 1.5 }}>
        <GymInfoBlock gym={gym} onFavoriteToggle={() => toggleFavorite.mutate({ gymId: gym.id })} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2.5 }}>
        <GymPhotoBlock gym={gym} />
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <GymInfoBlock gym={gym} onFavoriteToggle={() => toggleFavorite.mutate({ gymId: gym.id })} />
          </Box>
          <GymContactsBlock gym={gym} />
          <GymHoursPricesBlock prices={gym.prices} hours={gym.hours} />
        </Box>
      </Box>

      <GymStats
        activeRoutes={gym.activeRouteCount}
        avgRating={gym.rating}
        gradeRange={gradeRange}
      />

      {/* DraftFab is in ProtectedLayout */}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <RouteFilters
          filters={filters}
          onChange={setFilters}
          slots={{ setters }}
          filterTrigger={({ open, toggle, activeCount }) => (
            <SectionHeader
              icon={<FilterList sx={{ fontSize: 20 }} />}
              title="Трассы"
              action={
                <Box onClick={toggle} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', color: theme.palette.text.secondary, '&:hover': { color: theme.palette.text.primary } }}>
                  <FilterList sx={{ fontSize: 18 }} />
                  {activeCount > 0 && (
                    <Box sx={{ background: theme.palette.primary.main, color: '#fff', borderRadius: '10px', px: 0.75, py: 0.1, fontSize: '0.65rem', fontWeight: 700 }}>{activeCount}</Box>
                  )}
                  {open ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
                </Box>
              }
            />
          )}
        />
        {routesLoading && !routesPages ? (
          <StateDisplay type="loading" message="Загрузка трасс…" />
        ) : routes.length === 0 ? (
          <StateDisplay type="empty" message="Нет трасс" description="Попробуйте изменить фильтры" />
        ) : (
          <RouteTable routes={routes} />
        )}
        {isFetchingNextPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        <div ref={sentinelRef} />
      </Box>
    </PageContainer>
  );
}
