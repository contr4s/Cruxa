import { useState, useCallback } from 'react';
import { Box, Typography, useTheme, Tooltip } from '@mui/material';
import { Favorite, FavoriteBorder, ModeComment, Share } from '@mui/icons-material';

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
  const [animating, setAnimating] = useState(false);

  const handleLike = useCallback(() => {
    setAnimating(true);
    setLiked((prev) => !prev);
    setCount((prev) => (liked ? prev - 1 : prev + 1));
    setTimeout(() => setAnimating(false), 300);
    onLikeToggle?.();
  }, [liked, onLikeToggle]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2.5, py: 1.25 }}>
      <Box
        onClick={handleLike}
        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', userSelect: 'none', '&:hover': { opacity: 0.8 } }}
      >
        {liked ? (
          <Favorite
            sx={{
              fontSize: 20,
              color: theme.palette.error.main,
              animation: animating ? 'heartBeat 0.3s ease' : 'none',
              '@keyframes heartBeat': {
                '0%': { transform: 'scale(1)' },
                '15%': { transform: 'scale(1.3)' },
                '30%': { transform: 'scale(1)' },
                '45%': { transform: 'scale(1.15)' },
                '60%': { transform: 'scale(1)' },
              },
            }}
          />
        ) : (
          <FavoriteBorder sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
        )}
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
