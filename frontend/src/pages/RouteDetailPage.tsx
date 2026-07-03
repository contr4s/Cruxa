import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { FitnessCenter } from '@mui/icons-material';
import type { Location } from 'react-router-dom';

import { useRoute, useRouteConsensus, useRouteReviews } from '../services/hooks/useRoutes';
import { useCreateDraftPost } from '../services/hooks/useDraftPost';
import { PageContainer } from '../components/layout/PageContainer';
import { StateDisplay } from '../components/ui/StateDisplay';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { ModalOverlay } from '../components/ui/ModalOverlay';
import { RoutePhotoBlock } from '../components/routes/detail/RoutePhotoBlock';
import { RouteInfoBlock } from '../components/routes/detail/RouteInfoBlock';
import { RouteConsensusChart } from '../components/routes/detail/RouteConsensusChart';
import { RouteReviews } from '../components/routes/detail/RouteReviews';
import { PrivateNotes } from '../components/routes/detail/PrivateNotes';
import { useDraftStore } from '../stores/draftWorkoutStore';

export default function RouteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | undefined;
  const isModal = !!state?.backgroundLocation;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const draftStatus = useDraftStore((s) => s.status);
  const draftGymId = useDraftStore((s) => s.gymId);
  const store = useDraftStore();
  const { mutateAsync: createDraft } = useCreateDraftPost();
  const {
    data: route,
    isLoading: routeLoading,
    error: routeError,
  } = useRoute(id ?? '');
  const { data: consensus } = useRouteConsensus(id ?? '');
  const { data: reviews } = useRouteReviews(id ?? '');

  if (routeLoading) {
    return (
      <PageContainer>
        <StateDisplay type="loading" message="Загрузка трассы…" />
      </PageContainer>
    );
  }

  if (routeError || !route) {
    return (
      <PageContainer>
        <StateDisplay
          type="error"
          message="Трасса не найдена"
          description={
            routeError instanceof Error
              ? routeError.message
              : 'Проверьте соединение и попробуйте снова.'
          }
        />
      </PageContainer>
    );
  }

  const handleClose = () => {
    if (isModal) navigate(-1);
    else navigate('/feed');
  };

  const handleSendClimb = async () => {
    if (!route) return;
    if (draftStatus === 'idle') {
      const post = await createDraft(route.gymId);
      store.startDraft(post.id, route.gymId, route.gymName);
      store.openAscentModal(route.id);
    } else if (draftGymId === route.gymId) {
      store.openAscentModal(route.id);
    } else {
      setConfirmOpen(true);
    }
  };

  const handleReplaceDraft = async () => {
    if (!route) return;
    store.clearDraft();
    const post = await createDraft(route.gymId);
    store.startDraft(post.id, route.gymId, route.gymName);
    setConfirmOpen(false);
    store.openAscentModal(route.id);
  };

  const content = (
    <>
      {/* Mobile: stacked */} 
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2.5 }}>
        <RouteInfoBlock route={route} />
        <RoutePhotoBlock route={route} />
        <PrivateNotes />
        <RouteConsensusChart consensus={consensus ?? null} />
        <RouteReviews reviews={reviews ?? []} />
      </Box>

      {/* Desktop: 2-column grid */}
      <Box
        sx={{
          display: { xs: 'none', md: 'grid' },
          gridTemplateColumns: '1.3fr 1fr',
          gap: 2.5,
          alignItems: 'start',
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <RoutePhotoBlock route={route} />
        </Box>

        <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <RouteInfoBlock route={route} />
          <PrivateNotes />
          <RouteConsensusChart consensus={consensus ?? null} />
          <RouteReviews reviews={reviews ?? []} />
        </Box>
      </Box>

      {/* FAB: Пролез! */}
      <Box
        component="button"
        onClick={handleSendClimb}
        sx={{
          position: 'fixed',
          bottom: { xs: '100px', md: '28px' },
          right: '28px',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          px: { xs: 0, md: '24px' },
          py: { xs: 0, md: '14px' },
          width: { xs: 52, md: 'auto' },
          height: { xs: 52, md: 'auto' },
          border: 'none',
          borderRadius: { xs: '50%', md: '50px' },
          background: 'rgba(38,166,154,0.88)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          color: '#000',
          fontWeight: 700,
          fontSize: '0.95rem',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(38,166,154,0.4)',
          transition: 'transform .15s, box-shadow .15s',
          lineHeight: 1,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 24px rgba(38,166,154,0.5)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        }}
      >
        <FitnessCenter sx={{ fontSize: '1.3rem' }} />
        <Box
          component="span"
          sx={{
            whiteSpace: 'nowrap',
            display: { xs: 'none', md: 'inline' },
          }}
        >
          Пролез!
        </Box>
      </Box>

      {/* Wrong gym confirm dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title="Другой зал"
        message={`У вас активна тренировка в «${store.gymName}». Начать новую в «${route?.gymName}»? Текущая тренировка будет отменена.`}
        confirmLabel="Заменить"
        cancelLabel="Остаться"
        severity="warning"
        onConfirm={handleReplaceDraft}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );

  if (isModal) {
    return (
      <ModalOverlay open onClose={handleClose}>
        <PageContainer>{content}</PageContainer>
      </ModalOverlay>
    );
  }

  return <PageContainer>{content}</PageContainer>;
}
