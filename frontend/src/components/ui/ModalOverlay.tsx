import type { ReactNode } from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import { Close } from '@mui/icons-material';

interface ModalOverlayProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: number;
}

/**
 * Общий компонент модального окна.
 * Используется для PostDetailPage, RouteDetailPage и т.д.
 * Рендерит overlay с тёмным фоном, крестиком закрытия и скроллом контента.
 */
export function ModalOverlay({ open, onClose, children, maxWidth = 990 }: ModalOverlayProps) {
  const theme = useTheme();
  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(0,0,0,0.85)',
        p: { xs: 0, sm: 2 },
      }}
      onClick={onClose}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth,
          maxHeight: { xs: '100vh', sm: '90vh' },
          height: '100%',
          bgcolor: 'background.paper',
          borderRadius: { xs: 0, sm: 2 },
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 10,
            color: '#fff',
            bgcolor: 'rgba(0,0,0,0.4)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
          }}
        >
          <Close />
        </IconButton>
        <Box sx={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
