import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SnackbarProvider } from 'notistack';
import { darkTheme } from './theme/darkTheme';
import { AuthProvider } from './providers/AuthProvider';
import { ProtectedLayout } from './components/layout/ProtectedLayout';
import { StateDisplay } from './components/ui/StateDisplay';
import { RoleGuard } from './components/ui/RoleGuard';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const FeedPage = lazy(() => import('./pages/FeedPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const WorkoutsPage = lazy(() => import('./pages/WorkoutsPage'));
const GymsPage = lazy(() => import('./pages/GymsPage'));
const GymDetailPage = lazy(() => import('./pages/GymDetailPage'));
const PostDetailPage = lazy(() => import('./pages/PostDetailPage'));
const RouteDetailPage = lazy(() => import('./pages/RouteDetailPage'));
const RoutesetterDashboardPage = lazy(() => import('./pages/RoutesetterDashboardPage'));
const GymAdminDashboardPage = lazy(() => import('./pages/GymAdminDashboardPage'));
const SuperAdminDashboardPage = lazy(() => import('./pages/SuperAdminDashboardPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));

function AppRoutes() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | null;

  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/u/:username" element={<UserProfilePage />} />
          <Route path="/workouts" element={<WorkoutsPage />} />
          <Route path="/workouts/new" element={<Navigate to="/workouts" replace />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/gyms" element={<GymsPage />} />
          <Route path="/gyms/:id" element={<GymDetailPage />} />
          <Route path="/route/:id" element={<RouteDetailPage />} />
          <Route path="/routesetter" element={<RoleGuard role="Routesetter"><RoutesetterDashboardPage /></RoleGuard>} />
          <Route path="/gym-admin" element={<RoleGuard role="GymAdmin"><GymAdminDashboardPage /></RoleGuard>} />
          <Route path="/admin" element={<RoleGuard role="Admin"><SuperAdminDashboardPage /></RoleGuard>} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/route/:id" element={<RouteDetailPage />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AuthProvider>
            <SnackbarProvider
              maxSnack={5}
              autoHideDuration={4000}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Suspense fallback={<StateDisplay type="loading" message="Загрузка…" />}>
                <AppRoutes />
              </Suspense>
            </SnackbarProvider>
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
