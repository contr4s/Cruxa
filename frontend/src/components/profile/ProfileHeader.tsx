import { Box, Typography, Avatar, useTheme, Button } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import PeopleIcon from '@mui/icons-material/People';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check';
import { Card } from '../../theme/cardStyles';
import type { UserDto } from '../../types/user';
import { useState } from 'react';
import { FollowersList } from './FollowersList';

interface ProfileHeaderProps {
  user: UserDto;
  followersCount: number;
  followingCount: number;
  kruskorScore: number;
  totalWorkouts: number;
  isOwner?: boolean;
  isFollowed?: boolean;
  isFollowLoading?: boolean;
  onToggleFollow?: () => void;
  onEdit?: () => void;
}

function EditButton({ theme: _theme, onClick }: { theme: ReturnType<typeof useTheme>; onClick?: () => void }) {
  return (
    <Button
      onClick={onClick}
      size="small"
      variant="outlined"
      startIcon={<EditIcon />}
      sx={{ mt: 0.5, flexShrink: 0 }}
    >
      Редактировать
    </Button>
  );
}

function FollowButton({
  theme,
  isFollowed,
  isLoading,
  onClick,
}: {
  theme: ReturnType<typeof useTheme>;
  isFollowed: boolean;
  isLoading: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      disabled={isLoading}
      variant={isFollowed ? 'contained' : 'outlined'}
      startIcon={isFollowed ? <CheckIcon /> : <PersonAddIcon />}
      sx={{
        flexShrink: 0,
        mt: 0.5,
        borderRadius: '50px',
        textTransform: 'none',
        fontSize: '0.82rem',
        fontWeight: 600,
        px: 2,
        py: 0.5,
        minWidth: 130,
        borderColor: (theme as any)?.palette?.primary?.main,
        color: isFollowed ? '#fff' : (theme as any)?.palette?.primary?.main,
        bgcolor: isFollowed ? (theme as any)?.palette?.primary?.main : 'transparent',
        '&:hover': {
          borderColor: (theme as any)?.palette?.primary?.main,
          bgcolor: isFollowed
            ? ((theme as any)?.palette?.primary?.dark ?? '#1F8A80')
            : `${(theme as any)?.palette?.primary?.main}15`,
        },
        '&.Mui-disabled': { opacity: 0.6 },
      }}
    >
      {isFollowed ? 'Вы подписаны' : 'Подписаться'}
    </Button>
  );
}

export function ProfileHeader({
  user,
  followersCount,
  followingCount,
  kruskorScore,
  totalWorkouts,
  isOwner = true,
  isFollowed = false,
  isFollowLoading = false,
  onToggleFollow,
  onEdit,
}: ProfileHeaderProps) {
  const theme = useTheme();
  const [listModal, setListModal] = useState<{ open: boolean; mode: 'followers' | 'following' }>({ open: false, mode: 'followers' });

  const initial = (user.firstName || user.username)[0].toUpperCase();
  const displayName = user.firstName
    ? user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName
    : user.username;

  return (
    <Box
      className="card-teal"
      sx={{
        ...Card(theme),
        background: 'rgba(38, 166, 154, 0.06)',
        border: '1px solid rgba(38, 166, 154, 0.2)',
      }}
    >
      {/* Desktop layout: avatar + all info in flex row */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'flex-start' }}>
        <Avatar
          src={user.avatarUrl}
          sx={{
            width: 72,
            height: 72,
            fontSize: '1.8rem',
            bgcolor: theme.palette.primary.main,
            flexShrink: 0,
            border: `3px solid ${theme.palette.primary.main}`,
            boxShadow: '0 0 12px 2px rgba(38,166,154,0.3)',
            transition: 'box-shadow .2s ease',
            '&:hover': {
              boxShadow: '0 0 20px 4px rgba(38,166,154,0.5)',
            },
          }}
        >
          {initial}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.75 }}>
            <Typography variant="h3" sx={{ fontSize: '1.35rem', fontWeight: 700, color: theme.palette.text.primary, display: 'flex', alignItems: 'center' }}>
              {displayName}
            </Typography>
            {user.city && (
              <Typography variant="body2" sx={{ color: theme.custom.text3, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 0.35 }}>
                <LocationOnIcon sx={{ fontSize: 16, color: theme.custom.text3 }} /> {user.city}
              </Typography>
            )}
            {user.gender && (
              <Box
                component="span"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'rgba(38, 166, 154, 0.12)',
                  color: theme.palette.primary.main,
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {user.gender === 'M' ? 'М' : user.gender === 'F' ? 'Ж' : user.gender}
              </Box>
            )}
            {user.height && (
              <Box
                component="span"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 0.75,
                  py: 0.15,
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: theme.custom.text3,
                  lineHeight: 1.4,
                }}
              >
                {user.height} см
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2.5 }, flexWrap: 'wrap', fontSize: '0.85rem', color: theme.palette.text.secondary, mb: 1.5 }}>
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.35 }}><WhatshotIcon sx={{ fontSize: 16, color: theme.palette.secondary.main }} /> <strong style={{ color: theme.palette.secondary.main }}>{kruskorScore.toFixed(1)}</strong> крускор</Box>
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.35 }}><FitnessCenterIcon sx={{ fontSize: 16 }} /> <strong style={{ color: theme.palette.text.primary }}>{totalWorkouts}</strong> тренировок</Box>
            <Box
              component="span"
              onClick={() => setListModal({ open: true, mode: 'followers' })}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.35, cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
            ><PeopleIcon sx={{ fontSize: 16 }} /> <strong style={{ color: theme.palette.text.primary }}>{followersCount}</strong> подписчика</Box>
            <Box
              component="span"
              onClick={() => setListModal({ open: true, mode: 'following' })}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.35, cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
            ><BookmarkIcon sx={{ fontSize: 16 }} /> <strong style={{ color: theme.palette.text.primary }}>{followingCount}</strong> подписок</Box>
          </Box>

        </Box>

        {isOwner ? (
          <EditButton theme={theme} onClick={onEdit} />
        ) : (
          <FollowButton theme={theme} isFollowed={isFollowed} isLoading={isFollowLoading} onClick={onToggleFollow ?? (() => {})} />
        )}
      </Box>

      {/* Mobile layout: avatar + name row, then stats/achievements full width below */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <Avatar
            src={user.avatarUrl}
            sx={{
              width: 72,
              height: 72,
              fontSize: '1.8rem',
              bgcolor: theme.palette.primary.main,
              flexShrink: 0,
              border: `3px solid ${theme.palette.primary.main}`,
              boxShadow: '0 0 12px 2px rgba(38,166,154,0.3)',
              transition: 'box-shadow .2s ease',
              '&:hover': {
                boxShadow: '0 0 20px 4px rgba(38,166,154,0.5)',
              },
            }}
          >
            {initial}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.75 }}>
              <Typography variant="h3" sx={{ fontSize: '1.35rem', fontWeight: 700, color: theme.palette.text.primary }}>
                {displayName}
              </Typography>
              {user.city && (
                <Typography variant="body2" sx={{ color: theme.custom.text3, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 0.35 }}>
                  <LocationOnIcon sx={{ fontSize: 16, color: theme.custom.text3 }} /> {user.city}
                </Typography>
              )}
              {user.gender && (
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'rgba(38, 166, 154, 0.12)',
                    color: theme.palette.primary.main,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {user.gender === 'M' ? 'М' : user.gender === 'F' ? 'Ж' : user.gender}
                </Box>
              )}
              {user.height && (
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 0.75,
                    py: 0.15,
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: theme.custom.text3,
                    lineHeight: 1.4,
                  }}
                >
                  {user.height} см
                </Box>
              )}
            </Box>

          </Box>

          {isOwner ? (
            <EditButton theme={theme} onClick={onEdit} />
          ) : (
            <FollowButton theme={theme} isFollowed={isFollowed} isLoading={isFollowLoading} onClick={onToggleFollow ?? (() => {})} />
          )}
        </Box>

        {/* Stats row — full width below avatar row, flush left */}
        <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2.5 }, flexWrap: 'wrap', fontSize: '0.85rem', color: theme.palette.text.secondary, mt: 2, mb: 1.5 }}>
          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.35 }}><WhatshotIcon sx={{ fontSize: 16, color: theme.palette.secondary.main }} /> <strong style={{ color: theme.palette.secondary.main }}>{kruskorScore.toFixed(1)}</strong> крускор</Box>
          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.35 }}><FitnessCenterIcon sx={{ fontSize: 16 }} /> <strong style={{ color: theme.palette.text.primary }}>{totalWorkouts}</strong> тренировок</Box>
          <Box
            component="span"
            onClick={() => setListModal({ open: true, mode: 'followers' })}
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.35, cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
          ><PeopleIcon sx={{ fontSize: 16 }} /> <strong style={{ color: theme.palette.text.primary }}>{followersCount}</strong> подписчика</Box>
          <Box
            component="span"
            onClick={() => setListModal({ open: true, mode: 'following' })}
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.35, cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
          ><BookmarkIcon sx={{ fontSize: 16 }} /> <strong style={{ color: theme.palette.text.primary }}>{followingCount}</strong> подписок</Box>
        </Box>

      </Box>

      <FollowersList
        open={listModal.open}
        onClose={() => setListModal({ open: false, mode: 'followers' })}
        userId={user.id}
        mode={listModal.mode}
      />
    </Box>
  );
}
