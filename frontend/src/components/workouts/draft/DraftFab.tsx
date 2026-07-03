import { Box } from '@mui/material';
import { Add, FitnessCenter } from '@mui/icons-material';
import { useDraftStore } from '../../../stores/draftWorkoutStore';

interface DraftFabProps {
  /** Callback when idle — «Начать тренировку» */
  onStart: () => void;
  /** Callback when active — «Добавить трассу» */
  onAddAscent: () => void;
  /** Optional: if set, FAB shows «Добавить трассу» only when gym matches */
  activeGymId?: string;
}

export function DraftFab({ onStart, onAddAscent, activeGymId }: DraftFabProps) {
  const { status, gymId } = useDraftStore();

  const isActive = status === 'active' && (!activeGymId || gymId === activeGymId);

  return (
    <Box
      component="button"
      onClick={isActive ? onAddAscent : onStart}
      sx={{
        position: 'fixed',
        bottom: status === 'active'
          ? { xs: '112px', md: '72px' }
          : { xs: '100px', md: '28px' },
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
        background: isActive
          ? 'rgba(255,179,0,0.88)'
          : 'rgba(38,166,154,0.88)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        color: '#000',
        fontWeight: 700,
        fontSize: '0.95rem',
        cursor: 'pointer',
        boxShadow: isActive
          ? '0 4px 16px rgba(255,179,0,0.4)'
          : '0 4px 16px rgba(38,166,154,0.4)',
        transition: 'transform .15s, box-shadow .15s, background .15s',
        lineHeight: 1,
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: isActive
            ? '0 6px 24px rgba(255,179,0,0.5)'
            : '0 6px 24px rgba(38,166,154,0.5)',
        },
        '&:active': { transform: 'translateY(0)' },
      }}
    >
      {isActive
        ? <Add sx={{ fontSize: '1.3rem' }} />
        : <FitnessCenter sx={{ fontSize: '1.3rem' }} />
      }
      <Box component="span" sx={{ whiteSpace: 'nowrap', display: { xs: 'none', md: 'inline' } }}>
        {isActive ? 'Добавить трассу' : 'Начать тренировку'}
      </Box>
    </Box>
  );
}
