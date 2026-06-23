import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Card } from '../../theme/cardStyles';
import { SectionHeader } from '../ui/SectionHeader';
import { ASCENT_COLORS } from '../../constants/ascent';
import { HOLD_COLORS } from '../../constants/routes';
import { getGymStyle } from '../../constants/gymPalette';
import { getRatingColor } from '../../constants/rating';
import { colorDot, textEllipsis, ascentBadgeStyle } from '../../theme/commonStyles';
import { useTopRoutes } from '../../services/hooks/useUser';
import { useAuthStore } from '../../stores/authStore';
import { LazyCard } from '../ui/LazyCard';

export function TopRoutes() {
  const userId = useAuthStore((s) => s.userId) ?? '550e8400-e29b-41d4-a716-446655440001';
  const { data: routesData, isLoading } = useTopRoutes(userId);
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
        {routes.map((route) => {
          const color = ASCENT_COLORS[route.ascentType] || ASCENT_COLORS.Attempt;
          const ascentBadge = { label: route.ascentType, bg: color };
          const holdColor = HOLD_COLORS[route.holdColor] || HOLD_COLORS.Gray;

          return (
            <Box
              key={route.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: '6px 8px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background .15s',
                textDecoration: 'none',
                color: theme.palette.text.primary,
                '&:hover': { background: theme.custom.surface2 },
              }}
            >
              {/* Hold color dot */}
              <Box sx={{ ...colorDot(14), background: holdColor }} />

              {/* Route name · grade · ascent badge */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    ...textEllipsis(),
                  }}
                >
                  {route.name}
                  <Typography
                    component="span"
                    sx={{ fontSize: '0.82rem', color: theme.palette.primary.main, fontWeight: 600, ml: 0.5 }}
                  >
                    {route.grade}
                  </Typography>
                  <Box
                      component="span"
                      sx={{ ...ascentBadgeStyle(ascentBadge.bg), ml: 1 }}
                  >
                    {ascentBadge.label}
                  </Box>
                </Typography>
              </Box>

              {/* Gym badge */}
              {(() => {
                const gs = getGymStyle(route.gymName);
                return (
                  <Box
                    component="span"
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
                      flexShrink: 0,
                      maxWidth: 160,
                      ...textEllipsis(),
                      cursor: 'pointer',
                      textTransform: 'none',
                      transition: 'filter .15s, box-shadow .15s',
                      '&:hover': {
                        filter: 'brightness(1.15)',
                        boxShadow: `0 0 10px 1px ${gs.glow}`,
                      },
                    }}
                  >
                    <LocationOnIcon sx={{ fontSize: 12 }} /> {route.gymName}
                  </Box>
                );
              })()}

              {/* Rating */}
              <Typography sx={{ fontSize: '0.78rem', color: getRatingColor(route.rating), flexShrink: 0, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.25 }}>
                <StarIcon sx={{ fontSize: 14 }} /> {route.rating.toFixed(1)}
              </Typography>
            </Box>
          );
        })}
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
