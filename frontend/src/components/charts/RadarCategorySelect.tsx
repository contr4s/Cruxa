import { Select, MenuItem, FormControl, useTheme } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

const CATEGORY_LABELS: Record<string, string> = {
  style: 'Стиль',
  relief: 'Рельеф',
  hold: 'Зацеп',
  type: 'Тип',
};

interface RadarCategorySelectProps {
  categories: Record<string, unknown[]>;
  value: string;
  onChange: (value: string) => void;
}

export function RadarCategorySelect({ categories, value, onChange }: RadarCategorySelectProps) {
  const theme = useTheme();
  const categoryKeys = Object.keys(categories);
  if (categoryKeys.length <= 1) return null;

  return (
    <FormControl size="small" sx={{ minWidth: 100 }} className="swiper-no-swiping" onMouseDown={(e) => e.stopPropagation()}>
      <Select
        value={categoryKeys.includes(value) ? value : categoryKeys[0] ?? ''}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          fontSize: '0.78rem',
          color: theme.palette.text.secondary,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.divider },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
        }}
      >
        {categoryKeys.map((key) => (
          <MenuItem key={key} value={key} sx={{ fontSize: '0.78rem' }}>
            {CATEGORY_LABELS[key] || key}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
