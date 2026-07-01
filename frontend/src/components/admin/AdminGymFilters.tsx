import { useTheme } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { CollapsibleFilterBar } from '../ui/CollapsibleFilterBar';
import type { AdminGymFilterState } from '../../types/admin';

interface AdminGymFiltersProps {
  filters: AdminGymFilterState;
  onChange: (filters: AdminGymFilterState) => void;
}

export function AdminGymFilters({ filters, onChange }: AdminGymFiltersProps) {
  const theme = useTheme();

  const selectSx = {
    background: theme.custom.surface2,
    color: theme.palette.text.secondary,
    fontSize: '0.78rem',
    fontWeight: 600,
    minWidth: 150,
    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
    '& .MuiSvgIcon-root': { color: theme.custom.text3 },
    '&:hover': { borderColor: theme.palette.primary.main },
  };

  const activeCount =
    (filters.city !== 'all' ? 1 : 0) +
    (filters.status !== 'all' ? 1 : 0);

  return (
    <CollapsibleFilterBar activeCount={activeCount}>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="filter-city-label" sx={{ color: theme.palette.text.secondary, fontSize: '0.78rem' }}>
          Город
        </InputLabel>
        <Select
          labelId="filter-city-label"
          value={filters.city}
          label="Город"
          onChange={(e) => onChange({ ...filters, city: e.target.value })}
          sx={selectSx}
        >
          <MenuItem value="all">Все города</MenuItem>
          <MenuItem value="Москва">Москва</MenuItem>
          <MenuItem value="Санкт-Петербург">СПб</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="filter-status-label" sx={{ color: theme.palette.text.secondary, fontSize: '0.78rem' }}>
          Статус
        </InputLabel>
        <Select
          labelId="filter-status-label"
          value={filters.status}
          label="Статус"
          onChange={(e) => onChange({ ...filters, status: e.target.value as AdminGymFilterState['status'] })}
          sx={selectSx}
        >
          <MenuItem value="all">Все статусы</MenuItem>
          <MenuItem value="Active">Активные</MenuItem>
          <MenuItem value="Pending">На модерации</MenuItem>
          <MenuItem value="Blocked">Заблокированные</MenuItem>
        </Select>
      </FormControl>
    </CollapsibleFilterBar>
  );
}
