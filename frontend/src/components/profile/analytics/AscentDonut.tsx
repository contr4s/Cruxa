import { memo } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import { Doughnut } from 'react-chartjs-2';
import { SectionHeader } from '../../ui/SectionHeader';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card } from '../../../theme/cardStyles';
import { ASCENT_COLORS } from '../../../constants/ascent';
import { CHART_TOOLTIP, CHART_ANIMATION } from '../../../constants/chart';
import { useAscentDistribution } from '../../../services/hooks/useUser';
import { useAuthStore } from '../../../stores/authStore';
import { useInView } from '../../../hooks/useInView';
import { LazyCard } from '../../ui/LazyCard';
import { createCenterTextPlugin } from './centerTextPlugin';

ChartJS.register(ArcElement, Tooltip, Legend);

const centerTextPlugin = createCenterTextPlugin({ valueKey: 'total', label: 'всего', valueFontSize: 22, labelFontSize: 12 });

export const AscentDonut = memo(function AscentDonut() {
  const theme = useTheme();
  const userId = useAuthStore((s) => s.userId) ?? '550e8400-e29b-41d4-a716-446655440001';
  const { ref, inView } = useInView();
  const { data: distData, isLoading } = useAscentDistribution(userId, inView);
  const data = distData ?? [];
  const total = data.reduce((s, x) => s + x.count, 0);
  const chartData = {
    labels: data.map((d) => d.type),
    datasets: [
      {
        data: data.map((d) => d.count),
        backgroundColor: data.map((d) => ASCENT_COLORS[d.type] || '#757575'),
        borderColor: '#1C2221',
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    animation: {
      animateRotate: true,
      ...CHART_ANIMATION,
    },
    plugins: {
      legend: { display: false },
      tooltip: CHART_TOOLTIP,
      centerText: { total },
    },
  };

  return (
    <Box ref={ref}>
      <LazyCard loading={!inView || isLoading} minHeight={320}>
        <Box sx={Card(theme)}>
      <SectionHeader
        icon={<DonutLargeIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />}
        title="Типы пролазов"
      />

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 3 }, alignItems: 'center' }}>
        {/* Donut */}
        <Box sx={{ width: 160, height: 160, flexShrink: 0 }}>
          <Doughnut data={chartData} options={options} plugins={[centerTextPlugin]} />
        </Box>

        {/* Legend */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4px 16px', flex: 1, width: '100%' }}>
          {data.map((item) => (
            <Box
              key={item.type}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: '0.82rem',
                color: theme.palette.text.secondary,
                p: '4px 8px',
                borderRadius: 1,
                transition: 'background .15s',
                '&:hover': { background: theme.custom.surface2 },
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: ASCENT_COLORS[item.type] || '#757575',
                  flexShrink: 0,
                }}
              />
              <Typography sx={{ fontSize: '0.82rem', color: theme.palette.text.secondary }}>
                {item.type}
              </Typography>
              <Typography
                sx={{
                  marginLeft: 'auto',
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  fontSize: '0.85rem',
                }}
              >
                {item.count}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
        </Box>
      </LazyCard>
    </Box>
  );
});
