import { useState, useCallback } from 'react';
import { Box, Typography, useTheme, Tooltip } from '@mui/material';
import { ModeComment, Share } from '@mui/icons-material';
import { FavoriteButton } from '../ui/FavoriteButton';

interface PostActionsProps {
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  onLikeToggle?: () => void;
  onCommentClick?: () => void;
}

export function PostActions({ isLiked, likesCount, commentsCount, onLikeToggle, onCommentClick }: PostActionsProps) {
  const theme = useTheme();
  const [liked, setLiked] = useState(isLiked);
  const [count, setCount] = useState(likesCount);

  const handleLike = useCallback(() => {
    setLiked((prev) => !prev);
    setCount((prev) => (liked ? prev - 1 : prev + 1));
    onLikeToggle?.();
  }, [liked, onLikeToggle]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2.5, py: 1.25 }}>
      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', userSelect: 'none', '&:hover': { opacity: 0.8 } }}
      >
        <FavoriteButton isFavorite={liked} onToggle={handleLike} size={20} />
        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: liked ? theme.palette.error.main : theme.palette.text.secondary }}>
          {count}
        </Typography>
      </Box>
      <Box
        onClick={onCommentClick}
        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
      >
        <ModeComment sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: theme.palette.text.secondary }}>
          {commentsCount}
        </Typography>
      </Box>
      <Tooltip title="Скоро">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto', cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
          <Share sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
          <Typography sx={{ fontSize: '0.78rem', color: theme.palette.text.secondary }}>Поделиться</Typography>
        </Box>
      </Tooltip>
    </Box>
  );
}
