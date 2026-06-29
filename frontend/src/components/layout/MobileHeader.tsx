import { Box, Typography, useTheme } from '@mui/material';
import { Search } from '@mui/icons-material';

export function MobileHeader() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: { xs: 'flex', md: 'none' },
        alignItems: 'center',
        justifyContent: 'space-between',
        px: '16px',
        py: '10px',
        borderBottom: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.paper,
        position: 'sticky',
        top: 0,
        zIndex: 99,
      }}
    >
      {/* Logo */}
      <Typography
        sx={{
          fontSize: '1.15rem',
          fontWeight: 800,
          color: theme.palette.primary.main,
          letterSpacing: '-.3px',
          whiteSpace: 'nowrap',
        }}
      >
        ▲ Крукса
      </Typography>

      {/* Search pill */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flex: 1,
          maxWidth: 130,
          background: theme.custom.surface2,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '20px',
          px: '14px',
          py: '8px',
          color: theme.custom.text3,
          fontSize: '0.85rem',
          cursor: 'default',
        }}
      >
        <Search sx={{ fontSize: 18, opacity: 0.6 }} />
        <Box component="span" sx={{ color: theme.custom.text3, fontSize: '0.85rem' }}>Поиск</Box>
      </Box>
    </Box>
  );
}
