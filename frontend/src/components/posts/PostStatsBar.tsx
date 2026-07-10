import { Box, Typography, useTheme } from '@mui/material';
import { Whatshot, TrendingUp, Timer } from '@mui/icons-material';
import { statsBar } from '../../theme/commonStyles';

interface PostStatsBarProps {
  deltaKruskor: number;
  avgGrade: string;
  duration?: number;
}

export function PostStatsBar({ deltaKruskor, avgGrade, duration }: PostStatsBarProps) {
  const theme = useTheme();
  const hours = duration ? Math.floor(duration / 60) : 0;
  const minutes = duration ? duration % 60 : 0;
  const timeStr = duration ? `${hours}ч ${minutes}м` : '';

  return (
    <Box sx={{ ...statsBar(theme), display: 'flex', gap: 2.5, px: 2.5, py: 1.25 }}>
      <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: theme.palette.primary.main, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Whatshot sx={{ fontSize: 16 }} /> {deltaKruskor >= 0 ? '+' : ''}{deltaKruskor.toFixed(1)}
      </Typography>
      <Typography sx={{ fontSize: '0.82rem', color: theme.palette.text.secondary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <TrendingUp sx={{ fontSize: 16 }} /> Ср. грейд: {avgGrade}
      </Typography>
      {timeStr && (
        <Typography sx={{ fontSize: '0.82rem', color: theme.palette.text.secondary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Timer sx={{ fontSize: 16 }} /> {timeStr}
        </Typography>
      )}
    </Box>
  );
}
