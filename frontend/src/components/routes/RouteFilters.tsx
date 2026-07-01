import { useCallback } from 'react';
import { Box, Chip, FormControl, Select, MenuItem, Slider, Typography, useTheme } from '@mui/material';
import { filterSelectStyle } from '../../theme/cardStyles';
import { HOLD_COLORS } from '../../constants/routes';

export interface RouteFilterState {
  type: string;
  holdColor: string;
  minGradeIndex: number;
  maxGradeIndex: number;
  setterId: string;
  sort: string;
}

interface RouteFiltersProps {
  filters: RouteFilterState;
  onChange: (filters: RouteFilterState) => void;
  setters: { id: string; name: string }[];
  showStatusFilter?: boolean;
  showSectorFilter?: boolean;
  sectors?: { id: string; name: string }[];
  gyms?: { id: string; name: string }[];
}

const TYPES = [
  { value: 'all', label: 'Все' },
  { value: 'Boulder', label: 'Боулдер' },
  { value: 'Lead', label: 'Lead' },
  { value: 'TopRope', label: 'Top-rope' },
  { value: 'Speed', label: 'Скорость' },
];

const SORTS = [
  { value: 'newest', label: 'По новизне' },
  { value: 'grade_asc', label: 'По сложности ↑' },
  { value: 'grade_desc', label: 'По сложности ↓' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'ascents', label: 'По пролазам' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'Все' },
  { value: 'Active', label: 'Активные' },
  { value: 'Archived', label: 'Архив' },
];

const MIN_GRADE = 0;
const MAX_GRADE = 20;
const GRADE_LABELS: Record<number, string> = {
  0: '4A', 1: '4B', 2: '4C', 3: '5A', 4: '5B', 5: '5B+', 6: '5C', 7: '5C+', 8: '6A', 9: '6A+',
  10: '6B', 11: '6B+', 12: '6C', 13: '6C+', 14: '7A', 15: '7A+', 16: '7B', 17: '7B+', 18: '7C', 19: '8A', 20: '8B',
};

export function RouteFilters({ filters, onChange, setters, showStatusFilter, showSectorFilter, sectors, gyms }: RouteFiltersProps) {
  const theme = useTheme();

  const update = useCallback(
    (patch: Partial<RouteFilterState>) => {
      onChange({ ...filters, ...patch });
    },
    [filters, onChange]
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: theme.palette.text.secondary, mr: 0.5 }}>
          Тип:
        </Typography>
        {TYPES.map((t) => (
          <Chip
            key={t.value}
            label={t.label}
            size="small"
            onClick={() => update({ type: t.value })}
            sx={{
              height: 26,
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: filters.type === t.value ? theme.palette.primary.main : theme.custom.surface2,
              color: filters.type === t.value ? theme.palette.primary.contrastText : theme.palette.text.secondary,
              '&:hover': {
                background: filters.type === t.value ? theme.palette.primary.dark : theme.custom.surface3,
              },
            }}
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: theme.palette.text.secondary, mr: 0.5 }}>
          Зацепки:
        </Typography>
        <Chip
          label="Все"
          size="small"
          onClick={() => update({ holdColor: 'all' })}
          sx={{
            height: 26,
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
            background: filters.holdColor === 'all' ? theme.palette.primary.main : theme.custom.surface2,
            color: filters.holdColor === 'all' ? theme.palette.primary.contrastText : theme.palette.text.secondary,
          }}
        />
        {Object.entries(HOLD_COLORS).map(([color, bg]) => (
          <Chip
            key={color}
            size="small"
            onClick={() => update({ holdColor: color })}
            sx={{
              width: 26,
              height: 26,
              background: bg,
              border: filters.holdColor === color ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
              cursor: 'pointer',
            }}
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 200 }}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: theme.palette.text.secondary }}>
            Сложность: {GRADE_LABELS[filters.minGradeIndex] ?? filters.minGradeIndex} — {GRADE_LABELS[filters.maxGradeIndex] ?? filters.maxGradeIndex}
          </Typography>
          <Slider
            value={[filters.minGradeIndex, filters.maxGradeIndex]}
            onChange={(_, v) => {
              const [min, max] = v as number[];
              update({ minGradeIndex: min, maxGradeIndex: max });
            }}
            min={MIN_GRADE}
            max={MAX_GRADE}
            step={1}
            valueLabelDisplay="off"
            sx={{
              color: theme.palette.primary.main,
              '& .MuiSlider-thumb': { width: 14, height: 14 },
            }}
          />
        </Box>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={filters.setterId}
            onChange={(e) => update({ setterId: e.target.value })}
            sx={filterSelectStyle(theme)}
            displayEmpty
          >
            <MenuItem value="all" sx={{ fontSize: '0.82rem' }}>Все рутсеттеры</MenuItem>
            {setters.map((s) => (
              <MenuItem key={s.id} value={s.id} sx={{ fontSize: '0.82rem' }}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {showSectorFilter && sectors && sectors.length > 0 && (
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={(filters as unknown as Record<string, string>).sector ?? 'all'}
              onChange={(e) => update({ sector: e.target.value } as Partial<RouteFilterState>)}
              sx={filterSelectStyle(theme)}
              displayEmpty
            >
              <MenuItem value="all" sx={{ fontSize: '0.82rem' }}>Все сектора</MenuItem>
              {sectors.map((s) => (
                <MenuItem key={s.id} value={s.id} sx={{ fontSize: '0.82rem' }}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {showStatusFilter && (
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <Select
              value={(filters as unknown as Record<string, string>).status ?? 'all'}
              onChange={(e) => update({ status: e.target.value } as Partial<RouteFilterState>)}
              sx={filterSelectStyle(theme)}
              displayEmpty
            >
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s.value} value={s.value} sx={{ fontSize: '0.82rem' }}>
                  {s.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {gyms && gyms.length > 0 && (
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={(filters as unknown as Record<string, string>).gymId ?? 'all'}
              onChange={(e) => update({ gymId: e.target.value } as Partial<RouteFilterState>)}
              sx={filterSelectStyle(theme)}
              displayEmpty
            >
              <MenuItem value="all" sx={{ fontSize: '0.82rem' }}>Все залы</MenuItem>
              {gyms.map((g) => (
                <MenuItem key={g.id} value={g.id} sx={{ fontSize: '0.82rem' }}>
                  {g.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value })}
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
      </Box>
    </Box>
  );
}
