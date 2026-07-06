import { useState, type ReactNode } from 'react';
import {
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

interface FilterSheetProps {
  children: ReactNode;
}

export function FilterSheet({ children }: FilterSheetProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((v) => !v);

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={toggle} size="small" sx={{ color: theme.palette.text.secondary }}>
          <FilterListIcon />
        </IconButton>
      </Box>
      <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minHeight: 200,
            maxHeight: '70vh',
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Drawer>
    </>
  );
}
