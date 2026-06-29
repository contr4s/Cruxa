import { Box, useTheme, keyframes } from '@mui/material';
import { CATEGORY_COLORS } from '../../constants/gymPalette';
import type { GradePyramidItem } from '../../types/user';

const growWidth = keyframes`
  from { width: 0; }
`;

interface GradePyramidViewProps {
  data: GradePyramidItem[];
}

export function GradePyramidView({ data }: GradePyramidViewProps) {
  const theme = useTheme();
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, p: 2 }}>
      {data.map((item, idx) => {
        const pct = Math.max((item.count / maxCount) * 100, 10);
        return (
          <Box key={item.grade} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 36, fontSize: '0.78rem', fontWeight: 700, color: theme.palette.text.secondary, textAlign: 'right', flexShrink: 0 }}>
              {item.grade}
            </Box>
            <Box
              sx={{
                height: 22,
                width: `${pct}%`,
                borderRadius: '0 11px 11px 0',
                background: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
                opacity: 0.85,
                animation: `${growWidth} 2s ease forwards`,
                transition: 'box-shadow .3s ease, filter .2s ease',
                filter: 'saturate(0.9)',
                '&:hover': { opacity: 1, filter: 'saturate(1) brightness(1.05)' },
                minWidth: 8,
              }}
            />
            <Box sx={{ fontSize: '0.85rem', fontWeight: 700, color: theme.palette.text.secondary, width: 24, flexShrink: 0 }}>
              {item.count}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
