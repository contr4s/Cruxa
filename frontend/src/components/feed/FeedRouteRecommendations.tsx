import { Box, Typography, useTheme } from '@mui/material';
import { LocalFireDepartment } from '@mui/icons-material';
import { RouteFull } from '../routes/RouteFull';
import type { RecommendedRouteDto } from '../../types/post';

interface FeedRouteRecommendationsProps {
  routes: RecommendedRouteDto[];
}

export function FeedRouteRecommendations({ routes }: FeedRouteRecommendationsProps) {
  const theme = useTheme();

  return (
    <Box sx={{
      bgcolor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 2,
      p: 2,
      transition: 'box-shadow .2s ease, border-color .2s ease',
      '&:hover': {
        borderColor: theme.palette.primary.main,
        boxShadow: '0 4px 20px rgba(0,0,0,.3)',
      },
    }}>
      <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', mb: 1.5, color: theme.palette.text.primary, display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <LocalFireDepartment sx={{ fontSize: 16, color: theme.palette.primary.main }} /> Рекомендуемые трассы
      </Typography>
      {routes.map((route) => (
        <Box
          key={route.id}
          sx={{
            display: 'flex', alignItems: 'center', gap: 1, py: 0.5, px: 0.5, mx: -0.5, borderRadius: 1,
            transition: 'background .2s ease',
          }}
        >
          <RouteFull
            routeId={route.id}
            name={route.name}
            grade={route.grade}
            holdColor={route.holdColor}
            rating={route.rating}
            gymName={route.gymName}
            gymId={route.gymId}
          />
        </Box>
      ))}
    </Box>
  );
}
