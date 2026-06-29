import { Box, useTheme } from '@mui/material';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';
import { CHART_TOOLTIP, CHART_ANIMATION } from '../../constants/chart';
import { createCenterTextPlugin } from '../profile/analytics/centerTextPlugin';
import { CATEGORY_COLORS } from '../../constants/gymPalette';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

const centerTextPlugin = createCenterTextPlugin({ valueKey: 'avg', label: 'среднее', valueFontSize: 22, labelFontSize: 11 });

interface RadarChartViewProps {
  labels: string[];
  values: number[];
  unit?: string;
  centerValue?: number;
  height?: number;
  showCenter?: boolean;
}

export function RadarChartView({ labels, values, unit = '%', centerValue, height = 280, showCenter = true }: RadarChartViewProps) {
  const theme = useTheme();
  const maxVal = Math.max(...values, 1);
  const avg = centerValue ?? Math.round(values.reduce((s, x) => s + x, 0) / values.length);
  const plugins = showCenter ? [centerTextPlugin] : [];

  // Для шкалы "шт" используем maxVal, для "%" — 100
  const scaleMax = unit === '%' ? 100 : Math.ceil(maxVal * 1.2);

  const chartData = {
    labels,
    datasets: [{
      label: '',
      data: values,
      backgroundColor: 'rgba(38, 166, 154, 0.2)',
      borderColor: '#26A69A',
      borderWidth: 2,
      pointBackgroundColor: labels.map((_, i) => CATEGORY_COLORS[i % CATEGORY_COLORS.length]),
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        ...CHART_TOOLTIP,
        callbacks: {
          label: (ctx: any) => `${ctx.parsed.r}${unit}`,
        },
      },
      centerText: showCenter ? { avg } : undefined,
    },
    animation: CHART_ANIMATION,
    scales: {
      r: {
        beginAtZero: true,
        max: scaleMax,
        grid: { color: 'rgba(45, 61, 58, 0.5)' },
        angleLines: { color: 'rgba(45, 61, 58, 0.5)' },
        pointLabels: { color: theme.palette.text.secondary, font: { size: 11, weight: 600 } },
        ticks: { color: '#9E9E9E', backdropColor: 'transparent', stepSize: unit === '%' ? 10 : Math.ceil(scaleMax / 5), display: false },
      },
    },
  };

  return (
    <Box sx={{ width: '100%', height, p: 1 }}>
      <Radar data={chartData} options={options} plugins={plugins} />
    </Box>
  );
}
