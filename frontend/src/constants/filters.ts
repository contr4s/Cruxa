export const ROUTE_TYPE_OPTIONS = [
  { value: 'all', label: 'Все' },
  { value: 'Boulder', label: 'Боулдер' },
  { value: 'Lead', label: 'Трудность' },
  { value: 'TopRope', label: 'Верхняя' },
  { value: 'Speed', label: 'Скорость' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'По новизне' },
  { value: 'oldest', label: 'По дате ↑' },
  { value: 'grade_asc', label: 'По сложности ↑' },
  { value: 'grade_desc', label: 'По сложности ↓' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'ascents', label: 'По пролазам' },
  { value: 'name_asc', label: 'По имени А-Я' },
  { value: 'name_desc', label: 'По имени Я-А' },
];

export const GRADE_LABELS: Record<number, string> = {
  0: '4A', 1: '4B', 2: '4C', 3: '5A', 4: '5B', 5: '5C', 6: '5C+',
  7: '6A', 8: '6A+', 9: '6B', 10: '6B+', 11: '6C', 12: '6C+',
  13: '7A', 14: '7A+', 15: '7B', 16: '7B+', 17: '7C', 18: '7C+',
  19: '8A', 20: '8B', 21: '8B+', 22: '8C', 23: '8C+', 24: '9A', 25: '9A+',
};

export const GRADE_MIN = 0;
export const GRADE_MAX = 25;

export const HOLD_COLOR_NAMES = ['all', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'White', 'Black', 'Gray', 'Brown'] as const;
