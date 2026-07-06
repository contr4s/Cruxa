import { FormControl, Select, MenuItem, useTheme } from '@mui/material';
import { filterSelectStyle } from '../../theme/cardStyles';

interface GymSortProps {
  sort: string;
  onSortChange: (sort: string) => void;
}

const SORTS = [
  { value: 'rating', label: 'По рейтингу' },
  { value: 'distance', label: 'По расстоянию' }, // ponytail: server-side sort by coords
  { value: 'routes', label: 'По трассам' },
];

export function GymSort({ sort, onSortChange }: GymSortProps) {
  const theme = useTheme();

  return (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <Select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        sx={filterSelectStyle(theme)}
        displayEmpty
      >
        {SORTS.map((s) => (
          <MenuItem key={s.value} value={s.value} sx={{ fontSize: '0.82rem' }}>
            {s.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
