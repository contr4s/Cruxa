import { Box, Typography, useTheme, IconButton, CircularProgress } from '@mui/material';
import { PersonAdd, PersonRemove, People } from '@mui/icons-material';
import type { RecommendedUserDto } from '../../types/post';
import { UserLink } from '../user/UserLink';
import { StateDisplay } from '../ui/StateDisplay';
import { useFollowUser, useUnfollowUser } from '../../services/hooks/useUser';

interface FeedUserSuggestionsProps {
  users: RecommendedUserDto[];
}

export function FeedUserSuggestions({ users }: FeedUserSuggestionsProps) {
  const theme = useTheme();
  const { mutate: doFollow, isPending: followPending } = useFollowUser();
  const { mutate: doUnfollow, isPending: unfollowPending } = useUnfollowUser();

  const handleToggleFollow = (user: RecommendedUserDto) => {
    if (user.isFollowed) {
      doUnfollow(user.id);
    } else {
      doFollow(user.id);
    }
  };

  const loading = followPending || unfollowPending;

  const list = users.length === 0 ? (
    <StateDisplay type="empty" size="sm" message="Нет рекомендаций" />
  ) : (
    users.map((user) => (
      <Box
        key={user.id}
        sx={{
          display: 'flex', alignItems: 'center', gap: 1, py: 0.75, px: 0.5, mx: -0.5, borderRadius: 1,
          transition: 'background .2s ease',
          '&:hover': { bgcolor: theme.custom.surface2 },
        }}
      >
        <UserLink
          username={user.username}
          displayName={user.displayName}
          avatarUrl={user.userAvatarUrl}
          size="md"
          withAvatar
          subtitle={<>{user.commonFollowers} общих подписок</>}
        />
        <IconButton
          size="small"
          disabled={loading}
          onClick={(e) => {
            e.stopPropagation();
            handleToggleFollow(user);
          }}
          sx={{
            color: user.isFollowed ? theme.palette.primary.main : theme.palette.text.secondary,
            transition: 'color .2s ease, background .2s ease',
            '&:hover': {
              color: theme.palette.primary.main,
              bgcolor: `${theme.palette.primary.main}15`,
            },
          }}
        >
          {loading ? (
            <CircularProgress size={16} />
          ) : user.isFollowed ? (
            <PersonRemove sx={{ fontSize: 18 }} />
          ) : (
            <PersonAdd sx={{ fontSize: 18 }} />
          )}
        </IconButton>
      </Box>
    ))
  );

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
      {list}
    </Box>
  );
}
