import { type ReactNode, useState } from 'react';
import { Box, Collapse, IconButton, Typography, useTheme } from '@mui/material';
import { ExpandMore, ExpandLess, FilterList } from '@mui/icons-material';

interface CollapsibleFilterBarProps {
  children: ReactNode;
  activeCount?: number;
  /** Кастомный триггер вместо стандартного. Получает { open, toggle, activeCount } */
  trigger?: (bag: { open: boolean; toggle: () => void; activeCount: number }) => ReactNode;
}

export function CollapsibleFilterBar({ children, activeCount = 0, trigger }: CollapsibleFilterBarProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((p) => !p);

  return (
    <Box sx={{ mb: 0.5 }}>
      {trigger ? (
        trigger({ open, toggle, activeCount })
      ) : (
        <Box
          onClick={toggle}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            color: theme.palette.text.secondary,
            fontSize: '0.78rem',
            fontWeight: 600,
            userSelect: 'none',
            '&:hover': { color: theme.palette.text.primary },
          }}
        >
          <FilterList sx={{ fontSize: 18 }} />
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: 'inherit' }}>Фильтры и сортировка</Typography>
          {activeCount > 0 && (
            <Box sx={{ background: theme.palette.primary.main, color: '#fff', borderRadius: '10px', px: 0.75, py: 0.1, fontSize: '0.65rem', fontWeight: 700, lineHeight: 1.4 }}>
              {activeCount}
            </Box>
          )}
          <IconButton size="small" sx={{ ml: 0.5, color: 'inherit' }}>{open ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}</IconButton>
        </Box>
      )}
      <Collapse in={open}>
        <Box
          sx={{
            mt: 0.5,
            p: 1.5,
            borderRadius: `${theme.shape.borderRadius}px`,
            border: `1px solid ${theme.palette.divider}`,
            background: theme.palette.background.paper,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'flex-end',
          }}
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  );
}
