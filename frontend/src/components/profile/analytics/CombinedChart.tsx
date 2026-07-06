import { useState, memo, useRef } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, useTheme, useMediaQuery } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import TerrainIcon from '@mui/icons-material/Terrain';
import { Line } from 'react-chartjs-2';
import { SectionHeader } from '../../ui/SectionHeader';
import type { ChartOptions, ChartData } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';
import { Card, filterSelectStyle } from '../../../theme/cardStyles';
import { CHART_TOOLTIP, CHART_ANIMATION } from '../../../constants/chart';
import { useKruskorHistory } from '../../../services/hooks/useUser';
import { useAuthStore } from '../../../stores/authStore';
import { LazyCard } from '../../ui/LazyCard';
import { useChartResize } from '../../../hooks/useChartResize';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);
// gradientFillPlugin is passed via plugins prop to <Line>

/* Шкала сложности строится динамически на основе данных */
function buildGradeScale(data: { maxGrade: string }[]): { list: string[]; map: Record<string, number>; maxIndex: number } {
  const unique = [...new Set(data.map((d) => d.maxGrade))];
  const sorted = unique.sort((a, b) => {
    const aNum = parseFloat(a) || 0;
    const bNum = parseFloat(b) || 0;
    const aSuffix = a.replace(/[^A-Za-z+]/g, '');
    const bSuffix = b.replace(/[^A-Za-z+]/g, '');
    if (aNum !== bNum) return aNum - bNum;
    return aSuffix.localeCompare(bSuffix);
  });
  const map: Record<string, number> = {};
  sorted.forEach((g, i) => { map[g] = i; });
  return { list: sorted, map, maxIndex: sorted.length - 1 };
}

const PERIODS = [
  { value: '1m', label: '1 мес' },
  { value: '3m', label: '3 мес' },
  { value: '6m', label: '6 мес' },
  { value: '1y', label: '1 год' },
  { value: 'all', label: 'Всё' },
];

// Plugin for gradient fill under the Kruskor line (matching mockup)
const gradientFillPlugin = {
  id: 'gradientFill',
  beforeDraw(chart: ChartJS) {
    const { ctx, chartArea, data } = chart;
    if (!chartArea || !data?.datasets?.[0]) return;

    const dataset = data.datasets[0];
    const meta = chart.getDatasetMeta(0);
    if (!meta?.visible) return;

    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, 'rgba(38, 166, 154, 0.45)');
    gradient.addColorStop(1, 'rgba(38, 166, 154, 0)');

    dataset.backgroundColor = gradient;
  },
};

export const CombinedChart = memo(function CombinedChart() {
  const theme = useTheme();
  const [period, setPeriod] = useState('all');
  const chartRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useChartResize(chartRef, containerRef, [period]);
  const userId = useAuthStore((s) => s.userId);
  const { data: kruskorPoints, isLoading } = useKruskorHistory(userId ?? '', period);

  const data = kruskorPoints ?? [];
  const labels = data.map((d) => d.date);
  const scores = data.map((d) => d.score);
  const { list: gradeList, map: gradeMap, maxIndex } = data.length > 0 ? buildGradeScale(data) : { list: [] as string[], map: {} as Record<string, number>, maxIndex: 0 };
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const maxGrades = data.map((d) => gradeMap[d.maxGrade] ?? 0);

  const chartData: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: 'Крускор',
        data: scores,
        borderColor: '#26A69A',
        backgroundColor: 'rgba(38, 166, 154, 0.12)',
        fill: true,
        tension: 0.4,
        pointRadius: (ctx: { chart: { width: number } }) => ctx.chart.width < 600 ? 0 : 4,
        pointBackgroundColor: '#26A69A',
        yAxisID: 'y',
      },
      {
        label: 'Макс. сложность',
        data: maxGrades,
        borderColor: '#FFB300',
        backgroundColor: 'rgba(255, 179, 0, 0.05)',
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
        pointRadius: (ctx: { chart: { width: number } }) => ctx.chart.width < 600 ? 0 : 3,
        pointBackgroundColor: '#FFB300',
        yAxisID: 'y1',
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: false,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    animation: CHART_ANIMATION,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#BDBDBD',
          usePointStyle: true,
          padding: 16,
          font: { size: 12 },
        },
      },
      tooltip: {
        ...CHART_TOOLTIP,
        callbacks: {
          label(context: { datasetIndex: number; parsed: { y: number | null } }) {
            if (context.datasetIndex === 1) {
              const idx = Math.round(context.parsed.y ?? 0);
              return idx >= 0 && idx < gradeList.length ? `Сложность: ${gradeList[idx]}` : '';
            }
            return `Крускор: ${context.parsed.y ?? 0}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(45, 61, 58, 0.5)', display: true },
        ticks: { color: '#9E9E9E', maxRotation: 0, autoSkipPadding: 12, maxTicksLimit: 6 },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: { color: 'rgba(45, 61, 58, 0.5)' },
        ticks: { color: '#9E9E9E'},
        title: {
          display: !isMobile,
          text: 'Крускор',
          color: '#26A69A',
          font: { size: 14 },
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: { display: false },
        ticks: {
          color: '#9E9E9E',
          callback(value: string | number) {
            const idx = Math.round(value as number);
            return idx >= 0 && idx < gradeList.length ? gradeList[idx] : '';
          },
        },
        title: {
          display: !isMobile,
          text: 'Сложность',
          color: '#FFB300',
          font: { size: 14 },
        },
        min: -0.5,
        max: maxIndex + 0.5,
        afterBuildTicks(axis: { ticks: { value: number }[] }) {
          axis.ticks = gradeList.map((_, i) => ({ value: i }));
        },
      },
    },
  };

  return (
    <LazyCard loading={isLoading} minHeight={360}>
      <Box sx={Card(theme)}>
      <SectionHeader
        icon={<TrendingUpIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />}
        title="Прогресс"
        action={
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography sx={{ color: theme.custom.text3, fontWeight: 500 }}>
              Период
            </Typography>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                sx={filterSelectStyle(theme)}
              >
                {PERIODS.map((p) => (
                  <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        }
      />

      {/* Chart */}
      <Box ref={containerRef} sx={{ width: '100%', height: { xs: 340, md: 400 } }}>
        <Line ref={chartRef} data={chartData as any} options={options} plugins={[gradientFillPlugin]} />
      </Box>

      {/* Bottom stats */}
      {data.length > 0 && (
        <Box
          sx={{
            mt: { xs: 0.5, sm: -2 },
            display: 'flex',
            justifyContent: 'space-between',
            color: theme.palette.text.secondary,
            fontSize: '0.85rem',
          }}
        >
          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AutoGraphIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} /> Крускор: <strong style={{ color: theme.palette.primary.main }}>+{data[data.length - 1].score - data[0].score}</strong>
          </Typography>
          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TerrainIcon sx={{ fontSize: 18, color: theme.palette.secondary.main }} /> Сложность: <span style={{ color: theme.palette.text.primary }}>{data[0].maxGrade}</span> → <strong style={{ color: theme.palette.secondary.main }}>{data[data.length - 1].maxGrade}</strong>
          </Typography>
        </Box>
      )}
      </Box>
    </LazyCard>
  );
});
