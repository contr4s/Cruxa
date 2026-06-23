/**
 * Цвета рейтинга трасс
 */
export const RATING_COLORS = {
  high: '#43A047',
  medium: '#FDD835',
  low: '#757575',
};

export function getRatingColor(value: number): string {
  if (value >= 4.5) return RATING_COLORS.high;
  if (value >= 4.0) return RATING_COLORS.medium;
  return RATING_COLORS.low;
}
