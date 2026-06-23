import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import type { SxProps } from '@mui/system';

interface PageContainerProps {
  children: ReactNode;
  sx?: SxProps;
}

/**
 * Единая обёртка страниц дашборда.
 * Центрирует контент (maxWidth: 960), задаёт отступы с учётом
 * мобильного BottomTabBar (pb под зазор) и мобильные паддинги.
 */
export function PageContainer({ children, sx }: PageContainerProps) {
  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2.5 },
        pb: { xs: '90px', md: 2.5 },
        maxWidth: 960,
        mx: 'auto',
        width: '100%',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
