import { useCallback, useMemo } from 'react';
import { Box, Chip, FormControl, Select, MenuItem, TextField, Typography, Slider, useTheme } from '@mui/material';
import { filterSelectStyle } from '../../theme/cardStyles';
import { CollapsibleFilterBar } from './CollapsibleFilterBar';
import {
  ROUTE_TYPE_OPTIONS,
  SORT_OPTIONS,
  GRADE_LABELS,
  GRADE_MIN,
  GRADE_MAX,
} from '../../constants/filters';
import { HOLD_COLORS } from '../../constants/routes';
import { useTags } from '../../services/hooks/useTags';

export interface RouteFiltersValues {
  searchQuery: string;
  type: string;
  holdColor: string;
  status: 'all' | 'Active' | 'Archived';
  sort: string;
  gymId?: string; // опционально — заполняется из слота gyms
  sector?: string; // опционально — заполняется из слота sectors
  setterId?: string; // опционально — заполняется из слота setters
  minGradeIndex: number;
  maxGradeIndex: number;
  minRating: number;
  maxRating: number;
  minAscents: number;
  maxAscents: number;
  createdWithin: number;
  tags: string;
}

export interface RouteFiltersSlots {
  gyms?: { id: string; name: string }[];
  sectors?: { id: string; name: string }[];
  setters?: { id: string; name: string }[];
}

interface RouteFiltersProps {
  filters: RouteFiltersValues;
  onChange: (filters: RouteFiltersValues) => void;
  slots?: RouteFiltersSlots;
  defaults?: Partial<RouteFiltersValues>;
  /** Позволяет заменить стандартный триггер панели на кастомный (например, иконка в заголовке секции) */
  filterTrigger?: (bag: { open: boolean; toggle: () => void; activeCount: number }) => React.ReactNode;
}

// Helper: плоский Set выбранных тегов
function selectedTagsSet(tagFilter: string): Set<string> {
  if (!tagFilter) return new Set();
  return new Set(tagFilter.split(',').map((t) => t.trim().toLowerCase()));
}
// Helper: добавить/убрать тег
function toggleTagFilter(tagFilter: string, tag: string): string {
  const set = selectedTagsSet(tagFilter);
  if (set.has(tag)) set.delete(tag);
  else set.add(tag);
  return Array.from(set).join(',');
}

const HOLD_COLOR_NAMES = ['all', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'White', 'Black', 'Gray', 'Brown'];
const STATUS_OPTIONS = [
  { value: 'all', label: 'Все' },
  { value: 'Active', label: 'Активные' },
  { value: 'Archived', label: 'Архив' },
];

const CHIP_SX = { height: 26, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' };

// Прогрессивная шкала рейтинга: от 0 до 3 — грубо, от 3 до 5 — тонко
const RATING_STEPS = [0, 1, 2, 3, 3.25, 3.5, 3.75, 4, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5];

function ratingIndex(v: number): number {
  const idx = RATING_STEPS.indexOf(v);
  return idx >= 0 ? idx : 0;
}

// Шкала «давность»: 0 = любое время, остальное — progressive days
const CREATED_WITHIN_DAYS = [0, 1, 3, 7, 14, 30, 60, 90, 180, 365];
const CREATED_WITHIN_MARKS = [
  { value: 0, label: 'Когда угодно' },
  { value: 1, label: '1д' },
  { value: 2, label: '3д' },
  { value: 3, label: '1н' },
  { value: 4, label: '2н' },
  { value: 5, label: '1м' },
  { value: 7, label: '3м' },
  { value: 9, label: '1г' },
];

function createdWithinLabel(index: number): string {
  const days = CREATED_WITHIN_DAYS[index];
  if (!days || days === 0) return 'Когда угодно';
  if (days === 1) return 'За последние 24ч';
  if (days < 30) return `За последние ${days} дн.`;
  return `За последние ${Math.round(days / 30)} мес.`;
}

function createdWithinIndex(days: number): number {
  const idx = CREATED_WITHIN_DAYS.indexOf(days);
  return idx >= 0 ? idx : 0;
}

function activeCount(f: RouteFiltersValues, def: Partial<RouteFiltersValues>): number {
  let n = 0;
  if (f.searchQuery) n++;
  if (f.type !== 'all') n++;
  if (f.holdColor !== 'all') n++;
  if (f.status !== 'all') n++;
  if (f.gymId && f.gymId !== 'all') n++;
  if (f.sector && f.sector !== 'all') n++;
  if (f.setterId && f.setterId !== 'all') n++;
  if (f.sort !== (def.sort || 'newest')) n++;
  if (f.minGradeIndex !== (def.minGradeIndex ?? GRADE_MIN) || f.maxGradeIndex !== (def.maxGradeIndex ?? GRADE_MAX)) n++;
  if (f.minRating !== (def.minRating ?? 0) || f.maxRating !== (def.maxRating ?? 5)) n++;
  if (f.minAscents !== (def.minAscents ?? 0) || f.maxAscents !== (def.maxAscents ?? 10000)) n++;
  if (f.createdWithin > 0) n++;
  if (f.tags) n++;
  return n;
}

function FilterSlider({ label, value, min, max, step, onChange, displayLabel }: {
  label: string;
  value: number[];
  min: number;
  max: number;
  step: number;
  onChange: (v: number[]) => void;
  displayLabel: string;
}) {
  const theme = useTheme();
  return (
    <Box sx={{ minWidth: { xs: '100%', sm: 220 }, px: 1 }}>
      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'text.secondary' }}>
        {label}: {displayLabel}
      </Typography>
      <Slider
        size="small"
        value={value}
        onChange={(_, v) => onChange(v as number[])}
        min={min} max={max} step={step}
        valueLabelDisplay="off"
        sx={{ color: theme.palette.primary.main, '& .MuiSlider-thumb': { width: 14, height: 14 } }}
      />
    </Box>
  );
}
function FilterRow({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', width: { xs: '100%', sm: 'auto' } }}>
      {label && <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'text.secondary', mr: 0.5, whiteSpace: 'nowrap' }}>{label}</Typography>}
      {children}
    </Box>
  );
}

export function RouteFilters({ filters, onChange, slots, defaults = {}, filterTrigger }: RouteFiltersProps) {
  const theme = useTheme();
  const update = useCallback((patch: Partial<RouteFiltersValues>) => onChange({ ...filters, ...patch }), [filters, onChange]);
  const { data: apiTags } = useTags();

  const tagGroups = useMemo(() => {
    if (!apiTags) return [];
    const map = new Map<string, { name: string }[]>();
    apiTags.forEach((t) => {
      if (!map.has(t.category)) map.set(t.category, []);
      map.get(t.category)!.push({ name: t.name });
    });
    return Array.from(map.entries()).map(([category, items]) => ({ category, items }));
  }, [apiTags]);

  const chipSx = (active: boolean) => ({
    ...CHIP_SX,
    background: active ? theme.palette.primary.main : theme.custom.surface2,
    color: active ? theme.palette.primary.contrastText : theme.palette.text.secondary,
    '&:hover': { background: active ? theme.palette.primary.dark : theme.custom.surface3 },
  });

  return (
    <CollapsibleFilterBar activeCount={activeCount(filters, defaults)} trigger={filterTrigger}>
      <TextField label="Поиск" size="small" value={filters.searchQuery} onChange={(e) => update({ searchQuery: e.target.value })} sx={{ minWidth: 180, width: { xs: '100%', sm: 180 } }} />

      <FilterRow label="Тип:">
        {ROUTE_TYPE_OPTIONS.map((t) => (
          <Chip key={t.value} label={t.label} size="small" onClick={() => update({ type: t.value })} sx={chipSx(filters.type === t.value)} />
        ))}
      </FilterRow>

      <FilterRow label="Зацепки:">
        <Chip label="Все" size="small" onClick={() => update({ holdColor: 'all' })} sx={chipSx(filters.holdColor === 'all')} />
        {HOLD_COLOR_NAMES.filter((c) => c !== 'all').map((color) => (
          <Chip
            key={color}
            size="small"
            onClick={() => update({ holdColor: color })}
            sx={{ width: 26, height: 26, background: HOLD_COLORS[color] || color, border: filters.holdColor === color ? '2px solid ' + theme.palette.primary.main : '1px solid ' + theme.palette.divider, cursor: 'pointer' }}
          />
        ))}
      </FilterRow>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', width: '100%' }}>
        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 } }}>
          <Select value={filters.status} onChange={(e) => update({ status: e.target.value as 'all' | 'Active' | 'Archived' })} sx={filterSelectStyle(theme)} displayEmpty>
            {STATUS_OPTIONS.map((s) => (<MenuItem key={s.value} value={s.value} sx={{ fontSize: '0.82rem' }}>{s.label}</MenuItem>))}
          </Select>
        </FormControl>

        {slots?.gyms && (
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
            <Select value={filters.gymId ?? 'all'} onChange={(e) => update({ gymId: e.target.value })} sx={filterSelectStyle(theme)} displayEmpty>
              <MenuItem value="all" sx={{ fontSize: '0.82rem' }}>Все залы</MenuItem>
              {slots.gyms.map((g) => (<MenuItem key={g.id} value={g.id} sx={{ fontSize: '0.82rem' }}>{g.name}</MenuItem>))}
            </Select>
          </FormControl>
        )}

        {slots?.sectors && slots.sectors.length > 0 && (
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
            <Select value={filters.sector ?? 'all'} onChange={(e) => update({ sector: e.target.value })} sx={filterSelectStyle(theme)} displayEmpty>
              <MenuItem value="all" sx={{ fontSize: '0.82rem' }}>Все сектора</MenuItem>
              {slots.sectors.map((s) => (<MenuItem key={s.id} value={s.id} sx={{ fontSize: '0.82rem' }}>{s.name}</MenuItem>))}
            </Select>
          </FormControl>
        )}

        {slots?.setters && slots.setters.length > 0 && (
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
            <Select value={filters.setterId ?? 'all'} onChange={(e) => update({ setterId: e.target.value })} sx={filterSelectStyle(theme)} displayEmpty>
              <MenuItem value="all" sx={{ fontSize: '0.82rem' }}>Все рутсеттеры</MenuItem>
              {slots.setters.map((s) => (<MenuItem key={s.id} value={s.id} sx={{ fontSize: '0.82rem' }}>{s.name}</MenuItem>))}
            </Select>
          </FormControl>
        )}

        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
          <Select value={filters.sort} onChange={(e) => update({ sort: e.target.value })} sx={filterSelectStyle(theme)} displayEmpty>
            {SORT_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value} sx={{ fontSize: '0.82rem' }}>{o.label}</MenuItem>))}
          </Select>
        </FormControl>
      </Box>

      <FilterSlider
        label="Сложность"
        value={[filters.minGradeIndex, filters.maxGradeIndex]}
        min={GRADE_MIN} max={GRADE_MAX} step={1}
        onChange={([a, b]) => update({ minGradeIndex: a, maxGradeIndex: b })}
        displayLabel={`${GRADE_LABELS[filters.minGradeIndex] ?? filters.minGradeIndex} — ${GRADE_LABELS[filters.maxGradeIndex] ?? filters.maxGradeIndex}`}
      />

      <FilterSlider
        label="Рейтинг"
        value={[ratingIndex(filters.minRating), ratingIndex(filters.maxRating)]}
        min={0} max={RATING_STEPS.length - 1} step={1}
        onChange={([a, b]) => update({ minRating: RATING_STEPS[a], maxRating: RATING_STEPS[b] })}
        displayLabel={`${filters.minRating.toFixed(1)} — ${filters.maxRating.toFixed(1)}`}
      />

      <FilterSlider
        label="Пролазы"
        value={[filters.minAscents, filters.maxAscents]}
        min={0} max={1000} step={10}
        onChange={([a, b]) => update({ minAscents: a, maxAscents: b })}
        displayLabel={`${filters.minAscents} — ${filters.maxAscents}`}
      />

      <FilterSlider
        label="Накручена"
        value={[createdWithinIndex(filters.createdWithin)]}
        min={0} max={CREATED_WITHIN_MARKS.length - 1} step={1}
        onChange={([v]) => update({ createdWithin: CREATED_WITHIN_DAYS[v] ?? 0 })}
        displayLabel={`${createdWithinLabel(filters.createdWithin > 0 ? CREATED_WITHIN_DAYS.indexOf(filters.createdWithin) : 0)}`}
      />

      {tagGroups.map(({ category, items }) => (
        <FilterRow key={category} label={`${category}:`}>
          {items.map((t) => {
            const active = selectedTagsSet(filters.tags).has(t.name);
            return (
              <Chip
                key={t.name}
                label={t.name}
                size="small"
                onClick={() => update({ tags: toggleTagFilter(filters.tags, t.name) })}
                sx={chipSx(active)}
              />
            );
          })}
        </FilterRow>
      ))}
    </CollapsibleFilterBar>
  );
}
