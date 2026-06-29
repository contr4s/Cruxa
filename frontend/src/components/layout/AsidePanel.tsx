import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import type { SxProps } from '@mui/system';

interface AsidePanelProps {
  children: ReactNode;
  sx?: SxProps;
}

/**
 * Боковая панель с дополнительным контентом (рекомендации, статистика).
 * Фиксируется при скролле (sticky), скрывается на мобилках.
 */
export function AsidePanel({ children, sx }: AsidePanelProps) {
  return (
    <Box
      component="aside"
      sx={{
        width: 260,
        display: { xs: 'none', lg: 'block' },
        flexShrink: 0,
        alignSelf: 'flex-start',
        position: 'sticky',
        top: 16,
        '& > * + *': { mt: 2 },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
