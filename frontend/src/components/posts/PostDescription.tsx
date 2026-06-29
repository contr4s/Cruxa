import { Box, Typography, useTheme } from '@mui/material';
import { Whatshot, TrendingUp, Timer, EmojiEvents, ListAlt } from '@mui/icons-material';

interface PostDescriptionProps {
  body?: string;
  totalKruskor: number;
  avgGrade: string;
  duration?: number;
  totalRoutes?: number;
  maxGrade?: string;
}

export function PostDescription({ body, totalKruskor, avgGrade, duration, totalRoutes, maxGrade }: PostDescriptionProps) {
  const theme = useTheme();
  const hours = duration ? Math.floor(duration / 60) : 0;
  const minutes = duration ? duration % 60 : 0;
  const timeStr = duration ? `${hours}ч ${minutes}м` : '';

  return (
    <Box
      sx={{
        px: { xs: 4, sm: 5, md: 6 },
        pt: 1,
        pb: 1.25,
        mb: 1,
      }}
    >
      {body && (
        <Typography sx={{ fontSize: '0.88rem', color: theme.palette.text.primary, lineHeight: 1.6, mb: 1.5, whiteSpace: 'pre-wrap' }}>
          {body}
        </Typography>
      )}

      <Box sx={{ display: 'flex', gap: { xs: 2, sm: 2.5, md: 3 }, flexWrap: 'wrap' }}>
        <StatItem icon={<Whatshot sx={{ fontSize: 18, color: theme.palette.primary.main }} />} label="Крускор" value={`+${totalKruskor}`} color={theme.palette.primary.main} />
        {maxGrade && <StatItem icon={<EmojiEvents sx={{ fontSize: 18, color: theme.palette.secondary.main }} />} label="Макс. сложность" value={maxGrade} color={theme.palette.secondary.main} />}
        <StatItem icon={<TrendingUp sx={{ fontSize: 18, color: theme.palette.text.secondary }} />} label="Средняя" value={avgGrade} />
        {totalRoutes !== undefined && <StatItem icon={<ListAlt sx={{ fontSize: 18, color: theme.palette.text.secondary }} />} label="Пройдено трасс" value={`${totalRoutes}`} />}
        {timeStr && <StatItem icon={<Timer sx={{ fontSize: 18, color: theme.palette.text.secondary }} />} label="Длительность" value={timeStr} />}
      </Box>
    </Box>
  );
}

function StatItem({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color?: string }) {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {icon}
      <Box>
        <Typography sx={{ fontSize: '0.7rem', color: theme.palette.text.secondary, lineHeight: 1.2, textAlign: 'left' }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: color || theme.palette.text.primary, lineHeight: 1.3 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}
