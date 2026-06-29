import type { ReactNode } from 'react';
import { Box, Typography, useTheme } from '@mui/material';

interface ChartSlideProps {
  icon?: ReactNode;
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

/**
 * Обёртка для каждого слайда карусели графиков.
 * Отображает иконку + заголовок вверху, опциональный action (например, селектор),
 * и контент (график) снизу.
 */
export function ChartSlide({ icon, title, action, children }: ChartSlideProps) {
  const theme = useTheme();
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, px: 2 }}>
        {icon && <Box sx={{ display: 'flex', color: theme.palette.primary.main }}>{icon}</Box>}
        <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: theme.palette.text.primary }}>
          {title}
        </Typography>
        {action && <Box sx={{ ml: 'auto' }}>{action}</Box>}
      </Box>
      {children}
    </Box>
  );
}
