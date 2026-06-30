import { Box, useTheme } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { RouteLabel } from '../routes/RouteLabel';
import { ascentBadgeStyle } from '../../theme/commonStyles';
import { ASCENT_COLORS } from '../../constants/ascent';

interface AscentRowProps {
  routeId?: string;
  routeName: string;
  grade: string;
  style: string;
  holdColor: string;
  compact?: boolean;
}
export function AscentRow({ routeId, routeName, grade, style, holdColor, compact }: AscentRowProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const styleColor = ASCENT_COLORS[style] || ASCENT_COLORS.Attempt;

  return (
    <Box
      onClick={routeId ? () => navigate(`/route/${routeId}`, { state: { backgroundLocation: location } }) : undefined}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: compact ? 0.75 : 1.5,
        py: compact ? 0.35 : 0.5,
        px: compact ? 1 : 2.5,
        borderRadius: compact ? '100px' : '8px',
        border: compact ? `1px solid ${theme.palette.divider}` : undefined,
        cursor: routeId ? 'pointer' : undefined,
        transition: compact ? undefined : 'background .15s',
        '&:hover': compact ? undefined : { background: theme.custom.surface2 },
      }}
    >
      <RouteLabel name={routeName} grade={grade} holdColor={holdColor} dotSize={14} />
      <Box component="span" sx={{ ...ascentBadgeStyle(styleColor) }}>
        {style}
      </Box>
    </Box>
  );
}
