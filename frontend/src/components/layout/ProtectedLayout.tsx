import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
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

export function ProtectedLayout() {
  const { startSheetOpen, ascentModalTarget, openStartSheet, closeStartSheet, closeAscentModal } = useDraftStore();

  const handleStart = () => {
    openStartSheet();
  };

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
      <DraftFab onStart={handleStart} onAddAscent={() => useDraftStore.getState().openAscentModal()} />
      <StartWorkoutSheet open={startSheetOpen} onClose={closeStartSheet} />
      <AscentFormModal
        open={ascentModalTarget !== null}
        onClose={closeAscentModal}
        prefilledRouteId={ascentModalTarget?.routeId}
      />
    </ProtectedRoute>
  );
}
