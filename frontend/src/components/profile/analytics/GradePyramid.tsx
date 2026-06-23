import { memo, useState, useEffect } from 'react';
import { Box, Typography, useTheme, keyframes } from '@mui/material';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import { Card } from '../../../theme/cardStyles';
import { SectionHeader } from '../../ui/SectionHeader';
import { useGradePyramid } from '../../../services/hooks/useUser';
import { useAuthStore } from '../../../stores/authStore';
import { useInView } from '../../../hooks/useInView';
import { LazyCard } from '../../ui/LazyCard';
import { CATEGORY_COLORS } from '../../../constants/gymPalette';

const growWidth = keyframes`
  from { width: 0; }
`;

export const GradePyramid = memo(function GradePyramid() {
  const theme = useTheme();
  const userId = useAuthStore((s) => s.userId) ?? '550e8400-e29b-41d4-a716-446655440001';
  const { ref, inView } = useInView();
  const { data: pyramidData, isLoading } = useGradePyramid(userId, inView);
  const data = pyramidData ?? [];
  const [visible, setVisible] = useState(false);
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  useEffect(() => {
    if (inView && !visible) setVisible(true);
  }, [inView, visible]);

  return (
    <Box ref={ref}>
      <LazyCard loading={!inView || isLoading} minHeight={320}>
        <Box sx={Card(theme)}>
      <SectionHeader
        icon={<EqualizerIcon sx={{ color: theme.palette.secondary.main, fontSize: 20 }} />}
        title="Пирамида сложности"
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {data.map((item, idx) => {
          const pct = Math.max((item.count / maxCount) * 100, 8);

          return (
            <Box key={item.grade} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {/* Grade label */}
              <Typography
                sx={{
                  width: 36,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: theme.palette.text.secondary,
                  textAlign: 'right',
                  flexShrink: 0,
                }}
              >
                {item.grade}
              </Typography>

              {/* Bar */}
              <Box
                sx={{
                  height: 22,
                  width: `${pct}%`,
                  borderRadius: '0 11px 11px 0',
                  background: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
                  opacity: 0.85,
                  animation: visible ? `${growWidth} 2s ease forwards` : 'none',
                  transition: 'box-shadow .3s ease, filter .2s ease',
                  filter: 'saturate(0.9)',
                  '&:hover': {
                    opacity: 1,
                    filter: 'saturate(1) brightness(1.05)',
                  },
                  minWidth: 8,
                }}
              />

              {/* Count */}
              <Typography
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: theme.palette.text.secondary,
                  width: 24,
                  flexShrink: 0,
                }}
              >
                {item.count}
              </Typography>
            </Box>
          );
        })}
      </Box>
        </Box>
      </LazyCard>
    </Box>
  );
});
