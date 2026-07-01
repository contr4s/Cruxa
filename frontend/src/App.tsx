import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { darkTheme } from './theme/darkTheme';
import { AuthProvider } from './providers/AuthProvider';
import { ProtectedLayout } from './components/layout/ProtectedLayout';
import { StateDisplay } from './components/ui/StateDisplay';
import { RoleGuard } from './components/ui/RoleGuard';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
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
          <Route path="/workouts" element={<WorkoutsPage />} />
          <Route path="/workouts/new" element={<StateDisplay type="empty" icon={<FitnessCenterIcon />} message="Скоро" description="Форма создания тренировки — скоро" />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/gyms" element={<GymsPage />} />
          <Route path="/gyms/:id" element={<GymDetailPage />} />
          <Route path="/route/:id" element={<RouteDetailPage />} />
          <Route path="/routesetter" element={<RoleGuard role="Routesetter"><RoutesetterDashboardPage /></RoleGuard>} />
          <Route path="/gym-admin" element={<RoleGuard role="GymAdmin"><GymAdminDashboardPage /></RoleGuard>} />
          <Route path="/admin" element={<RoleGuard role="Admin"><SuperAdminDashboardPage /></RoleGuard>} />
        </Route>
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
        <AuthProvider>
          <Suspense fallback={<StateDisplay type="loading" message="Загрузка…" />}>
            <AppRoutes />
          </Suspense>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
