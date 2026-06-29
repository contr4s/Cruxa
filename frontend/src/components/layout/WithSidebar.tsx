import type { ReactNode } from 'react';
import { Box } from '@mui/material';

interface WithSidebarProps {
  children: ReactNode;
  sidebar: ReactNode;
}

/**
 * Двухколоночный лейаут страницы.
 * Основная колонка ограничена maxWidth: 720, сайдбар фиксирован (sticky).
 * Паддинги задаёт PageContainer снаружи.
 */
export function WithSidebar({ children, sidebar }: WithSidebarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 3,
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Box sx={{ flex: 1, maxWidth: 720, width: '100%', minWidth: 0 }}>
        {children}
      </Box>
      <Box
        component="aside"
        sx={{ width: 260, display: { xs: 'none', lg: 'block' }, flexShrink: 0, alignSelf: 'flex-start', position: 'sticky', top: 16 }}
      >
        {sidebar}
      </Box>
    </Box>
  );
}
