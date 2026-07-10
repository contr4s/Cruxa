import { useRef } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import type { GradeConsensus } from '../../../types/route';
import { Card } from '../../../theme/cardStyles';
import { pluralize } from '../../../utils/pluralize';
import { useChartResize } from '../../../hooks/useChartResize';
import { CHART_ANIMATION } from '../../../constants/chart';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface RouteConsensusChartProps {
  consensus: GradeConsensus | null;
}

export function RouteConsensusChart({ consensus }: RouteConsensusChartProps) {
  const theme = useTheme();
  const chartRef = useRef<ChartJS<'bar'>>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useChartResize(chartRef, containerRef, [consensus]);

  if (!consensus || consensus.gradeDistribution.length === 0) {
    return null;
  }

  const labels = consensus.gradeDistribution.map((d) => d.grade);
  const data = {
    labels,
    datasets: [
      {
        label: 'Голосов',
        data: consensus.gradeDistribution.map((d) => d.count),
        backgroundColor: consensus.gradeDistribution.map((d) =>
          d.grade === consensus.userVote
            ? theme.palette.secondary.main
            : d.grade === consensus.consensusGrade
              ? theme.palette.primary.main
              : theme.custom.surface3,
        ),
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: false,
    maintainAspectRatio: false,
    ...CHART_ANIMATION,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: { x: 10, y: 8 },
        displayColors: false,
        callbacks: {
          title: (items: { label: string }[]) => items[0].label,
          label: (item: { parsed: { y: number | null } }) => {
            const n = item.parsed.y ?? 0;
            return `${n} ${pluralize(n, ['голос', 'голоса', 'голосов'])}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: theme.custom.text3,
          font: { size: 11, weight: 600 },
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: theme.palette.divider },
        ticks: {
          color: theme.custom.text3,
          font: { size: 10 },
          stepSize: 1,
        },
        border: { display: false },
      },
    },
  };

  return (
    <Box sx={Card(theme)}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
        <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: theme.palette.text.primary }}>
          Оценка сообщества:
        </Typography>
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: theme.palette.primary.main }}>
          {consensus.consensusGrade}
        </Typography>
        {consensus.userVote !== undefined && (
          <>
            <Typography sx={{ fontSize: '0.68rem', color: theme.custom.text3 }}>/</Typography>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: theme.palette.secondary.main }}>
              Вы: {consensus.gradeDistribution.find((d) => d.grade === consensus.userVote)?.grade ?? '—'}
            </Typography>
          </>
        )}
        <Typography sx={{ fontSize: '0.68rem', color: theme.custom.text3, ml: 'auto' }}>
          {consensus.totalVotes} {pluralize(consensus.totalVotes, ['голос', 'голоса', 'голосов'])}
        </Typography>
      </Box>
      <Box ref={containerRef} sx={{ height: 160, width: '100%' }}>
        <Bar ref={chartRef} data={data} options={options} />
      </Box>
    </Box>
  );
}
