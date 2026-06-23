import { useState, memo } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, useTheme } from '@mui/material';
import RadarIcon from '@mui/icons-material/Radar';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MovingIcon from '@mui/icons-material/Moving';
import { Card, filterSelectStyle } from '../../../theme/cardStyles';
import { SectionHeader } from '../../ui/SectionHeader';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';
import { CHART_TOOLTIP, CHART_ANIMATION } from '../../../constants/chart';
import { useRadarSkills } from '../../../services/hooks/useUser';
import { useAuthStore } from '../../../stores/authStore';
import { useInView } from '../../../hooks/useInView';
import { LazyCard } from '../../ui/LazyCard';
import { createCenterTextPlugin } from './centerTextPlugin';
import { CATEGORY_COLORS } from '../../../constants/gymPalette';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

const centerTextPlugin = createCenterTextPlugin({ valueKey: 'avg', label: 'среднее', valueFontSize: 28, labelFontSize: 14 });

const CATEGORY_LABELS: Record<string, string> = {
  style: 'Стиль',
  relief: 'Рельеф',
  hold: 'Зацеп',
  type: 'Тип',
};

export const RadarChart = memo(function RadarChart() {
  const theme = useTheme();
  const userId = useAuthStore((s) => s.userId) ?? '550e8400-e29b-41d4-a716-446655440001';
  const [category, setCategory] = useState('style');
  const { ref, inView } = useInView();
  const { data: radarData, isLoading } = useRadarSkills(userId, inView);

  // Категории и навыки из ответа сервера
  const categories = radarData?.categories ?? {};
  const categoryKeys = Object.keys(categories);
  const currentCategory = categoryKeys.includes(category) ? category : categoryKeys[0] ?? 'style';
  const skills = categories[currentCategory] ?? [];
  const bestSkill = [...skills].sort((a, b) => b.value - a.value)[0];
  const worstSkill = [...skills].sort((a, b) => a.value - b.value)[0];
  const avgSkill = skills.length ? Math.round(skills.reduce((s, x) => s + x.value, 0) / skills.length) : 0;

  const chartData = {
    labels: skills.map((s) => s.name),
    datasets: [
      {
        label: 'Навыки',
        data: skills.map((s) => s.value),
        backgroundColor: 'rgba(38, 166, 154, 0.2)',
        borderColor: '#26A69A',
        borderWidth: 2,
        pointBackgroundColor: skills.map((_, i) => CATEGORY_COLORS[i % CATEGORY_COLORS.length]),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        ...CHART_TOOLTIP,
        callbacks: {
          label: (context: { parsed: { r: number } }) => `${context.parsed.r}%`,
        },
      },
      centerText: { avg: avgSkill },
    },
    animation: CHART_ANIMATION,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(45, 61, 58, 0.5)' },
        angleLines: { color: 'rgba(45, 61, 58, 0.5)' },
        pointLabels: {
          color: '#BDBDBD',
          font: { size: 12, weight: 600 },
        },
        ticks: {
          color: '#9E9E9E',
          backdropColor: 'transparent',
          stepSize: 10,
          display: false,
        },
      },
    },
  };

  return (
    <Box ref={ref}>
      <LazyCard loading={!inView || isLoading} minHeight={360}>
        <Box sx={Card(theme)}>
      <SectionHeader
        icon={<RadarIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />}
        title="Навыки"
        action={
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <Select
              value={currentCategory}
              onChange={(e) => setCategory(e.target.value)}
              sx={filterSelectStyle(theme)}
            >
              {categoryKeys.map((key) => (
                <MenuItem key={key} value={key}>{CATEGORY_LABELS[key] || key}</MenuItem>
              ))}
            </Select>
          </FormControl>
        }
      />

      {/* Chart */}
      <Box sx={{ width: '100%', height: { xs: 340, sm: 400 } }}>
        <Radar data={chartData} options={options} plugins={[centerTextPlugin]} />
      </Box>

      {/* Best / Worst */}
      {bestSkill && worstSkill && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: { xs: 1.5, sm: 3 }, mt: 1, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
          <Typography sx={{ color: theme.palette.text.secondary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AutoAwesomeIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} /> Сильная сторона: <strong style={{ color: theme.palette.primary.main }}>{bestSkill.name}</strong> ({bestSkill.value}%)
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <MovingIcon sx={{ fontSize: 16, color: theme.palette.secondary.main }} /> Зона роста: <strong style={{ color: theme.palette.secondary.main }}>{worstSkill.name}</strong> ({worstSkill.value}%)
          </Typography>
        </Box>
      )}
        </Box>
      </LazyCard>
    </Box>
  );
});
