import { Box, ToggleButton, ToggleButtonGroup, Typography, useTheme } from '@mui/material';
import { People, Whatshot } from '@mui/icons-material';

interface FeedToggleProps {
  value: 'subs' | 'recommended';
  onChange: (value: 'subs' | 'recommended') => void;
  subsCount?: number;
  onSubsClick?: () => void;
}

export function FeedToggle({ value, onChange, subsCount, onSubsClick }: FeedToggleProps) {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(_, v) => v && onChange(v)}
        size="small"
        sx={{
          '& .MuiToggleButton-root': {
            border: `1px solid ${theme.palette.divider}`,
            color: theme.palette.text.secondary,
            textTransform: 'none',
            fontSize: '0.82rem',
            fontWeight: 600,
            px: 2,
            py: 0.75,
            '&.Mui-selected': {
              bgcolor: `${theme.palette.primary.main}22`,
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
            },
          },
        }}
      >
        <ToggleButton value="subs">
          <People sx={{ fontSize: 16, mr: 0.5 }} /> Подписки
        </ToggleButton>
        <ToggleButton value="recommended">
          <Whatshot sx={{ fontSize: 16, mr: 0.5 }} /> Рекомендуемое
        </ToggleButton>
      </ToggleButtonGroup>
      {subsCount !== undefined && subsCount > 0 && (
        <Typography
          onClick={onSubsClick}
          sx={{
            fontSize: '0.78rem',
            color: theme.palette.text.disabled,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'color .2s',
            '&:hover': { color: theme.palette.text.secondary },
          }}
        >
          {subsCount} подписок
        </Typography>
      )}
    </Box>
  );
}
