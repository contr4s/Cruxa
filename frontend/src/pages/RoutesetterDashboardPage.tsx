import { useState, useMemo, useCallback, useRef } from 'react';
import { Box, Typography, Fab, Button, useTheme } from '@mui/material';
import { Construction, Route, Reviews, LocationOn, FilterList, QrCodeScanner, Add } from '@mui/icons-material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StateDisplay } from '../components/ui/StateDisplay';
import { Pagination } from '../components/ui/Pagination';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useSelectableRows } from '../hooks/useSelectableRows';
import { QrPdfDialog } from '../components/routes/QrPdfDialog';
import { generateQrPdfBlob, downloadBlob } from '../utils/generateQrPdf';
import {
  useRoutesetterStats,
  useSetterRoutes,
  useSetterReviews,
  useLinkedGyms,
} from '../services/hooks/useRoutesetter';
import { archiveRoute, restoreRoute } from '../services/routesetter.service';
import type { SetterRouteFilterState } from '../types/routesetter';
import type { RouteDto } from '../types/route';
import { RoutesetterStats } from '../components/routesetter/RoutesetterStats';
import { QuickOverview } from '../components/routesetter/QuickOverview';
import { SetterRouteTable } from '../components/routesetter/SetterRouteTable';
import { SetterRouteFilters } from '../components/routesetter/SetterRouteFilters';
import { RouteReviewsList } from '../components/routesetter/RouteReviewsList';
import { ReviewsSummary } from '../components/routesetter/ReviewsSummary';
import { LinkedGyms } from '../components/routesetter/LinkedGyms';
import { RouteFormModal } from '../components/routes/RouteFormModal';

const DEFAULT_FILTERS: SetterRouteFilterState = {
  searchQuery: '',
  type: 'all',
  holdColor: 'all',
  minGradeIndex: 0,
  maxGradeIndex: 20,
  sort: 'newest',
  status: 'all',
  gymId: 'all',
  minRating: 0,
  maxRating: 5,
  minAscents: 0,
  maxAscents: 10000,
  createdWithin: 0,
  tags: '',
};

export default function RoutesetterDashboardPage() {
  const theme = useTheme();
  useScrollReveal();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<SetterRouteFilterState>(DEFAULT_FILTERS);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [routeFormOpen, setRouteFormOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteDto | undefined>();

  const { selectedIds, setSelected } = useSelectableRows();
  const selectedRoutesRef = useRef<RouteDto[]>([]);
  const prevSelectedJson = useRef('');

  const { data: stats, isLoading: statsLoading } = useRoutesetterStats();
  const { data: routesData, isLoading: routesLoading } = useSetterRoutes({ ...filters, page, pageSize: 10 });
  const { data: reviews, isLoading: reviewsLoading } = useSetterReviews();
  const { data: gyms, isLoading: gymsLoading } = useLinkedGyms();

  // keep selected route objects in sync across pages
  useMemo(() => {
    const json = JSON.stringify([...selectedIds].sort());
    if (json === prevSelectedJson.current) return;
    prevSelectedJson.current = json;
    const seen = new Map<string, RouteDto>();
    for (const r of selectedRoutesRef.current) {
      if (selectedIds.has(r.id)) seen.set(r.id, r);
    }
    for (const r of routesData?.items ?? []) {
      if (selectedIds.has(r.id)) seen.set(r.id, r);
    }
    selectedRoutesRef.current = [...seen.values()];
  }, [selectedIds, routesData]);

  const overview = useMemo(() => {
    const allRoutes: RouteDto[] = routesData?.items ?? [];
    const active = allRoutes.filter((r: RouteDto) => r.status === 'Active');
    const mostPopular = active.length
      ? active.reduce((max: RouteDto, r: RouteDto) => (r.ascentsCount > max.ascentsCount ? r : max), active[0])
      : null;
    const highestRated = active.length
      ? active.reduce((max: RouteDto, r: RouteDto) => (r.rating > max.rating ? r : max), active[0])
      : null;
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const newThisWeek = active.filter((r: RouteDto) => new Date(r.createdAt).getTime() > weekAgo).length;
    return {
      mostPopularRoute: mostPopular
        ? { id: mostPopular.id, name: mostPopular.name, grade: mostPopular.grade, ascentsCount: mostPopular.ascentsCount }
        : null,
      highestRatedRoute: highestRated
        ? { id: highestRated.id, name: highestRated.name, grade: highestRated.grade, rating: highestRated.rating }
        : null,
      newThisWeek,
    };
  }, [routesData]);

  const handleArchive = async (route: RouteDto) => {
    await archiveRoute(route.id);
    window.location.reload();
  };

  const handleRestore = async (route: RouteDto) => {
    await restoreRoute(route.id);
    window.location.reload();
  };

  const gymOptions = useMemo(() => (gyms ?? []).map((g) => ({ id: g.id, name: g.name })), [gyms]);

  const handleQrConfirm = useCallback(async (qrPerPage: number, baseUrl: string) => {
    setQrDialogOpen(false);
    const routes = selectedRoutesRef.current.filter((r) => selectedIds.has(r.id));
    if (routes.length === 0) return;
    try {
      const blob = await generateQrPdfBlob(routes, qrPerPage, baseUrl);
      downloadBlob(blob, 'qrcodes.pdf');
    } catch {
      alert('Ошибка при генерации PDF');
    }
  }, [selectedIds]);

  const handleEditRoute = useCallback((route: RouteDto) => {
    setEditingRoute(route);
    setRouteFormOpen(true);
  }, []);

  const handleCloseRouteForm = useCallback(() => {
    setRouteFormOpen(false);
    setEditingRoute(undefined);
  }, []);

  return (
    <PageContainer>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '1.35rem', fontWeight: 800, color: theme.palette.text.primary }}>
            Дашборд рутсеттера
          </Typography>
          <Button variant="contained" size="small" startIcon={<Add />} onClick={() => setRouteFormOpen(true)} sx={{ fontSize: '0.82rem' }}>
            Новая трасса
          </Button>
        </Box>

        {statsLoading || !stats ? (
          <StateDisplay type="loading" message="Загрузка статистики…" />
        ) : (
          <RoutesetterStats stats={stats} />
        )}

        <Box>
          <SectionHeader icon={<Construction sx={{ fontSize: 20, color: theme.palette.primary.main }} />} title="Быстрый обзор" />
          {routesLoading ? (
            <StateDisplay type="loading" message="Загрузка…" size="sm" />
          ) : (
            <QuickOverview overview={overview} />
          )}
        </Box>

        <Box>
          <SetterRouteFilters
            filters={filters}
            onChange={setFilters}
            gyms={gymOptions}
            filterTrigger={({ open, toggle, activeCount }) => (
              <SectionHeader
                icon={<Route sx={{ fontSize: 20, color: theme.palette.primary.main }} />}
                title="Мои трассы"
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
          {routesLoading ? (
            <StateDisplay type="loading" message="Загрузка трасс…" />
          ) : (
            <>
              {selectedIds.size > 0 && (
                <Fab
                  variant="extended"
                  color="primary"
                  size="medium"
                  sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1200 }}
                  onClick={() => setQrDialogOpen(true)}
                >
                  <QrCodeScanner sx={{ mr: 1 }} />
                  PDF QR ({selectedIds.size})
                </Fab>
              )}
              <SetterRouteTable
                routes={routesData?.items ?? []}
                selectable
                selectedIds={selectedIds}
                onSelectionChange={setSelected}
                onEdit={handleEditRoute}
                onArchive={handleArchive}
                onRestore={handleRestore}
              />
              <QrPdfDialog
                open={qrDialogOpen}
                routes={selectedRoutesRef.current.filter((r) => selectedIds.has(r.id))}
                onClose={() => setQrDialogOpen(false)}
                onConfirm={handleQrConfirm}
              />
              {routesData && routesData.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Pagination page={page} count={routesData.totalPages} onChange={(_, v) => setPage(v)} />
                </Box>
              )}
            </>
          )}
        </Box>

        <Box>
          <SectionHeader icon={<Reviews sx={{ fontSize: 20, color: theme.palette.primary.main }} />} title="Отзывы на мои трассы" />
          {reviewsLoading ? (
            <StateDisplay type="loading" message="Загрузка отзывов…" />
          ) : (
            <>
              {reviews && <ReviewsSummary reviews={reviews} />}
              <Box sx={{ mt: 2 }}>
                <RouteReviewsList reviews={reviews ?? []} />
              </Box>
            </>
          )}
        </Box>

        <Box>
          <SectionHeader icon={<LocationOn sx={{ fontSize: 20, color: theme.palette.primary.main }} />} title="Привязанные залы" />
          {gymsLoading ? (
            <StateDisplay type="loading" message="Загрузка залов…" />
          ) : (
            <LinkedGyms gyms={gyms ?? []} />
          )}
        </Box>
      </Box>

      {routeFormOpen && (
        <RouteFormModal
          open={routeFormOpen}
          route={editingRoute}
          gymId={editingRoute?.gymId}
          gymOptions={editingRoute ? undefined : gymOptions}
          onClose={handleCloseRouteForm}
        />
      )}
    </PageContainer>
  );
}
