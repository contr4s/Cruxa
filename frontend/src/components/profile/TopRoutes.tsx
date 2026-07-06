import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Card } from '../../theme/cardStyles';
import { SectionHeader } from '../ui/SectionHeader';
import { RouteFull } from '../routes/RouteFull';
import { useTopRoutes } from '../../services/hooks/useUser';
import { useAuthStore } from '../../stores/authStore';
import { LazyCard } from '../ui/LazyCard';

export function TopRoutes({ userId: propUserId }: { userId?: string } = {}) {
  const authUserId = useAuthStore((s) => s.userId ?? '');
  const userId = propUserId ?? authUserId;
  const { data: routesData, isLoading } = useTopRoutes(userId as string);
  const routes = routesData?.routes ?? [];
  const totalRoutes = routesData?.totalRoutes;
  const avgGrade = routesData?.avgGrade;
  const maxGrade = routesData?.maxGrade;
  const theme = useTheme();
  return (
    <LazyCard loading={isLoading} minHeight={360}>
      <Box sx={Card(theme)}>
      <SectionHeader
        icon={<EmojiEventsIcon sx={{ color: theme.palette.secondary.main, fontSize: 20 }} />}
        title="Лучшие трассы"
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {routes.map((route) => (
          <Box
            key={route.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: '6px 8px',
              borderRadius: '8px',
              transition: 'background .15s',
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
              ascentStyle={route.ascentType}
            />
          </Box>
        ))}
      </Box>
      {/* Summary row */}
      {(totalRoutes !== undefined || avgGrade || maxGrade) && (
        <Box
          sx={{
            mt: 1,
            pt: 1,
            borderTop: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            gap: 0.5,
          }}
        >
          {totalRoutes !== undefined && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: theme.palette.text.primary }}>{totalRoutes}</Typography>
              <Typography sx={{ fontSize: '0.6rem', color: theme.custom.text3, lineHeight: 1 }}>трасс</Typography>
            </Box>
          )}
          {avgGrade && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: theme.palette.text.primary }}>{avgGrade}</Typography>
              <Typography sx={{ fontSize: '0.6rem', color: theme.custom.text3, lineHeight: 1 }}>средний</Typography>
            </Box>
          )}
          {maxGrade && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: theme.palette.secondary.main }}>{maxGrade}</Typography>
              <Typography sx={{ fontSize: '0.6rem', color: theme.custom.text3, lineHeight: 1 }}>лучший</Typography>
            </Box>
          )}
        </Box>
      )}
      </Box>
    </LazyCard>
  );
}
