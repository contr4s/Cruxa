import { Box, Typography, useTheme } from '@mui/material';
import { Whatshot, Star, NewReleases } from '@mui/icons-material';
import { Card } from '../../theme/cardStyles';
import type { QuickOverview } from '../../types/routesetter';

interface QuickOverviewProps {
  overview: QuickOverview;
}

export function QuickOverview({ overview }: QuickOverviewProps) {
  const theme = useTheme();

  const columns = [
    {
      icon: <Whatshot sx={{ fontSize: 18, color: theme.palette.primary.main }} />,
      label: 'Самый популярный',
      value: overview.mostPopularRoute
        ? `${overview.mostPopularRoute.name} (${overview.mostPopularRoute.grade})`
        : '—',
      sub: overview.mostPopularRoute ? `${overview.mostPopularRoute.ascentsCount} пролазов` : '',
    },
    {
      icon: <Star sx={{ fontSize: 18, color: theme.palette.secondary.main }} />,
      label: 'Самый рейтинговый',
      value: overview.highestRatedRoute
        ? `${overview.highestRatedRoute.name} (${overview.highestRatedRoute.grade})`
        : '—',
      sub: overview.highestRatedRoute ? `★ ${overview.highestRatedRoute.rating.toFixed(1)}` : '',
    },
    {
      icon: <NewReleases sx={{ fontSize: 18, color: theme.palette.primary.light }} />,
      label: 'Новых за неделю',
      value: `${overview.newThisWeek}`,
      sub: 'трасс',
    },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
      {columns.map((col) => (
        <Box key={col.label} sx={{ ...Card(theme), display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            {col.icon}
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: theme.palette.text.secondary }}>
              {col.label}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: theme.palette.text.primary, lineHeight: 1.3 }}>
            {col.value}
          </Typography>
          {col.sub && (
            <Typography sx={{ fontSize: '0.72rem', color: theme.custom.text3 }}>
              {col.sub}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
}
