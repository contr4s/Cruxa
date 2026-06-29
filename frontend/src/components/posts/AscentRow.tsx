import { Box, useTheme } from '@mui/material';
import { RouteLabel } from '../routes/RouteLabel';
import { ascentBadgeStyle } from '../../theme/commonStyles';
import { ASCENT_COLORS } from '../../constants/ascent';

interface AscentRowProps {
  routeName: string;
  grade: string;
  style: string;
  holdColor: string;
  compact?: boolean;
}
export function AscentRow({ routeName, grade, style, holdColor, compact }: AscentRowProps) {
  const theme = useTheme();
  const styleColor = ASCENT_COLORS[style] || ASCENT_COLORS.Attempt;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: compact ? 0.75 : 1.5,
        py: compact ? 0.35 : 0.5,
        px: compact ? 1 : 2.5,
        borderRadius: compact ? '100px' : '8px',
        border: compact ? `1px solid ${theme.palette.divider}` : undefined,
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
