import { Box, Avatar, Typography, useTheme, IconButton } from '@mui/material';
import { LocationOn, Public, Lock, People, Edit, Delete, LocalFireDepartment } from '@mui/icons-material';
import { getGymBadgeColor } from '../../constants/gymBadges';
import { relativeTime } from './relativeTime';
import type { ReactNode } from 'react';

interface PostHeaderProps {
  avatar?: string;
  displayName: string;
  gymName?: string;
  gymId?: string;
  visibility?: 'Public' | 'Followers' | 'Private';
  isOwner?: boolean;
  isRecommended?: boolean;
  createdAt: string;
  onEdit?: () => void;
  onDelete?: () => void;
  mediaToggle?: ReactNode;
}

export function PostHeader({ displayName, gymName, visibility, isOwner, isRecommended, createdAt, onEdit, onDelete, mediaToggle }: PostHeaderProps) {
  const theme = useTheme();
  const initial = displayName.charAt(0).toUpperCase();
  const gymColor = gymName ? getGymBadgeColor(gymName) : undefined;

  const visibilityIcon = visibility === 'Private' ? <Lock sx={{ fontSize: 14 }} /> : visibility === 'Followers' ? <People sx={{ fontSize: 14 }} /> : <Public sx={{ fontSize: 14 }} />;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, pt: 2, pb: 1.5 }}>
        <Avatar sx={{ width: 36, height: 36, fontSize: '0.95rem', bgcolor: theme.palette.primary.main }}>
          {initial}
        </Avatar>
        <Box sx={{ flex: '0 1 auto', minWidth: 0 }}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: theme.palette.text.primary }}>
            {displayName}
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: theme.palette.text.secondary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {relativeTime(createdAt)}
            {gymName && gymColor && (
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.3, background: `${gymColor}22`, color: gymColor, borderRadius: '100px', px: 1, py: 0.15, fontSize: '0.65rem', fontWeight: 700 }}>
                <LocationOn sx={{ fontSize: 10 }} /> {gymName}
              </Box>
            )}
          </Typography>
        </Box>
        {mediaToggle && (
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', mx: 'auto' }}>
            {mediaToggle}
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, flexShrink: 0, ml: 'auto' }}>
          {visibility && (
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.3, px: 0.75, py: 0.2, borderRadius: 1, bgcolor: theme.custom.surface2, fontSize: '0.65rem', color: theme.palette.text.secondary }}>
              {visibilityIcon} {visibility === 'Public' ? 'Public' : visibility === 'Followers' ? 'Followers' : 'Private'}
            </Box>
          )}
          {isOwner && (
            <>
              <IconButton size="small" onClick={onEdit} sx={{ color: theme.palette.text.secondary }}>
                <Edit sx={{ fontSize: 16 }} />
              </IconButton>
              <IconButton size="small" onClick={onDelete} sx={{ color: theme.palette.text.secondary }}>
                <Delete sx={{ fontSize: 16 }} />
              </IconButton>
            </>
          )}
        </Box>
      </Box>
      {isRecommended && (
        <Box sx={{ px: 2.5, pb: 1 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 1, py: 0.25, borderRadius: '100px', bgcolor: `${theme.palette.warning.main}22`, color: theme.palette.warning.main, fontSize: '0.7rem', fontWeight: 700 }}>
            <LocalFireDepartment sx={{ fontSize: 12, mr: 0.3 }} /> Похожие трассы
          </Box>
        </Box>
      )}
    </Box>
  );
}
