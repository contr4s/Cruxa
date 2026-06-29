import { Box, useTheme } from '@mui/material';
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

export function MediaCarousel({ images, aspectRatio = '16 / 10' }: MediaCarouselProps) {
  const theme = useTheme();

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
        {images.map((_src, i) => (
          <SwiperSlide key={i}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                background: theme.custom.surface2,
                ...flexCenter(),
                color: theme.custom.text3,
                fontSize: '0.85rem',
                fontWeight: 500,
              }}
            >
              📷 Фото {i + 1}
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
