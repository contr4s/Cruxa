import { Box, Typography, useTheme } from '@mui/material';
import { LocationOn, Route, People, TrendingUp } from '@mui/icons-material';
import { Card } from '../../theme/cardStyles';
import type { AdminDashboardStats } from '../../types/admin';

interface AdminGlobalStatsProps {
  stats: AdminDashboardStats;
}

export function AdminGlobalStats({ stats }: AdminGlobalStatsProps) {
  const theme = useTheme();

  const items = [
    { icon: <LocationOn sx={{ fontSize: 20, color: theme.palette.primary.main }} />, label: 'Скалодромов', value: stats.totalGyms },
    { icon: <Route sx={{ fontSize: 20, color: theme.palette.success.main }} />, label: 'Трасс всего', value: stats.totalRoutes },
    { icon: <People sx={{ fontSize: 20, color: theme.palette.secondary.main }} />, label: 'Рутсеттеров', value: stats.totalSetters },
    { icon: <TrendingUp sx={{ fontSize: 20, color: theme.palette.info.main }} />, label: 'Пролазов за месяц', value: stats.monthlyAscents.toLocaleString() },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
      {items.map((item) => (
        <Box
          key={item.label}
          sx={{ ...Card(theme), textAlign: 'center', py: 2 }}
        >
          <Box sx={{ mb: 0.5 }}>{item.icon}</Box>
          <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: theme.palette.text.primary }}>
            {item.value}
          </Typography>
          <Typography sx={{ fontSize: '0.78rem', color: theme.palette.text.secondary }}>
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
