import { Box } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ProtectedRoute } from '../ui/ProtectedRoute';
import { BackgroundPattern } from '../ui/BackgroundPattern';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { BottomTabBar } from './BottomTabBar';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { DraftWorkoutBar } from '../workouts/draft/DraftWorkoutBar';
import { DraftFab } from '../workouts/draft/DraftFab';
import { StartWorkoutSheet } from '../workouts/draft/StartWorkoutSheet';
import { AscentFormModal } from '../workouts/draft/AscentFormModal';
import { useDraftStore } from '../../stores/draftWorkoutStore';
import { useMyDraft } from '../../services/hooks/useMyDraft';

const DASHBOARD_ROUTES = ['/routesetter', '/gym-admin', '/admin'];

export function ProtectedLayout() {
  const { startSheetOpen, ascentModalTarget, openStartSheet, closeStartSheet, closeAscentModal, startDraft } = useDraftStore();
  const location = useLocation();
  const isDashboard = DASHBOARD_ROUTES.includes(location.pathname);
  const { data: draft } = useMyDraft();

  const handleStart = () => {
    openStartSheet();
  };

  // Restore draft on mount
  useEffect(() => {
    if (draft && draft.status === 'Draft') {
      startDraft(draft.id, draft.gymId ?? '', draft.gymName);
    }
  }, [draft, startDraft]);

  return (
    <ProtectedRoute>
      <BackgroundPattern intensity={0.25} />
      <MobileHeader />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
        <Box sx={{ flex: 1, minWidth: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </Box>
      </Box>
      <BottomTabBar />
      <DraftWorkoutBar />
      {!isDashboard && <DraftFab onStart={handleStart} onAddAscent={() => useDraftStore.getState().openAscentModal()} />}
      <StartWorkoutSheet open={startSheetOpen} onClose={closeStartSheet} />
      <AscentFormModal
        open={ascentModalTarget !== null}
        onClose={closeAscentModal}
        prefilledRouteId={ascentModalTarget?.routeId}
      />
    </ProtectedRoute>
  );
}
