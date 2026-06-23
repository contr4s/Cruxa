import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/system';

/**
 * Утилита: flex-центрирование
 */
export function flexCenter(sx?: SxProps): SxProps {
  return { display: 'flex', alignItems: 'center', justifyContent: 'center', ...sx };
}

/**
 * Дефолтный divider-бордер (1px solid)
 */
export function dividerBorder(theme: Theme): SxProps {
  return { border: `1px solid ${theme.palette.divider}` };
}

/**
 * Верхний divider-бордер
 */
export function dividerBorderTop(theme: Theme): SxProps {
  return { borderTop: `1px solid ${theme.palette.divider}` };
}

/**
 * Ховер-эффект поверхностью surface2
 */
export function hoverSurface2(sx?: SxProps): SxProps {
  return { '&:hover': { background: (theme: Theme) => theme.custom.surface2, ...sx } };
}

/**
 * Текст с многоточием при переполнении
 */
export function textEllipsis(sx?: SxProps): SxProps {
  return {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    ...sx,
  };
}

/**
 * Цветная точка-индикатор (для hold colors, легенды)
 */
export function colorDot(size: number = 14): SxProps {
  return {
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
  };
}

/**
 * Бейдж стиля пролаза (цветной фон, белый текст, скруглённый)
 */
export function ascentBadgeStyle(bgColor: string): SxProps {
  return {
    px: 0.75,
    py: 0.15,
    borderRadius: '10px',
    fontSize: '0.6rem',
    fontWeight: 600,
    background: bgColor,
    color: '#fff',
  };
}

/**
 * Маленькая иконка-кнопка (навигация по месяцам и т.д.)
 */
export function smallIconButton(theme: Theme): SxProps {
  return {
    background: theme.custom.surface2,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 1,
    color: theme.palette.text.secondary,
    width: 26,
    height: 26,
    '&:hover': {
      background: theme.custom.surface3,
      color: theme.palette.text.primary,
    },
  };
}

/**
 * Статистическая строка (тёмный фон + верхний бордер)
 */
export function statsBar(theme: Theme): SxProps {
  return {
    display: 'flex',
    gap: 2,
    px: 2,
    py: 1,
    borderTop: `1px solid ${theme.palette.divider}`,
    background: theme.custom.surface2,
  };
}

/**
 * Респонсивная двухколоночная сетка (→ 1 колонка на мобилках)
 */
export function responsiveGrid(): SxProps {
  return {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 2,
    '@media (max-width:768px)': { gridTemplateColumns: '1fr' },
  };
}

/**
 * Аватар с инициалом (круг, primary фон)
 */
export function avatarInitial(size: number = 28): SxProps {
  return {
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: (theme: Theme) => theme.palette.primary.main,
    color: '#fff',
    fontWeight: 700,
    fontSize: `${size * 0.35}px`,
    flexShrink: 0,
  };
}
