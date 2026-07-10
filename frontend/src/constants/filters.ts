export const ROUTE_TYPE_OPTIONS = [
  { value: 'all', label: 'Все' },
  { value: 'Bouldering', label: 'Боулдер' },
  { value: 'Lead', label: 'Трудность' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'По новизне' },
  { value: 'oldest', label: 'По дате ↑' },
  { value: 'GradeAsc', label: 'По сложности ↑' },
  { value: 'GradeDesc', label: 'По сложности ↓' },
  { value: 'RatingDesc', label: 'По рейтингу ↓' },
  { value: 'RatingAsc', label: 'По рейтингу ↑' },
  { value: 'AscentsDesc', label: 'По пролазам ↓' },
  { value: 'AscentsAsc', label: 'По пролазам ↑' },
  { value: 'NameAsc', label: 'По имени А-Я' },
  { value: 'NameDesc', label: 'По имени Я-А' },
];

export const GRADE_LABELS: Record<number, string> = {
  400: '4a', 420: '4b', 440: '4c',
  460: '5a', 480: '5b', 500: '5c',
  520: '6a', 540: '6a+', 560: '6b',
  580: '6b+', 600: '6c', 620: '6c+',
  640: '7a', 660: '7a+', 680: '7b',
  700: '7b+', 720: '7c', 740: '7c+',
  760: '8a', 780: '8a+', 800: '8b',
};

export const GRADE_MIN = 400;
export const GRADE_MAX = 800;

export const HOLD_COLOR_NAMES = ['all', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'White', 'Black', 'Gray', 'Brown'] as const;
