import { useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { BarChart, Radar, DonutLarge } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { swiperPaginationSx } from '../ui/swiperStyles';
import { GradePyramidView } from './GradePyramidView';
import { AscentDonutView } from './AscentDonutView';
import { RadarChartView } from './RadarChartView';
import { RadarCategorySelect } from './RadarCategorySelect';
import { ChartSlide } from './ChartSlide';
import type { GradePyramidItem, AscentTypeDistribution } from '../../types/user';
import type { RadarSkill } from '../../types/user';

interface ChartsCarouselProps {
  pyramid: GradePyramidItem[];
  distribution: AscentTypeDistribution[];
  categories: Record<string, RadarSkill[]>;
}

export function ChartsCarousel({ pyramid, distribution, categories }: ChartsCarouselProps) {
  const theme = useTheme();
  const categoryKeys = Object.keys(categories);
  const [category, setCategory] = useState(categoryKeys[0] ?? '');
  const currentCat = categoryKeys.includes(category) ? category : categoryKeys[0] ?? '';
  const skills = categories[currentCat] ?? [];

  const slides: React.ReactNode[] = [];

  // Skills radar — всегда первый
  slides.push(
    <ChartSlide
      icon={<Radar sx={{ fontSize: 18 }} />}
      title="Трассы"
      action={categoryKeys.length > 1 ? <RadarCategorySelect categories={categories} value={category} onChange={setCategory} /> : undefined}
    >
      {skills.length > 0 ? (
        <RadarChartView
          labels={skills.map((s) => s.name)}
          values={skills.map((s) => s.value)}
          unit="шт"
          showCenter={false}
        />
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
          <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem' }}>Нет данных</Typography>
        </Box>
      )}
    </ChartSlide>
  );

  slides.push(
    <ChartSlide icon={<BarChart sx={{ fontSize: 18 }} />} title="Сложность">
      <GradePyramidView data={pyramid} />
    </ChartSlide>
  );
  slides.push(
    <ChartSlide icon={<DonutLarge sx={{ fontSize: 18 }} />} title="Стиль">
      <AscentDonutView data={distribution} />
    </ChartSlide>
  );

  return (
    <Box sx={{ width: '100%', ...swiperPaginationSx(theme) }}>
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={0}
        slidesPerView={1}
        style={{ width: '100%' }}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <Box sx={{ width: '100%', boxSizing: 'border-box' }}>
              {slide}
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
