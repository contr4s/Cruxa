import { Box, Typography } from '@mui/material';
import { Star, LocationOn } from '@mui/icons-material';
import { RouteLabel } from './RouteLabel';
import { getGymStyle } from '../../constants/gymPalette';
import { getRatingColor } from '../../constants/rating';
import { ascentBadgeStyle } from '../../theme/commonStyles';
import { ASCENT_COLORS } from '../../constants/ascent';

interface RouteFullProps {
  name: string;
  grade: string;
  holdColor: string;
  rating?: number;
  gymName?: string;
  /** Бейдж стиля пролаза (Flash, Onsight, Redpoint…) */
  ascentStyle?: string;
}

/**
 * Полная строка трассы: RouteLabel + опционально бейдж пролаза + бейдж зала + рейтинг.
 * Возвращает фрагмент — должен быть внутри flex-контейнера.
 */
export function RouteFull({ name, grade, holdColor, rating, gymName, ascentStyle }: RouteFullProps) {
  const gs = gymName ? getGymStyle(gymName) : null;
  const styleColor = ascentStyle ? ASCENT_COLORS[ascentStyle] || ASCENT_COLORS.Attempt : null;

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 'inherit', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <RouteLabel name={name} grade={grade} holdColor={holdColor} />
        {styleColor && ascentStyle && (
          <Box component="span" sx={{ ...ascentBadgeStyle(styleColor), flexShrink: 0 }}>
            {ascentStyle}
          </Box>
        )}
      </Box>
      {(gymName || rating !== undefined) && (
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          {gymName && gs && (
            <Box
              sx={{
                display: 'inline-flex', alignItems: 'center', gap: 0.375, px: 1, py: 0.25, borderRadius: '12px',
                fontSize: '0.65rem', fontWeight: 600, background: gs.bg, color: '#fff', maxWidth: 140,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                cursor: 'pointer', transition: 'filter .15s, box-shadow .15s',
                '&:hover': { filter: 'brightness(1.15)', boxShadow: `0 0 10px 1px ${gs.glow}` },
              }}
            >
              <LocationOn sx={{ fontSize: 12 }} /> {gymName}
            </Box>
          )}
          {rating !== undefined && (
            <Typography sx={{
              fontSize: '0.72rem', fontWeight: 600, color: getRatingColor(rating),
              display: 'flex', alignItems: 'center', gap: 0.25,
            }}>
              <Star sx={{ fontSize: 14 }} /> {rating.toFixed(1)}
            </Typography>
          )}
        </Box>
      )}
    </>
  );
}
