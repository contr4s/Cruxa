import { useState } from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import { flexCenter } from '../../theme/commonStyles';

interface MediaCarouselProps {
  images: string[];
  aspectRatio?: string;
}

export function MediaCarousel({ images, aspectRatio = '16 / 10' }: MediaCarouselProps) {
  const theme = useTheme();
  const [current, setCurrent] = useState(0);

  if (images.length === 0) {
    return (
      <Box
        sx={{
          aspectRatio,
          background: theme.custom.surface2,
          borderRadius: `${(theme.shape.borderRadius as number) - 4}px`,
          ...flexCenter(),
          color: theme.custom.text3,
          fontSize: '0.85rem',
        }}
      >
        Нет фото
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden', borderRadius: `${(theme.shape.borderRadius as number) - 4}px` }}>
      <Box
        sx={{
          display: 'flex',
          transition: 'transform .4s ease',
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {images.map((_src, i) => (
          <Box
            key={i}
            sx={{
              minWidth: '100%',
              aspectRatio,
              background: theme.custom.surface2,
              ...flexCenter(),
              color: theme.custom.text3,
              fontSize: '0.85rem',
              fontWeight: 500,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Placeholder for real images */}
            <Box sx={{ position: 'absolute', inset: 0, ...flexCenter() }}>
              📷 Фото {i + 1}
            </Box>
          </Box>
        ))}
      </Box>

      {images.length > 1 && (
        <>
          <IconButton
            onClick={() => setCurrent((p) => Math.max(0, p - 1))}
            disabled={current === 0}
            size="small"
            sx={{
              position: 'absolute',
              left: 4,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,.5)',
              color: '#fff',
              '&:hover': { background: 'rgba(0,0,0,.7)' },
              '&.Mui-disabled': { opacity: 0.3 },
            }}
          >
            ‹
          </IconButton>

          <IconButton
            onClick={() => setCurrent((p) => Math.min(images.length - 1, p + 1))}
            disabled={current === images.length - 1}
            size="small"
            sx={{
              position: 'absolute',
              right: 4,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,.5)',
              color: '#fff',
              '&:hover': { background: 'rgba(0,0,0,.7)' },
              '&.Mui-disabled': { opacity: 0.3 },
            }}
          >
            ›
          </IconButton>

          {/* Dots */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 0.5,
            }}
          >
            {images.map((_, i) => (
              <Box
                key={i}
                onClick={() => setCurrent(i)}
                sx={{
                  width: i === current ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === current ? theme.palette.primary.main : 'rgba(255,255,255,.4)',
                  transition: 'all .2s',
                  cursor: 'pointer',
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
