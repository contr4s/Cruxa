import { Box, Chip, FormControl, Select, MenuItem, useTheme } from '@mui/material';
import { filterSelectStyle } from '../../theme/cardStyles';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'chips';
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface GymFiltersProps {
  filters: FilterConfig[];
}

export function GymFilters({ filters }: GymFiltersProps) {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
      {filters.map((f) =>
        f.type === 'select' ? (
          <FormControl key={f.key} size="small" sx={{ minWidth: 140 }}>
            <Select
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              sx={filterSelectStyle(theme)}
              displayEmpty
            >
              {f.options.map((o) => (
                <MenuItem key={o.value} value={o.value} sx={{ fontSize: '0.82rem' }}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Box key={f.key} sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', alignItems: 'center' }}>
            {f.options.map((o) => (
              <Chip
                key={o.value}
                label={o.label}
                size="small"
                onClick={() => f.onChange(o.value)}
                variant={f.value === o.value ? 'filled' : 'outlined'}
                sx={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  height: 28,
                  ...(f.value === o.value
                    ? { bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }
                    : { borderColor: theme.palette.divider, color: theme.palette.text.secondary }),
                }}
              />
            ))}
          </Box>
        ),
      )}
    </Box>
  );
}
