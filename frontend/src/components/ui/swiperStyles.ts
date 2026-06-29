import type { Theme } from '@mui/material';

/** Единый стиль Swiper-pagination для каруселей (медиа и графики) */
export function swiperPaginationSx(theme: Theme): Record<string, object> {
  return {
    '& .swiper-pagination-bullet': {
      bgcolor: theme.palette.text.secondary,
      opacity: 0.4,
      width: 8,
      height: 8,
      borderRadius: 4,
      transition: 'all .2s',
      '&-active': {
        bgcolor: theme.palette.primary.main,
        opacity: 1,
        width: 20,
      },
    },
  };
}
