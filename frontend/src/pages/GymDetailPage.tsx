import { useState, useMemo, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Collapse, IconButton, CircularProgress, useTheme } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useGym, useToggleFavorite } from '../services/hooks/useGyms';
import { useInfiniteRoutesByGym } from '../services/hooks/useRoutes';
import { PageContainer } from '../components/layout/PageContainer';
import { StateDisplay } from '../components/ui/StateDisplay';
import { GymInfoBlock } from '../components/gyms/detail/GymInfoBlock';
import { GymPhotoBlock } from '../components/gyms/detail/GymPhotoBlock';
import { GymContactsBlock } from '../components/gyms/detail/GymContactsBlock';
import { GymHoursPricesBlock } from '../components/gyms/detail/GymHoursPricesBlock';
import { GymStats } from '../components/gyms/detail/GymStats';
import { RouteTable } from '../components/routes/RouteTable';
import { RouteFilters, type RouteFilterState } from '../components/routes/RouteFilters';

export default function GymDetailPage() {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const [filters, setFilters] = useState<RouteFilterState>({
    type: 'all',
    holdColor: 'all',
    minGradeIndex: 0,
    maxGradeIndex: 20,
    setterId: 'all',
    sort: 'newest',
  });

  const { data: gym, isLoading: gymLoading, error: gymError } = useGym(id ?? '');
  const {
    data: routesPages,
    isLoading: routesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteRoutesByGym(id ?? '', {
    pageSize: 10,
    ...filters,
  });

  const routes = useMemo(() => routesPages?.pages.flatMap((p) => p.items) ?? [], [routesPages]);

  const toggleFavorite = useToggleFavorite();
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (next: RouteFilterState) => {
    setFilters(next);
  };

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

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          onClick={() => setShowFilters(!showFilters)}
          sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            Трассы
          </Typography>
          <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
            {showFilters ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        <Collapse in={showFilters}>
          <RouteFilters filters={filters} onChange={handleFilterChange} setters={setters} />
        </Collapse>
        {routesLoading && !routesPages ? (
          <StateDisplay type="loading" message="Загрузка трасс…" />
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
