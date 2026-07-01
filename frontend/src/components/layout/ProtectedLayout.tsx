import { Box } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '../ui/ProtectedRoute';
import { BackgroundPattern } from '../ui/BackgroundPattern';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { BottomTabBar } from './BottomTabBar';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { Fab } from '../ui/Fab';

export function ProtectedLayout() {
  const location = useLocation();
  const hideFab = /^\/route\/\w+/.test(location.pathname) || location.pathname === '/routesetter' || location.pathname === '/gym-admin' || location.pathname === '/admin';

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
      {!hideFab && <Fab onClick={() => alert('Новая тренировка')} />}
    </ProtectedRoute>
  );
}
