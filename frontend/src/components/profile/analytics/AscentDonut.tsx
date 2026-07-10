import { memo } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import { SectionHeader } from '../../ui/SectionHeader';
import { Card } from '../../../theme/cardStyles';
import { useAscentDistribution } from '../../../services/hooks/useUser';
import { useAuthStore } from '../../../stores/authStore';
import { useInView } from '../../../hooks/useInView';
import { LazyCard } from '../../ui/LazyCard';
import { AscentDonutView } from '../../charts/AscentDonutView';

export const AscentDonut = memo(function AscentDonut() {
  const theme = useTheme();
  const userId = useAuthStore((s) => s.userId);
  const { ref, inView } = useInView();
  const { data: distData, isLoading } = useAscentDistribution(userId ?? '', inView);
  const data = distData ?? [];

  return (
    <Box ref={ref}>
      <LazyCard loading={!inView || isLoading} minHeight={320}>
        <Box sx={Card(theme)}>
          <SectionHeader
            icon={<DonutLargeIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />}
            title="Типы пролазов"
          />
          {data.length > 0 ? (
            <AscentDonutView data={data} />
          ) : (
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem', textAlign: 'center', py: 4 }}>
              Нет данных
            </Typography>
          )}
        </Box>
      </LazyCard>
    </Box>
  );
});
