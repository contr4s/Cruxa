import { useRef } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ASCENT_COLORS } from '../../constants/ascent';
import { CHART_TOOLTIP, CHART_ANIMATION } from '../../constants/chart';
import { createCenterTextPlugin } from '../profile/analytics/centerTextPlugin';
import type { AscentTypeDistribution } from '../../types/user';
import { useChartResize } from '../../hooks/useChartResize';

ChartJS.register(ArcElement, Tooltip, Legend);

const centerTextPlugin = createCenterTextPlugin({ valueKey: 'total', label: 'всего', valueFontSize: 20, labelFontSize: 11 });

interface AscentDonutViewProps {
  data: AscentTypeDistribution[];
}

export function AscentDonutView({ data }: AscentDonutViewProps) {
  const theme = useTheme();
  const chartRef = useRef<ChartJS<'doughnut'>>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useChartResize(chartRef, containerRef, [data]);
  const total = data.reduce((s, x) => s + x.count, 0);

  const chartData = {
    labels: data.map((d) => d.type),
    datasets: [{
      data: data.map((d) => d.count),
      backgroundColor: data.map((d) => ASCENT_COLORS[d.type] || '#757575'),
      borderColor: theme.palette.background.paper,
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const options = {
    responsive: false,
    maintainAspectRatio: false,
    cutout: '65%',
    animation: { animateRotate: true, ...CHART_ANIMATION },
    plugins: {
      legend: { display: false },
      tooltip: CHART_TOOLTIP,
      centerText: { total },
    },
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 3 }, alignItems: 'center', p: 2 }}>
      <Box ref={containerRef} sx={{ width: 160, height: 160, flexShrink: 0 }}>
        <Doughnut ref={chartRef} data={chartData} options={options} plugins={[centerTextPlugin]} />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4px 16px', flex: 1, width: '100%' }}>
        {data.map((item) => (
          <Box key={item.type} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: '4px 8px', borderRadius: 1, '&:hover': { bgcolor: theme.custom.surface2 } }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: ASCENT_COLORS[item.type] || '#757575', flexShrink: 0 }} />
            <Typography sx={{ fontSize: '0.82rem', color: theme.palette.text.secondary }}>{item.type}</Typography>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: theme.palette.text.primary, ml: 'auto' }}>{item.count}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
