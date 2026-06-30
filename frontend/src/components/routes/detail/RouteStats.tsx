import { Box, Typography, useTheme } from '@mui/material';
import { FitnessCenter, Star, HowToVote } from '@mui/icons-material';
import type { RouteDto, GradeConsensus } from '../../../types/route';
import { Card } from '../../../theme/cardStyles';

interface RouteStatsProps {
  route: RouteDto;
  consensus?: GradeConsensus | null;
}

export function RouteStats({ route, consensus }: RouteStatsProps) {
  const theme = useTheme();

  const stats = [
    {
      icon: <FitnessCenter sx={{ fontSize: 20, color: theme.palette.primary.main }} />,
      label: 'Пролазов',
      value: String(route.ascentsCount),
    },
    {
      icon: <Star sx={{ fontSize: 20, color: theme.palette.secondary.main }} />,
      label: 'Рейтинг',
      value: route.rating.toFixed(1),
    },
    {
      icon: <HowToVote sx={{ fontSize: 20, color: theme.palette.primary.light }} />,
      label: 'Консенсус',
      value: consensus?.consensusGrade ?? route.grade,
    },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: { xs: 1, sm: 2 } }}>
      {stats.map((s) => (
        <Box
          key={s.label}
          sx={{
            ...Card(theme),
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.75, sm: 1.5 },
            p: { xs: 1, sm: 2.5 },
          }}
        >
          <Box sx={{ fontSize: 0 }}>{s.icon}</Box>
          <Box>
            <Typography sx={{ fontSize: { xs: '0.6rem', sm: '0.68rem' }, color: theme.palette.text.secondary, fontWeight: 600 }}>
              {s.label}
            </Typography>
            <Typography sx={{ fontSize: { xs: '0.85rem', sm: '1.1rem' }, fontWeight: 800, color: theme.palette.text.primary }}>
              {s.value}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
