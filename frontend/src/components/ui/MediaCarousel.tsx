import { useState } from 'react';
import { Box, Skeleton, useTheme } from '@mui/material';
import { BrokenImage } from '@mui/icons-material';
import { flexCenter } from '../../theme/commonStyles';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { swiperPaginationSx } from './swiperStyles';

interface MediaCarouselProps {
  images: string[];
  aspectRatio?: string;
}

type ImgState = 'loading' | 'loaded' | 'error';

export function MediaCarousel({ images, aspectRatio = '16 / 10' }: MediaCarouselProps) {
  const theme = useTheme();
  const [imgStates, setImgStates] = useState<Record<number, ImgState>>({});

  const setState = (i: number, s: ImgState) =>
    setImgStates((prev) => ({ ...prev, [i]: s }));

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
    <Box
      sx={{
        width: '100%',
        aspectRatio,
        borderRadius: `${(theme.shape.borderRadius as number) - 4}px`,
        overflow: 'hidden',
        ...swiperPaginationSx(theme),
      }}
    >
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        loop={false}
        spaceBetween={0}
        slidesPerView={1}
        style={{ width: '100%', height: '100%' }}
      >
        {images.map((src, i) => {
          const state = imgStates[i] ?? 'loading';

          return (
            <SwiperSlide key={i}>
              {state === 'error' ? (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    background: theme.custom.surface2,
                    ...flexCenter(),
                    flexDirection: 'column',
                    gap: 0.5,
                    color: theme.custom.text3,
                    fontSize: '0.82rem',
                    fontWeight: 500,
                  }}
                >
                  <BrokenImage sx={{ fontSize: 28, opacity: 0.5 }} />
                  Не удалось загрузить фото
                </Box>
              ) : (
                <>
                  {state === 'loading' && (
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      sx={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bgcolor: theme.custom.surface2,
                      }}
                    />
                  )}
                  <Box
                    component="img"
                    src={src}
                    alt={`Фото ${i + 1}`}
                    onLoad={() => setState(i, 'loaded')}
                    onError={() => setState(i, 'error')}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
}
