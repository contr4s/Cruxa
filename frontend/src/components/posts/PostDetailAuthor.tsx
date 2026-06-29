import { Box, Avatar, Typography, useTheme, Button } from '@mui/material';
import { LocationOn, PersonAdd } from '@mui/icons-material';
import { getGymBadgeColor } from '../../constants/gymBadges';

interface PostDetailAuthorProps {
  avatar?: string;
  displayName: string;
  gymName?: string;
  gymId?: string;
  createdAt: string;
  isOwner?: boolean;
  onSubscribe?: () => void;
}

export function PostDetailAuthor({ avatar, displayName, gymName, createdAt, isOwner, onSubscribe }: PostDetailAuthorProps) {
  const theme = useTheme();
  const initial = displayName.charAt(0).toUpperCase();
  const gymColor = gymName ? getGymBadgeColor(gymName) : undefined;

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
        {gymName && gymColor && (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.3, mt: 0.5, background: `${gymColor}22`, color: gymColor, borderRadius: '100px', px: 1, py: 0.25, fontSize: '0.78rem', fontWeight: 700 }}>
            <LocationOn sx={{ fontSize: 14 }} /> {gymName}
          </Box>
        )}
      </Box>
    </Box>
  );
}
