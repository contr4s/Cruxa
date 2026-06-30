import { Box } from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getGymStyle } from '../../constants/gymPalette';

interface GymChipProps {
  name: string;
  gymId?: string;
}

/**
 * Цветной бейдж зала с иконкой локации.
 * Цвет детерминирован по названию зала.
 */
export function GymChip({ name, gymId }: GymChipProps) {
  const navigate = useNavigate();
  const gs = getGymStyle(name);

  return (
    <Box
      onClick={gymId ? (e: React.MouseEvent) => { e.stopPropagation(); navigate(`/gyms/${gymId}`); } : undefined}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.375,
        px: 1,
        py: 0.25,
        borderRadius: '12px',
        fontSize: '0.65rem',
        fontWeight: 600,
        background: gs.bg,
        color: '#fff',
        maxWidth: 140,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        cursor: gymId ? 'pointer' : 'default',
        transition: 'filter .15s, box-shadow .15s',
        '&:hover': gymId ? {
          filter: 'brightness(1.15)',
          boxShadow: `0 0 10px 1px ${gs.glow}`,
        } : undefined,
      }}
    >
      <LocationOn sx={{ fontSize: 12 }} />
      {name}
    </Box>
  );
}
