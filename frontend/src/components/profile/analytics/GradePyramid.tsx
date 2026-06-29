import { memo } from 'react';
import { Box, useTheme } from '@mui/material';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import { Card } from '../../../theme/cardStyles';
import { SectionHeader } from '../../ui/SectionHeader';
import { useGradePyramid } from '../../../services/hooks/useUser';
import { useAuthStore } from '../../../stores/authStore';
import { useInView } from '../../../hooks/useInView';
import { LazyCard } from '../../ui/LazyCard';
import { GradePyramidView } from '../../charts/GradePyramidView';

export const GradePyramid = memo(function GradePyramid() {
  const theme = useTheme();
  const userId = useAuthStore((s) => s.userId);
  const { ref, inView } = useInView();
  const { data: pyramidData, isLoading } = useGradePyramid(userId, inView);
  const data = pyramidData ?? [];

  return (
    <Box ref={ref}>
      <LazyCard loading={!inView || isLoading} minHeight={320}>
        <Box sx={Card(theme)}>
          <SectionHeader
            icon={<EqualizerIcon sx={{ color: theme.palette.secondary.main, fontSize: 20 }} />}
            title="Пирамида сложности"
          />
          <GradePyramidView data={data} />
        </Box>
      </LazyCard>
    </Box>
  );
});
