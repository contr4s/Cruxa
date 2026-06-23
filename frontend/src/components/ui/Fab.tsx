import { Box } from '@mui/material';
import type { SxProps } from '@mui/system';

interface FabProps {
  onClick: () => void;
  label?: string;
  sx?: SxProps;
}

export function Fab({ onClick, label = 'Новая тренировка', sx }: FabProps) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        position: 'fixed',
        bottom: { xs: '100px', md: '28px' },
        right: '28px',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        px: { xs: 0, md: '24px' },
        py: { xs: 0, md: '14px' },
        width: { xs: 52, md: 'auto' },
        height: { xs: 52, md: 'auto' },
        border: 'none',
        borderRadius: { xs: '50%', md: '50px' },
        background: 'rgba(38,166,154,0.88)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        color: '#000',
        fontWeight: 700,
        fontSize: '0.95rem',
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(38,166,154,0.4)',
        transition: 'transform .15s, box-shadow .15s',
        lineHeight: 1,
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 24px rgba(38,166,154,0.5)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        ...sx,
      }}
    >
      <Box sx={{ fontSize: '1.3rem', lineHeight: 1 }}>＋</Box>
      <Box
        component="span"
        sx={{
          whiteSpace: 'nowrap',
          display: { xs: 'none', md: 'inline' },
        }}
      >
        {label}
      </Box>
    </Box>
  );
}
