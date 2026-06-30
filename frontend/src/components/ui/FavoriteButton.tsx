import { useState, useCallback } from 'react';
import { IconButton } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: number;
}

export function FavoriteButton({ isFavorite, onToggle, size = 20 }: FavoriteButtonProps) {
  const [animating, setAnimating] = useState(false);

  const handleClick = useCallback(() => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
    onToggle();
  }, [onToggle]);

  return (
    <IconButton
      onClick={handleClick}
      size="small"
      sx={{ p: 0.5 }}
      aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      {isFavorite ? (
        <Favorite
          sx={{
            fontSize: size,
            color: (theme) => theme.palette.error.main,
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
        <FavoriteBorder
          sx={{
            fontSize: size,
            color: (theme) => theme.palette.text.secondary,
          }}
        />
      )}
    </IconButton>
  );
}
