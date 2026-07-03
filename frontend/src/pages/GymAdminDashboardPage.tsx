import { useState, useMemo, useCallback, useRef } from 'react';
import { Box, Typography, Fab, Button, useTheme } from '@mui/material';
import { useSnackbar } from 'notistack';
import { Route, People, EditNote, FilterList, QrCodeScanner, Add } from '@mui/icons-material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StateDisplay } from '../components/ui/StateDisplay';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Pagination } from '../components/ui/Pagination';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useSelectableRows } from '../hooks/useSelectableRows';
import { QrPdfDialog } from '../components/routes/QrPdfDialog';
import { generateQrPdfBlob, downloadBlob } from '../utils/generateQrPdf';
import {
  useGymAdminStats,
  useAdminRoutes,
  useGymActivity,
  useGymSetters,
} from '../services/hooks/useGymAdmin';
import { useGym, useUpdateGym } from '../services/hooks/useGyms';
import { useManagedGym } from '../services/hooks/useManagedGym';
import type { AdminRouteFilterState } from '../types/gymAdmin';
import type { RouteDto } from '../types/route';
import type { UpdateGymPayload } from '../types/gym';
import { GymInfoCard } from '../components/gymAdmin/GymInfoCard';
import { GymActivityCard } from '../components/gymAdmin/GymActivityCard';
import { AdminRouteTable } from '../components/gymAdmin/AdminRouteTable';
import { AdminRouteFilters } from '../components/gymAdmin/AdminRouteFilters';
import { SettersManagement } from '../components/gymAdmin/SettersManagement';
import { GymProfileEditor } from '../components/gymAdmin/GymProfileEditor';
import { RouteFormModal } from '../components/routes/RouteFormModal';

const DEFAULT_FILTERS: AdminRouteFilterState = {
  searchQuery: '',
  type: 'all',
  holdColor: 'all',
  minGradeIndex: 0,
  maxGradeIndex: 20,
  sort: 'newest',
  status: 'all',
  sector: 'all',
  setterId: 'all',
  minRating: 0,
  maxRating: 5,
  minAscents: 0,
  maxAscents: 10000,
  createdWithin: 0,
  tags: '',
};

export default function GymAdminDashboardPage() {
  const theme = useTheme();
  useScrollReveal();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AdminRouteFilterState>(DEFAULT_FILTERS);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [routeFormOpen, setRouteFormOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteDto | undefined>();

  const { selectedIds, setSelected } = useSelectableRows();
  const selectedRoutesRef = useRef<RouteDto[]>([]);
  const prevSelectedJson = useRef('');

  const { enqueueSnackbar } = useSnackbar();

  // GymAdmin управляет своим залом (через отдельный эндпоинт)
  const { data: managedGym, isLoading: managedLoading } = useManagedGym();
  const gymId = managedGym?.gymId ?? '';
  const { data: gym, isLoading: gymLoading } = useGym(gymId);
  const { data: stats, isLoading: statsLoading } = useGymAdminStats(gymId);
  const { data: activity } = useGymActivity(gymId);
  const { data: routesData, isLoading: routesLoading } = useAdminRoutes(gymId, { ...filters, page, pageSize: 10 });
  const { data: setters, isLoading: settersLoading } = useGymSetters(gymId);
  const [unlinkTarget, setUnlinkTarget] = useState<string | null>(null);

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

  const sectors = useMemo(() => {
    const map = new Map<string, string>();
    (routesData?.items ?? []).forEach((r: RouteDto) => {
      if (r.sector) map.set(r.sector, r.sector);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [routesData]);

  const setterOptions = useMemo(() => {
    const map = new Map<string, string>();
    (routesData?.items ?? []).forEach((r: RouteDto) => {
      if (r.setterId) map.set(r.setterId, r.setterName);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [routesData]);

  const { mutateAsync: updateGymMutate, isPending: savingGym } = useUpdateGym(gymId);

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

  const handleSaveGym = useCallback(async (data: UpdateGymPayload) => {
    await updateGymMutate(data);
    setEditorOpen(false);
  }, [updateGymMutate]);

  const handleEditRoute = useCallback((route: RouteDto) => {
    setEditingRoute(route);
    setRouteFormOpen(true);
  }, []);

  const handleCloseRouteForm = useCallback(() => {
    setRouteFormOpen(false);
    setEditingRoute(undefined);
  }, []);

  const handleUnlink = (id: string) => setUnlinkTarget(id);

  const handleUnlinkConfirm = async () => {
    if (!unlinkTarget) return;
    try {
      // TODO: implement actual unlink API call
      enqueueSnackbar('Рутсеттер отвязан', { variant: 'success' });
    } catch {
      enqueueSnackbar('Ошибка при отвязывании', { variant: 'error' });
    } finally {
      setUnlinkTarget(null);
    }
  };

  if (managedLoading || gymLoading) {
    return (
      <PageContainer>
        <StateDisplay type="loading" message="Загрузка зала…" />
      </PageContainer>
    );
  }

  if (!managedGym || !gym) {
    return (
      <PageContainer>
        <StateDisplay type="error" message="Не удалось загрузить данные зала" description="Проверьте, что у вас есть права на управление залом" />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '1.35rem', fontWeight: 800, color: theme.palette.text.primary }}>
            Управление залом
          </Typography>
        </Box>

        <GymInfoCard gym={gym} onEdit={() => setEditorOpen(true)} />

         {statsLoading || !stats ? (
          <StateDisplay type="loading" message="Загрузка статистики…" />
        ) : (
          <GymActivityCard activity={activity ?? { newRoutes: 0, ascents: 0, reviews: 0, visitors: 0, period: '—' }} />
        )}

        <Box>
          <SectionHeader icon={<EditNote sx={{ fontSize: 20, color: theme.palette.primary.main }} />} title="Профиль зала" />
          <GymProfileEditor
            gym={gym}
            editing={editorOpen}
            onSave={handleSaveGym}
            onCancel={() => setEditorOpen(false)}
            saving={savingGym}
          />
        </Box>

        <Box>
          <AdminRouteFilters
            filters={filters}
            onChange={setFilters}
            sectors={sectors}
            setters={setterOptions}
            filterTrigger={({ open, toggle, activeCount }) => (
              <SectionHeader
                icon={<Route sx={{ fontSize: 20, color: theme.palette.primary.main }} />}
                title="Все трассы зала"
                action={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button size="small" variant="outlined" startIcon={<Add />} onClick={() => setRouteFormOpen(true)} sx={{ fontSize: '0.78rem' }}>
                      Новая трасса
                    </Button>
                    <Box onClick={toggle} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', color: theme.palette.text.secondary, '&:hover': { color: theme.palette.text.primary } }}>
                      <FilterList sx={{ fontSize: 18 }} />
                      {activeCount > 0 && (
                        <Box sx={{ background: theme.palette.primary.main, color: '#fff', borderRadius: '10px', px: 0.75, py: 0.1, fontSize: '0.65rem', fontWeight: 700 }}>{activeCount}</Box>
                      )}
                      {open ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
                    </Box>
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
              <AdminRouteTable
                routes={routesData?.items ?? []}
                selectable
                selectedIds={selectedIds}
                onSelectionChange={setSelected}
                onEdit={handleEditRoute}
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
          <SectionHeader icon={<People sx={{ fontSize: 20, color: theme.palette.primary.main }} />} title="Рутсеттеры" />
          {settersLoading ? (
            <StateDisplay type="loading" message="Загрузка…" />
          ) : (
            <SettersManagement
              setters={setters ?? []}
              onUnlink={handleUnlink}
              onLink={() => alert('Привязать рутсеттера — скоро')}
            />
          )}
        </Box>
      </Box>

      {routeFormOpen && (
        <RouteFormModal
          open={routeFormOpen}
          route={editingRoute}
          gymId={gymId}
          setterOptions={setters?.map((s) => ({ id: s.id, name: s.name }))}
          onClose={handleCloseRouteForm}
        />
      )}
      <ConfirmDialog
        open={unlinkTarget !== null}
        title="Отвязать рутсеттера?"
        message="Рутсеттер потеряет доступ к управлению трассами этого зала."
        confirmLabel="Отвязать"
        severity="warning"
        onConfirm={handleUnlinkConfirm}
        onCancel={() => setUnlinkTarget(null)}
      />
    </PageContainer>
  );
}
