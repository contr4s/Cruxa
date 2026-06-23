import { Box, useTheme } from '@mui/material';
import { dividerBorder } from '../../theme/commonStyles';

interface SkeletonCardProps {
  count?: number;
  height?: number;
}

export function SkeletonCard({ count = 1, height = 120 }: SkeletonCardProps) {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Box
          key={i}
          sx={{
            background: theme.palette.background.paper,
            borderRadius: `${theme.shape.borderRadius}px`,
            ...dividerBorder(theme),
            p: 2.5,
            height,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: '40%',
              height: 14,
              borderRadius: '4px',
              background: theme.custom.surface2,
              animation: 'pulse-dot 1.8s ease-in-out infinite',
            }}
          />
          <Box
            sx={{
              width: '70%',
              height: 10,
              borderRadius: '4px',
              background: theme.custom.surface2,
              animation: 'pulse-dot 1.8s ease-in-out infinite',
              animationDelay: '0.3s',
            }}
          />
          <Box
            sx={{
              width: '50%',
              height: 10,
              borderRadius: '4px',
              background: theme.custom.surface2,
              animation: 'pulse-dot 1.8s ease-in-out infinite',
              animationDelay: '0.6s',
            }}
          />
        </Box>
      ))}
    </Box>
  );
}
