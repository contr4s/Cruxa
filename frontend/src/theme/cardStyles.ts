import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/system';

/**
 * Константы дизайн-системы для карточек дашборда
 */
export const CARD = {
  sectionTitle: '1.1rem',
  sectionTitleWeight: 700 as const,
  subsectionTitle: '0.95rem',
  spacing: 2.5,
  iconSize: 20,
  iconInlineSize: 18,
} as const;

/**
 * Единый стиль заголовка секции карточки дашборда
 */
export function sectionTitleSx(theme: Theme): SxProps {
  return {
    fontSize: CARD.sectionTitle,
    fontWeight: CARD.sectionTitleWeight,
    color: theme.palette.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: 0.75,
    mb: 2,
  };
}

/**
 * Единый стиль карточки.
 * Все карточки используют одинаковый background, border, radius.
 */
export function Card(theme: Theme): SxProps {
  return {
    background: theme.palette.background.paper,
    borderRadius: `${theme.shape.borderRadius}px`,
    p: CARD.spacing,
    border: `1px solid ${theme.palette.divider}`,
    transition: 'transform .2s ease, box-shadow .2s ease, border-color .2s ease',
    height: 'fit-content',
  };
}

/**
 * Стиль Select-фильтра для графиков (CombinedChart, RadarChart и т.д.)
 */
export function filterSelectStyle(theme: Theme) {
  return {
    background: theme.custom.surface2,
    color: theme.palette.text.secondary,
    fontSize: '0.78rem',
    fontWeight: 600,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 1,
    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
    '& .MuiSvgIcon-root': { color: theme.custom.text3 },
    '&:hover': {
      boxShadow: '0 6px 20px rgba(0,0,0,.35)',
      borderColor: theme.palette.primary.main,
    },
  };
}
