import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, TextField, Typography, List, ListItemButton, ListItemText, CircularProgress } from '@mui/material';
import { ModalOverlay } from '../../ui/ModalOverlay';
import { useGyms } from '../../../services/hooks/useGyms';
import { useCreateDraftPost } from '../../../services/hooks/useDraftPost';
import { useDraftStore } from '../../../stores/draftWorkoutStore';

interface StartWorkoutSheetProps {
  open: boolean;
  onClose: () => void;
}

export function StartWorkoutSheet({ open, onClose }: StartWorkoutSheetProps) {
  const { id: gymIdFromUrl } = useParams<{ id: string }>();
  const [search, setSearch] = useState('');
  const { data: gymsData, isLoading } = useGyms({ pageSize: 500 });
  const startDraft = useDraftStore((s) => s.startDraft);
  const { mutateAsync: createDraft, isPending } = useCreateDraftPost();

  const allGyms = gymsData?.items ?? [];
  const filtered = allGyms.filter(
    (g) => g.name.toLowerCase().includes(search.toLowerCase()) || g.city.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = async (gymId: string, gymName: string) => {
    const post = await createDraft(gymId);
    startDraft(post.id, gymId, gymName);
    onClose();
  };

  // Auto-select if on gym detail page
  useEffect(() => {
    if (open && gymIdFromUrl) {
      const gym = allGyms.find((g) => g.id === gymIdFromUrl);
      if (gym) handleSelect(gym.id, gym.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, gymIdFromUrl, allGyms]);

  return (
    <ModalOverlay open={open} onClose={onClose} maxWidth={480}>
      <Box sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Выберите зал
        </Typography>
        <TextField
          fullWidth
          placeholder="Поиск зала…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />
        {isLoading || isPending ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <List sx={{ maxHeight: 360, overflowY: 'auto' }}>
            {filtered.map((gym) => (
              <ListItemButton key={gym.id} onClick={() => handleSelect(gym.id, gym.name)}>
                <ListItemText primary={gym.name} secondary={gym.city} />
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
    </ModalOverlay>
  );
}
