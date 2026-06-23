import { Box, CircularProgress, useTheme } from '@mui/material';
import type { ReactNode } from 'react';

interface LazyCardProps {
  /** Показывает лоадер поверх контента, если true */
  loading?: boolean;
  /** Контент карточки */
  children: ReactNode;
  /** Минимальная высота в px */
  minHeight?: number;
}

/**
 * Обёртка для карточки с ленивой загрузкой.
 * Всегда рендерит children (карточка с графиком всегда смонтирована),
 * а поверх накладывает спиннер пока loading=true.
 */
export function LazyCard({ loading, children, minHeight = 280 }: LazyCardProps) {
  const theme = useTheme();

  return (
    <Box sx={{ position: 'relative', minHeight: loading ? minHeight : undefined }}>
      {children}
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: theme.palette.background.paper,
            borderRadius: `${theme.shape.borderRadius}px`,
            zIndex: 1,
          }}
        >
          <CircularProgress size={24} sx={{ color: theme.custom?.text3 ?? '#757575' }} />
        </Box>
      )}
    </Box>
  );
}
