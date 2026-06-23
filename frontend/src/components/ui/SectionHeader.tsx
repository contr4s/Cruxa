import type { ReactNode } from 'react';
import { Box, Typography, useTheme } from '@mui/material';

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  action?: ReactNode;
}

/**
 * Единый заголовок секции карточки дашборда.
 * Принимает иконку слева, заголовок и опциональный action (Select, кнопка) справа.
 */
export function SectionHeader({ icon, title, action }: SectionHeaderProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 2,
        flexWrap: 'wrap',
        gap: 1,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: theme.palette.text.primary,
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
        }}
      >
        {icon && (
          <Box component="span" sx={{ display: 'flex', lineHeight: 0 }}>
            {icon}
          </Box>
        )}
        {title}
      </Typography>
      {action && <Box sx={{ display: 'flex', gap: 1 }}>{action}</Box>}
    </Box>
  );
}
