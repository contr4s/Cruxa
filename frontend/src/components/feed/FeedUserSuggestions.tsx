import { Box, Typography, useTheme, IconButton } from '@mui/material';
import { PersonAdd, People } from '@mui/icons-material';
import type { RecommendedUserDto } from '../../types/post';
import { avatarInitial } from '../../theme/commonStyles';

interface FeedUserSuggestionsProps {
  users: RecommendedUserDto[];
}

export function FeedUserSuggestions({ users }: FeedUserSuggestionsProps) {
  const theme = useTheme();

  return (
    <Box sx={{
      bgcolor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 2,
      p: 2,
      transition: 'box-shadow .2s ease, border-color .2s ease',
      '&:hover': {
        borderColor: theme.palette.primary.main,
        boxShadow: '0 4px 20px rgba(0,0,0,.3)',
      },
    }}>
      <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', mb: 1.5, color: theme.palette.text.primary, display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <People sx={{ fontSize: 16, color: theme.palette.primary.main }} /> Рекомендуем подписаться
      </Typography>
      {users.map((user) => (
        <Box
          key={user.id}
          sx={{
            display: 'flex', alignItems: 'center', gap: 1, py: 0.75, px: 0.5, mx: -0.5, borderRadius: 1,
            transition: 'background .2s ease',
            cursor: 'pointer',
            '&:hover': { bgcolor: theme.custom.surface2 },
          }}
        >
          <Box sx={avatarInitial(32)}>
            {user.displayName.charAt(0)}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: theme.palette.text.primary }}>
              {user.displayName}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: theme.palette.text.secondary }}>
              {user.commonFollowers} общих подписок
            </Typography>
          </Box>
          {!user.isFollowed && (
            <IconButton
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                transition: 'color .2s ease, background .2s ease',
                '&:hover': {
                  color: theme.palette.primary.main,
                  bgcolor: `${theme.palette.primary.main}15`,
                },
              }}
            >
              <PersonAdd sx={{ fontSize: 18 }} />
            </IconButton>
          )}
        </Box>
      ))}
    </Box>
  );
}
