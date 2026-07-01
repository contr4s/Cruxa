import { Box, Typography, useTheme } from '@mui/material';
import { Edit, Star } from '@mui/icons-material';
import { Card } from '../../theme/cardStyles';
import type { GymDto } from '../../types/gym';

interface GymInfoCardProps {
  gym: GymDto;
  onEdit?: () => void;
}

export function GymInfoCard({ gym, onEdit }: GymInfoCardProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        ...Card(theme),
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2.5,
        alignItems: { xs: 'flex-start', sm: 'center' },
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: theme.custom.surface2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          flexShrink: 0,
        }}
      >
        🏔️
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: '1.15rem', fontWeight: 800, color: theme.palette.text.primary, lineHeight: 1.3 }}>
          {gym.name}
        </Typography>
        <Typography sx={{ fontSize: '0.82rem', color: theme.palette.text.secondary, mt: 0.25 }}>
          {gym.city}, {gym.address}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.75 }}>
          <Star sx={{ fontSize: 16, color: theme.palette.secondary.main }} />
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: theme.palette.text.primary }}>
            {gym.rating.toFixed(1)}
          </Typography>
          <Typography sx={{ fontSize: '0.78rem', color: theme.custom.text3 }}>
            · {gym.activeRouteCount} активных трасс
          </Typography>
        </Box>
      </Box>
      {onEdit && (
        <Box
          onClick={onEdit}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1.5,
            py: 0.75,
            borderRadius: 1,
            background: theme.custom.surface2,
            color: theme.palette.text.secondary,
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 600,
            flexShrink: 0,
            '&:hover': { background: theme.custom.surface3, color: theme.palette.text.primary },
          }}
        >
          <Edit sx={{ fontSize: 16 }} />
          Редактировать
        </Box>
      )}
    </Box>
  );
}
