import { useMemo, useState, memo } from 'react';
import { Box, Typography, IconButton, useTheme } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { Card } from '../../theme/cardStyles';
import { SectionHeader } from '../ui/SectionHeader';
import { smallIconButton } from '../../theme/commonStyles';
import { useMonthlyActivity } from '../../services/hooks/useUser';
import { useAuthStore } from '../../stores/authStore';
import { LazyCard } from '../ui/LazyCard';
import type { MonthlyActivity } from '../../types/user';

function useActivityMap(data?: MonthlyActivity) {
  return useMemo(() => {
    if (!data?.days?.length) return {};
    const map: Record<number, { intensity: number; hasWorkout: boolean; routeCount: number }> = {};
    for (const day of data.days) {
      map[day.day] = { intensity: day.intensity, hasWorkout: day.hasWorkout, routeCount: day.routeCount };
    }
    return map;
  }, [data]);
}

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

const DAYS_OF_WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const ActivityCalendar = memo(function ActivityCalendar({ userId: propUserId }: { userId?: string } = {}) {
  const theme = useTheme();
  const authUserId = useAuthStore((s) => s.userId);
  const userId = propUserId ?? authUserId;
  const { data: activityData, isLoading } = useMonthlyActivity(userId ?? '');
  const data = activityData;
  const [currentMonth, setCurrentMonth] = useState(data?.month ?? 5);
  const [currentYear, setCurrentYear] = useState(data?.year ?? 2026);

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const activityMap = useActivityMap(data);

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const activity = activityMap[dayNum] ?? { intensity: 0, hasWorkout: false, routeCount: 0 };
    return { day: dayNum, ...activity };
  });

  const handlePrev = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else { setCurrentMonth((m) => m - 1); }
  };

  const handleNext = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else { setCurrentMonth((m) => m + 1); }
  };

  return (
    <LazyCard loading={isLoading} minHeight={360}>
      <Box sx={Card(theme)}>
      {/* Header */}
      <SectionHeader
        icon={<CalendarMonthIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />}
        title="Календарь"
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton onClick={handlePrev} size="small" sx={smallIconButton(theme)}>‹</IconButton>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: theme.palette.text.primary, minWidth: 110, textAlign: 'center' }}>
              {MONTHS[currentMonth]} {currentYear}
            </Typography>
            <IconButton onClick={handleNext} size="small" sx={smallIconButton(theme)}>›</IconButton>
          </Box>
        }
      />

      {/* Calendar grid */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px', mb: 0.5 }}>
          {DAYS_OF_WEEK.map((d) => (
            <Box key={d} sx={{ fontSize: '0.7rem', fontWeight: 600, color: theme.custom.text3, textTransform: 'uppercase', pb: 0.75, textAlign: 'center', borderBottom: '1px solid', borderColor: theme.palette.divider, mb: 0.25 }}>{d}</Box>
          ))}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
          {Array.from({ length: startOffset }).map((_, i) => (
            <Box key={`empty-${i}`} sx={{ textAlign: 'center', fontSize: '0.7rem', color: theme.custom.text3, py: '4px', minHeight: 28 }} />
          ))}
          {days.map((day, idx) => {
            const isNextMonth = startOffset + idx >= daysInMonth;
            const isDim = isNextMonth;
            return (
              <Box key={day.day} sx={{
                textAlign: 'center', fontSize: '0.7rem', fontWeight: day.hasWorkout ? 700 : 600,
                color: isDim ? theme.custom.text4 : day.hasWorkout ? '#fff' : theme.custom.text3,
                py: '4px', borderRadius: `${theme.shape.borderRadius}px`, cursor: 'default',
                background: day.hasWorkout && !isDim ? theme.palette.primary.main : 'transparent',
                filter: day.hasWorkout && !isDim ? `brightness(${0.7 + day.intensity * 0.5})` : 'none',
                textShadow: day.hasWorkout && !isDim ? '0 1px 4px rgba(0,0,0,.55)' : 'none',
                minHeight: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {day.day}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Week streak (left) + Legend (right) */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5, fontSize: '0.8rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: '2px' }}>
            {[true, true, true, true, false].map((active, i) => (
              <Box key={i} sx={{ width: 8, height: 8, borderRadius: '50%', background: active ? theme.palette.primary.main : theme.custom.surface2 }} />
            ))}
          </Box>
          <Typography sx={{ color: theme.custom.text3, fontSize: '0.78rem' }}>3 из 4 нед</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '3px', background: 'rgba(38, 166, 154, 0.05)' }} />
          <Typography sx={{ fontSize: '0.68rem', color: theme.custom.text3 }}>нет</Typography>
          {[0.3, 0.55, 0.85].map((intensity) => (
            <Box key={intensity} sx={{ width: 10, height: 10, borderRadius: '3px', background: theme.palette.primary.main, filter: `brightness(${0.7 + intensity * 0.5})` }} />
          ))}
          <Typography sx={{ fontSize: '0.68rem', color: theme.custom.text3 }}>интенсивность</Typography>
        </Box>
      </Box>
      </Box>
    </LazyCard>
  );
});
