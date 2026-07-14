import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
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
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          mt: 3,
          color: 'text.secondary',
          textAlign: 'center',
          fontSize: '.7rem',
          lineHeight: 1.5,
          opacity: 0.7,
        }}
      >
        Данные по скалодромам —{' '}
        <a
          href="https://climbingpro.ru"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'underline' }}
        >
          climbingpro.ru
        </a>
        .
        <br />
        Активность и трассы — сгенерированы.{' '}
        <br />
        <a
          href="https://github.com/contr4s/Cruxa/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'underline' }}
        >
          Сообщить об ошибке
        </a>
      </Typography>
    </Box>
  );
}
