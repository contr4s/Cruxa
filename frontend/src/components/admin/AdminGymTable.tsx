import { Box, Typography, useTheme } from '@mui/material';
import { Card } from '../../theme/cardStyles';
import { GymChip } from '../ui/GymChip';
import { RatingBadge } from '../ui/RatingBadge';
import { GymBadge } from '../ui/GymBadge';
import type { AdminGymItem } from '../../types/admin';

interface AdminGymTableProps {
  gyms: AdminGymItem[];
  onManage: (id: string) => void;
  onSort?: (field: string) => void;
}

const STATUS_STYLE: Record<string, { bg: string; label: string }> = {
  Active: { bg: '#2E7D32', label: 'Active' },
  Pending: { bg: '#424242', label: 'Pending' },
  Blocked: { bg: '#C62828', label: 'Blocked' },
};

export function AdminGymTable({ gyms, onManage, onSort }: AdminGymTableProps) {
  const theme = useTheme();

  const thSx = {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: theme.palette.text.secondary,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    pb: 1.5,
    borderBottom: `1px solid ${theme.palette.divider}`,
  };

  const sortableThSx = (field: string) => ({
    ...thSx,
    cursor: 'pointer',
    '&:hover': { color: theme.palette.text.primary },
    '& .sort-icon': { opacity: 0.3, ml: 0.25 },
    '&:hover .sort-icon': { opacity: 0.7 },
  });

  return (
    <Box sx={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <Box sx={{ minWidth: 700 }}>
        {/* Table header */}
        <Box sx={{ display: 'flex', px: 0.5, mb: 0.5 }}>
          <Box sx={{ flex: '2 0 0', ...(onSort ? sortableThSx('name') : thSx) }} onClick={() => onSort?.('name')}>
            Зал <span className="sort-icon">↕</span>
          </Box>
          <Box sx={{ flex: '1 0 0', ...thSx }}>Город</Box>
          <Box sx={{ flex: '0.6 0 0', textAlign: 'center', ...(onSort ? sortableThSx('routes') : thSx) }} onClick={() => onSort?.('routes')}>
            Трасс <span className="sort-icon">↕</span>
          </Box>
          <Box sx={{ flex: '0.9 0 0', textAlign: 'center', ...thSx }}>Рутсеттеров</Box>
          <Box sx={{ flex: '0.7 0 0', textAlign: 'center', ...(onSort ? sortableThSx('rating') : thSx) }} onClick={() => onSort?.('rating')}>
            Рейтинг <span className="sort-icon">↕</span>
          </Box>
          <Box sx={{ flex: '1 0 0', textAlign: 'right', ...(onSort ? sortableThSx('ascents') : thSx) }} onClick={() => onSort?.('ascents')}>
            Пролазов/мес <span className="sort-icon">↕</span>
          </Box>
          <Box sx={{ flex: '0.7 0 0', textAlign: 'center', ...thSx }}>Статус</Box>
          <Box sx={{ flex: '0.8 0 0', textAlign: 'right', ...thSx }}>Действия</Box>
        </Box>

        {/* Rows */}
        {gyms.map((gym) => {
          const st = STATUS_STYLE[gym.status];
          return (
            <Box
              key={gym.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 0.5,
                py: 1.25,
                borderBottom: `1px solid ${theme.palette.divider}`,
                fontSize: '0.82rem',
                '&:hover': { bgcolor: theme.custom.surface2, borderRadius: 1 },
              }}
            >
              <Box sx={{ flex: '2 0 0' }}>
                <Typography sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: '0.82rem' }}>
                  {gym.name}
                </Typography>
              </Box>
              <Box sx={{ flex: '1 0 0', color: theme.palette.text.secondary, fontSize: '0.82rem' }}>
                {gym.city}
              </Box>
              <Box sx={{ flex: '0.6 0 0', textAlign: 'center', fontWeight: 600, color: theme.palette.text.primary }}>
                {gym.routeCount}
              </Box>
              <Box sx={{ flex: '0.9 0 0', textAlign: 'center', color: theme.palette.text.secondary }}>
                {gym.setterCount}
              </Box>
              <Box sx={{ flex: '0.7 0 0', textAlign: 'center' }}>
                <RatingBadge rating={gym.rating} />
              </Box>
              <Box sx={{ flex: '1 0 0', textAlign: 'right', color: theme.palette.text.primary, fontWeight: 600 }}>
                {gym.monthlyAscents.toLocaleString()}
              </Box>
              <Box sx={{ flex: '0.7 0 0', textAlign: 'center' }}>
                <GymBadge label={st.label} sx={{ bgcolor: st.bg, color: '#fff' }} />
              </Box>
              <Box sx={{ flex: '0.8 0 0', textAlign: 'right' }}>
                <Box
                  component="button"
                  onClick={() => onManage(gym.id)}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    border: `1px solid ${theme.palette.divider}`,
                    background: 'transparent',
                    color: theme.palette.text.secondary,
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    '&:hover': { borderColor: theme.palette.text.primary, color: theme.palette.text.primary },
                  }}
                >
                  Управлять
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
