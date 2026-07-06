import { useState, memo } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import RadarIcon from '@mui/icons-material/Radar';
import { Card } from '../../../theme/cardStyles';
import { SectionHeader } from '../../ui/SectionHeader';
import { useRadarSkills } from '../../../services/hooks/useUser';
import { useAuthStore } from '../../../stores/authStore';
import { useInView } from '../../../hooks/useInView';
import { LazyCard } from '../../ui/LazyCard';
import { RadarChartView, RadarCategorySelect } from '../../charts';

export const RadarChart = memo(function RadarChart() {
  const theme = useTheme();
  const userId = useAuthStore((s) => s.userId);
  const { ref, inView } = useInView();
  const { data: radarData, isLoading } = useRadarSkills(userId ?? '', inView);

  const categories = radarData?.categories ?? {};
  const categoryKeys = Object.keys(categories);
  const [category, setCategory] = useState(categoryKeys[0] ?? '');
  const currentCategory = categoryKeys.includes(category) ? category : categoryKeys[0] ?? '';
  const skills = categories[currentCategory] ?? [];
  const best = skills.length ? [...skills].sort((a, b) => b.value - a.value)[0] : null;
  const worst = skills.length ? [...skills].sort((a, b) => a.value - b.value)[0] : null;

  return (
    <Box ref={ref}>
      <LazyCard loading={!inView || isLoading} minHeight={360}>
        <Box sx={Card(theme)}>
          <SectionHeader
            icon={<RadarIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />}
            title="Навыки"
            action={
              <RadarCategorySelect categories={categories} value={category} onChange={setCategory} />
            }
          />
          {skills.length > 0 ? (
            <Box sx={{ width: '100%' }}>
              <RadarChartView
                labels={skills.map((s) => s.name)}
                values={skills.map((s) => s.value)}
                unit="%"
                height={340}
                centerValue={Math.round(skills.reduce((s, x) => s + x.value, 0) / skills.length)}
              />
              {best && worst && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: { xs: 1.5, sm: 3 }, mt: 1, px: 1, alignItems: 'center' }}>
                  <Box sx={{ color: theme.palette.text.secondary, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box component="span" sx={{ color: theme.palette.primary.main }}>▲</Box> Сильная: <strong style={{ color: theme.palette.primary.main }}>{best.name}</strong> ({best.value}%)
                  </Box>
                  <Box sx={{ color: theme.palette.text.secondary, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box component="span" sx={{ color: theme.palette.secondary.main }}>▼</Box> Зона роста: <strong style={{ color: theme.palette.secondary.main }}>{worst.name}</strong> ({worst.value}%)
                  </Box>
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 340 }}>
              <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem' }}>
                Нет данных
              </Typography>
            </Box>
          )}
        </Box>
      </LazyCard>
    </Box>
  );
});
