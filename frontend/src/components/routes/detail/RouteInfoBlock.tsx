import { Box, Typography, useTheme } from '@mui/material';
import type { RouteDto } from '../../../types/route';
import { RouteSetterInfo } from '../RouteSetterInfo';
import { RouteLabel } from '../RouteLabel';
import { GymChip } from '../../ui/GymChip';
import { RatingBadge } from '../../ui/RatingBadge';

interface RouteInfoBlockProps {
  route: RouteDto;
}

export function RouteInfoBlock({ route }: RouteInfoBlockProps) {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', columnGap: 0.75 }}>
        <RouteLabel name={route.name} grade={route.grade} holdColor={route.holdColor} dotSize={18} variant="heading" />
      </Box>

      {/* Meta: gym, sector, type */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, alignItems: 'center' }}>
        <GymChip name={route.gymName} gymId={route.gymId} />
        {route.sector && (
          <Typography sx={{ fontSize: '0.85rem', color: theme.custom.text3, background: theme.custom.surface2, px: 1, borderRadius: '6px' }}>
            {route.sector}
          </Typography>
        )}
        <Typography
          sx={{
            fontSize: '0.68rem', fontWeight: 600, height: 22, px: 1, display: 'inline-flex', alignItems: 'center',
            borderRadius: '12px', background: theme.palette.primary.main, color: '#fff',
          }}
        >
          {route.type === 'Bouldering' ? 'Bouldering' : route.type}
        </Typography>
        <RatingBadge rating={route.rating} />
      </Box>

      {/* Setter */}
      <RouteSetterInfo route={route} />

      {/* Tags */}
      {route.tags.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {route.tags.map((tag) => (
            <Typography
              key={tag}
              sx={{
                height: 22, fontSize: '0.68rem', fontWeight: 600, px: 1, display: 'inline-flex', alignItems: 'center',
                borderRadius: '12px', background: theme.custom.surface3, color: theme.palette.text.primary,
              }}
            >
              {tag}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
}
