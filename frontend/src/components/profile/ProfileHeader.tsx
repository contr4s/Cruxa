import { useState } from 'react';
import { Box, Typography, Avatar, useTheme } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import PeopleIcon from '@mui/icons-material/People';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import { Card } from '../../theme/cardStyles';
import type { UserDto } from '../../types/user';

const ACHIEVEMENTS = [
  { name: '15 дней подряд', type: 'secondary' },
  { name: '50 трасс', type: 'primary' },
  { name: '10 отзывов', type: 'primary-dark' },
  { name: '5 залов', type: 'primary-dark' },
  { name: '8 фото', type: 'primary-dark' },
  { name: 'Первый пролаз', type: 'secondary' },
];

const MAX_VISIBLE = 3;

const BADGE_STYLES: Record<string, Record<string, string>> = {
  secondary: { bg: 'rgba(255, 179, 0, 0.15)', color: '#FFB300' },
  primary: { bg: 'rgba(38, 166, 154, 0.15)', color: '#26A69A' },
  'primary-dark': { bg: 'rgba(38, 166, 154, 0.08)', color: '#80CBC4' },
};

interface ProfileHeaderProps {
  user: UserDto;
  followersCount: number;
  followingCount: number;
  kruskorScore: number;
  totalWorkouts: number;
}

export function ProfileHeader({ user, followersCount, followingCount, kruskorScore, totalWorkouts }: ProfileHeaderProps) {
  const theme = useTheme();
  const [showAllAchievements, setShowAllAchievements] = useState(false);

  const initial = (user.firstName || user.username)[0].toUpperCase();
  const displayName = user.firstName
    ? user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName
    : user.username;
  const visibleAchievements = showAllAchievements ? ACHIEVEMENTS : ACHIEVEMENTS.slice(0, MAX_VISIBLE);
  const hiddenCount = ACHIEVEMENTS.length - MAX_VISIBLE;

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
                {user.gender}
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
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.35 }}><WhatshotIcon sx={{ fontSize: 16, color: theme.palette.secondary.main }} /> <strong style={{ color: theme.palette.secondary.main }}>{kruskorScore}</strong> крускор</Box>
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.35 }}><FitnessCenterIcon sx={{ fontSize: 16 }} /> <strong style={{ color: theme.palette.text.primary }}>{totalWorkouts}</strong> тренировок</Box>
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.35 }}><PeopleIcon sx={{ fontSize: 16 }} /> <strong style={{ color: theme.palette.text.primary }}>{followersCount}</strong> подписчика</Box>
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.35 }}><BookmarkIcon sx={{ fontSize: 16 }} /> <strong style={{ color: theme.palette.text.primary }}>{followingCount}</strong> подписок</Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', alignItems: 'center' }}>
            {visibleAchievements.map((achievement) => {
              const style = BADGE_STYLES[achievement.type] || BADGE_STYLES['primary-dark'];
              return (
                <Box
                  key={achievement.name}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.35,
                    background: style.bg,
                    borderRadius: '100px',
                    px: 1.25,
                    py: 0.2,
                    fontSize: '0.75rem',
                    color: style.color,
                    fontWeight: 500,
                  }}
                >
                  <span>{achievement.name}</span>
                </Box>
              );
            })}
            {!showAllAchievements && hiddenCount > 0 && (
              <Box
                onClick={() => setShowAllAchievements(true)}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px dashed rgba(255,255,255,0.1)',
                  borderRadius: '100px',
                  px: 1.25,
                  py: 0.2,
                  fontSize: '0.72rem',
                  color: theme.custom.text3,
                  cursor: 'pointer',
                  fontWeight: 600,
                  '&:hover': { background: 'rgba(255,255,255,0.08)', color: theme.palette.text.secondary },
                }}
              >
                +{hiddenCount}
              </Box>
            )}
          </Box>
        </Box>

        <Box
          component="button"
          sx={{
            flexShrink: 0,
            mt: 0.5,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            px: 2,
            py: 0.5,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '8px',
            background: 'transparent',
            cursor: 'pointer',
            color: theme.palette.text.secondary,
            fontSize: '0.85rem',
            fontWeight: 600,
            fontFamily: 'inherit',
            transition: 'background .15s, color .15s',
            '&:hover': { borderColor: theme.palette.text.secondary, color: theme.palette.text.primary },
          }}
        >
          <EditIcon sx={{ fontSize: 18 }} />
          <Box component="span">Редактировать</Box>
        </Box>
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
                  {user.gender}
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

          <Box
            component="button"
            sx={{
              flexShrink: 0,
              mt: 0.5,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              px: 0.5,
              py: 0.5,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '8px',
              background: 'transparent',
              cursor: 'pointer',
              color: theme.palette.text.secondary,
              fontSize: '0.85rem',
              fontWeight: 600,
              fontFamily: 'inherit',
              transition: 'background .15s, color .15s',
              '&:hover': { borderColor: theme.palette.text.secondary, color: theme.palette.text.primary },
            }}
          >
            <EditIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>

        {/* Stats row — full width below avatar row, flush left */}
        <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2.5 }, flexWrap: 'wrap', fontSize: '0.85rem', color: theme.palette.text.secondary, mt: 2, mb: 1.5 }}>
          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.35 }}><WhatshotIcon sx={{ fontSize: 16, color: theme.palette.secondary.main }} /> <strong style={{ color: theme.palette.secondary.main }}>{kruskorScore}</strong> крускор</Box>
          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.35 }}><FitnessCenterIcon sx={{ fontSize: 16 }} /> <strong style={{ color: theme.palette.text.primary }}>{totalWorkouts}</strong> тренировок</Box>
          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.35 }}><PeopleIcon sx={{ fontSize: 16 }} /> <strong style={{ color: theme.palette.text.primary }}>{followersCount}</strong> подписчика</Box>
          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.35 }}><BookmarkIcon sx={{ fontSize: 16 }} /> <strong style={{ color: theme.palette.text.primary }}>{followingCount}</strong> подписок</Box>
        </Box>

        {/* Achievements — full width below stats, flush left */}
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', alignItems: 'center' }}>
          {visibleAchievements.map((achievement) => {
            const style = BADGE_STYLES[achievement.type] || BADGE_STYLES['primary-dark'];
            return (
              <Box
                key={achievement.name}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.35,
                  background: style.bg,
                  borderRadius: '100px',
                  px: 1.25,
                  py: 0.2,
                  fontSize: '0.75rem',
                  color: style.color,
                  fontWeight: 500,
                }}
              >
                <span>{achievement.name}</span>
              </Box>
            );
          })}
          {!showAllAchievements && hiddenCount > 0 && (
            <Box
              onClick={() => setShowAllAchievements(true)}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.04)',
                border: '1px dashed rgba(255,255,255,0.1)',
                borderRadius: '100px',
                px: 1.25,
                py: 0.2,
                fontSize: '0.72rem',
                color: theme.custom.text3,
                cursor: 'pointer',
                fontWeight: 600,
                '&:hover': { background: 'rgba(255,255,255,0.08)', color: theme.palette.text.secondary },
              }}
            >
              +{hiddenCount}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
