import { useState } from 'react';
import {
  Box, Typography, Button, IconButton,
} from '@mui/material';
import { FitnessCenter, Close } from '@mui/icons-material';
import { ConfirmDialog } from '../../ui/ConfirmDialog';
import { useDraftStore } from '../../../stores/draftWorkoutStore';
import { useUpdatePost } from '../../../services/hooks/useDraftPost';
import { PublishWorkoutSheet } from './PublishWorkoutSheet';

export function DraftWorkoutBar() {
  const { status, gymName, ascents, postId, clearDraft } = useDraftStore();
  const { mutateAsync: removeDraft } = useUpdatePost(postId);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);

  if (status !== 'active') return null;

  const handleCancel = async () => {
    await removeDraft({ status: 'deleted' }).catch((err) => console.error('[Draft] Cancel failed:', err));
    clearDraft();
    setConfirmOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 64, md: 16 },
          left: { xs: 0, md: 'auto' },
          right: { xs: 0, md: 16 },
          zIndex: 300,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: { xs: 2, md: 3 },
          py: 0.5,
          bgcolor: 'background.paper',
          borderRadius: { xs: 0, md: '50px' },
          boxShadow: { xs: 'none', md: '0 4px 16px rgba(0,0,0,0.15)' },
          backdropFilter: 'blur(8px)',
          minWidth: { md: 320 },
          maxWidth: { md: 400 },
        }}
      >
        <FitnessCenter sx={{ fontSize: 20, color: 'primary.main' }} />
        <Typography variant="body2" sx={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {gymName}, {ascents.length} {ascents.length === 1 ? 'трасса' : ascents.length >= 2 && ascents.length <= 4 ? 'трассы' : 'трасс'}
        </Typography>
        <Button size="small" variant="contained" onClick={() => setPublishOpen(true)}>
          Завершить
        </Button>
        <IconButton size="small" onClick={() => setConfirmOpen(true)}>
          <Close fontSize="small" />
        </IconButton>
      </Box>

      {/* Cancel confirm dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title="Отменить тренировку?"
        message="Все добавленные трассы будут удалены. Это действие нельзя отменить."
        confirmLabel="Отменить тренировку"
        cancelLabel="Остаться"
        severity="error"
        onConfirm={handleCancel}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* Publish sheet */}
      <PublishWorkoutSheet open={publishOpen} onClose={() => setPublishOpen(false)} />
    </>
  );
}
