import { Box, Typography, useTheme } from '@mui/material';
import { colorDot } from '../../theme/commonStyles';
import { HOLD_COLORS } from '../../constants/routes';

interface RouteLabelProps {
  name: string;
  grade: string;
  holdColor: string;
  dotSize?: number;
  variant?: 'default' | 'heading';
}

/**
 * Цветная точка + название трассы + сложность.
 * Возвращает фрагмент (dot + typography) — должен быть внутри flex-контейнера.
 */
export function RouteLabel({ name, grade, holdColor, dotSize = 14, variant = 'default' }: RouteLabelProps) {
  const theme = useTheme();
  const hex = HOLD_COLORS[holdColor] || '#757575';
  const isHeading = variant === 'heading';

  return (
    <>
      <Box sx={{ ...colorDot(dotSize), background: hex }} />
      <Typography
        component="span"
        sx={{ fontSize: isHeading ? '1.4rem' : '0.82rem', fontWeight: 800, lineHeight: 1.2, color: theme.palette.text.primary }}
      >
        {name}
        <Typography
          component="span"
          sx={{ fontSize: isHeading ? '1.2rem' : '0.78rem', color: isHeading ? theme.palette.secondary.main : theme.palette.primary.main, fontWeight: 800, ml: 0.5 }}
        >
          {grade}
        </Typography>
      </Typography>
    </>
  );
}
