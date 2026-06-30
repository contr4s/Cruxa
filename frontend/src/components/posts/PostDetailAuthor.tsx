import { Box, Avatar, Typography, useTheme, Button } from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import { GymChip } from '../ui/GymChip';

interface PostDetailAuthorProps {
  avatar?: string;
  displayName: string;
  gymName?: string;
  gymId?: string;
  createdAt: string;
  isOwner?: boolean;
  onSubscribe?: () => void;
}

export function PostDetailAuthor({ avatar, displayName, gymName, gymId, createdAt, isOwner, onSubscribe }: PostDetailAuthorProps) {
  const theme = useTheme();
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, px: 2.5, py: 2 }}>
      <Avatar sx={{ width: 48, height: 48, fontSize: '1.2rem', bgcolor: theme.palette.primary.main }}>
        {initial}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: theme.palette.text.primary }}>
            {displayName}
          </Typography>
          {!isOwner && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<PersonAdd />}
              onClick={onSubscribe}
              sx={{ borderRadius: '50px', fontSize: '0.78rem', textTransform: 'none' }}
            >
              Подписаться
            </Button>
          )}
        </Box>
        <Typography sx={{ fontSize: '0.78rem', color: theme.palette.text.secondary, mt: 0.5 }}>
          {new Date(createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </Typography>
        {gymName && (
          <Box sx={{ mt: 0.5 }}>
            <GymChip name={gymName} gymId={gymId} />
          </Box>
        )}
      </Box>
    </Box>
  );
}
