import { Box, Typography, useTheme } from '@mui/material';
import { colorDot } from '../../theme/commonStyles';
import { HOLD_COLORS } from '../../constants/routes';

interface RouteLabelProps {
  name: string;
  grade: string;
  holdColor: string;
  dotSize?: number;
}

/**
 * Цветная точка + название трассы + сложность.
 * Возвращает фрагмент (dot + typography) — должен быть внутри flex-контейнера.
 */
export function RouteLabel({ name, grade, holdColor, dotSize = 14 }: RouteLabelProps) {
  const theme = useTheme();
  const hex = HOLD_COLORS[holdColor] || '#757575';

  return (
    <>
      <Box sx={{ ...colorDot(dotSize), background: hex }} />
      <Typography
        sx={{ fontSize: '0.82rem', fontWeight: 600, color: theme.palette.text.primary, }}
      >
        {name}
        <Typography
          component="span"
          sx={{ fontSize: '0.78rem', color: theme.palette.primary.main, fontWeight: 600, ml: 0.5 }}
        >
          {grade}
        </Typography>
      </Typography>
    </>
  );
}
