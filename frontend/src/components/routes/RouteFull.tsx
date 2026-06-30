import { Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { RouteLabel } from './RouteLabel';
import { ascentBadgeStyle } from '../../theme/commonStyles';
import { ASCENT_COLORS } from '../../constants/ascent';
import { GymChip } from '../ui/GymChip';
import { RatingBadge } from '../ui/RatingBadge';

interface RouteFullProps {
  routeId?: string;
  name: string;
  grade: string;
  holdColor: string;
  rating?: number;
  gymName?: string;
  gymId?: string;
  /** Бейдж стиля пролаза (Flash, Onsight, Redpoint…) */
  ascentStyle?: string;
}

/**
 * Полная строка трассы: RouteLabel + опционально бейдж пролаза + бейдж зала + рейтинг.
 * Возвращает фрагмент — должен быть внутри flex-контейнера.
 */
export function RouteFull({ routeId, name, grade, holdColor, rating, gymName, gymId, ascentStyle }: RouteFullProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const styleColor = ascentStyle ? ASCENT_COLORS[ascentStyle] || ASCENT_COLORS.Attempt : null;

  return (
    <Box
      onClick={routeId ? () => navigate(`/route/${routeId}`, { state: { backgroundLocation: location } }) : undefined}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 'inherit',
        flex: 1,
        minWidth: 0,
        overflow: 'hidden',
        cursor: routeId ? 'pointer' : undefined,
        borderRadius: 1,
        transition: 'background .15s',
        '&:hover': routeId ? { bgcolor: 'action.hover' } : undefined,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 'inherit', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <RouteLabel name={name} grade={grade} holdColor={holdColor} />
        {styleColor && ascentStyle && (
          <Box component="span" sx={{ ...ascentBadgeStyle(styleColor), flexShrink: 0 }}>
            {ascentStyle}
          </Box>
        )}
      </Box>
      {(gymName || rating !== undefined) && (
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
          {gymName && <GymChip name={gymName} gymId={gymId} />}
          {rating !== undefined && <RatingBadge rating={rating} />}
        </Box>
      )}
    </Box>
  );
}
