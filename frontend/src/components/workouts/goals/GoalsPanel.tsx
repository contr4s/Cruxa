import { Box, Typography, LinearProgress, useTheme } from '@mui/material';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Card } from '../../../theme/cardStyles';
import { SectionHeader } from '../../ui/SectionHeader';
import { useGoals } from '../../../services/hooks/useGoals';

interface GoalsPanelProps {
  variant?: 'default' | 'sidebar';
}

export function GoalsPanel({ variant = 'default' }: GoalsPanelProps) {
  const theme = useTheme();
  const { data: goalsData } = useGoals();
  const goals = goalsData ?? [];

  if (goals.length === 0) {
    return (
      <Box
        sx={{
          background: theme.palette.background.paper,
          borderRadius: `${theme.shape.borderRadius}px`,
          p: variant === 'sidebar' ? 2 : 3,
          border: `1px solid ${theme.palette.divider}`,
          textAlign: 'center',
        }}
      >
        <Typography sx={{ fontSize: '0.9rem', color: theme.custom.text3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75 }}>
          <TrackChangesIcon sx={{ fontSize: 20 }} /> Цели не установлены
        </Typography>
      </Box>
    );
  }

  if (variant === 'sidebar') {
    return (
      <Box sx={{ bgcolor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', mb: 1.5, color: theme.palette.text.primary, display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <TrackChangesIcon sx={{ fontSize: 16 }} /> Мои цели
        </Typography>
        {goals.map((goal) => {
          const progress = goal.current / goal.target;
          const pct = Math.min(Math.round(progress * 100), 100);
          const isCompleted = goal.current >= goal.target;
          return (
            <Box key={goal.id} sx={{ mb: 1.25 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: theme.palette.text.primary }}>
                  {goal.label}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: isCompleted ? theme.palette.primary.main : theme.palette.text.secondary }}>
                  {goal.current} / {goal.target}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{
                  height: 6,
                  borderRadius: '3px',
                  background: theme.custom.surface2,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: '3px',
                    background: isCompleted ? 'linear-gradient(90deg, #26A69A, #2ECC71)' : theme.palette.primary.main,
                    transition: 'transform .6s ease',
                  },
                }}
              />
            </Box>
          );
        })}
      </Box>
    );
  }

  return (
    <Box sx={Card(theme)}>
      <SectionHeader
        icon={<TrackChangesIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />}
        title="Цели"
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {goals.map((goal) => {
          const progress = goal.current / goal.target;
          const pct = Math.min(Math.round(progress * 100), 100);
          const isCompleted = goal.current >= goal.target;

          return (
            <Box key={goal.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: theme.palette.text.primary }}>
                    {goal.label}
                  </Typography>
                  {isCompleted && (
                    <CheckCircleIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                  )}
                </Box>
                <Typography
                  sx={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: isCompleted ? theme.palette.primary.main : theme.palette.text.secondary,
                  }}
                >
                  {goal.current} / {goal.target} {goal.unit}
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{
                  height: 8,
                  borderRadius: '4px',
                  background: theme.custom.surface2,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: '4px',
                    background: isCompleted
                      ? 'linear-gradient(90deg, #26A69A, #2ECC71)'
                      : theme.palette.primary.main,
                    transition: 'transform .6s ease',
                    boxShadow: isCompleted ? '0 0 8px rgba(38,166,154,.4)' : 'none',
                  },
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
