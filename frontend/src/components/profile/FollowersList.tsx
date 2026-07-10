import { Box, Typography, List, ListItemButton, ListItemAvatar, Avatar, ListItemText, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ModalOverlay } from '../ui/ModalOverlay';
import { useFollowers, useFollowing } from '../../services/hooks/useUser';
import { StateDisplay } from '../ui/StateDisplay';

interface FollowersListProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  mode: 'followers' | 'following';
}

export function FollowersList({ open, onClose, userId, mode }: FollowersListProps) {
  const { data: users, isLoading } = mode === 'followers' ? useFollowers(userId) : useFollowing(userId);
  const navigate = useNavigate();

  return (
    <ModalOverlay open={open} onClose={onClose} maxWidth={400}>
      <Box sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {mode === 'followers' ? 'Подписчики' : 'Подписки'}
        </Typography>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : !users || users.length === 0 ? (
          <StateDisplay type="empty" message={mode === 'followers' ? 'Нет подписчиков' : 'Нет подписок'} />
        ) : (
          <List sx={{ maxHeight: 400, overflowY: 'auto' }}>
            {users.map((u) => (
              <ListItemButton
                key={u.id}
                onClick={() => { navigate(`/u/${u.username}`); onClose(); }}
              >
                <ListItemAvatar>
                  <Avatar src={u.avatarUrl} sx={{ bgcolor: 'primary.main' }}>
                    {(u.firstName || u.username)[0].toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={u.displayName || u.username}
                  secondary={`@${u.username}`}
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
    </ModalOverlay>
  );
}
