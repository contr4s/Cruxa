import { Box, Typography, useTheme } from '@mui/material';
import { BarChart, Whatshot, AccessTime } from '@mui/icons-material';

interface WeekStatsProps {
  workouts: number;
  ascents: number;
  kruscor: number;
  hours: string;
}

export function WeekStats({ workouts, ascents, kruscor, hours }: WeekStatsProps) {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 2 }}>
      <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', mb: 1.5, color: theme.palette.text.primary, display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <BarChart sx={{ fontSize: 16 }} /> На этой неделе
      </Typography>
      <StatRow label="Тренировок" value={workouts} />
      <StatRow label="Пройдено трасс" value={ascents} />
      <StatRow label="Крускор" value={`+${kruscor}`} color={theme.palette.primary.main} icon={<Whatshot sx={{ fontSize: 14 }} />} />
      <StatRow label="Часов в зале" value={hours} icon={<AccessTime sx={{ fontSize: 14 }} />} />
    </Box>
  );
}

function StatRow({ label, value, color, icon }: { label: string; value: string | number; color?: string; icon?: React.ReactNode }) {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.6 }}>
      <Typography sx={{ fontSize: '0.8rem', color: theme.palette.text.secondary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {icon}{label}
      </Typography>
      <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: color || theme.palette.text.primary }}>
        {value}
      </Typography>
    </Box>
  );
}
