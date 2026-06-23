/**
 * Палитра цветов для скалодромов.
 * Цвета назначаются детерминированно на основе названия зала.
 */

/** Палитра для категориальных данных (пирамида грейдов, типы пролазов, навыки радара) */
export const CATEGORY_COLORS = [
  '#E53935',
  '#FB8C00',
  '#FDD835',
  '#43A047',
  '#1E88E5',
  '#8E24AA',
  '#EC407A',
  '#00838F',
  '#6D4C41',
  '#757575',
  '#3949AB',
  '#D81B60',
];

const GYM_COLORS = [
  { bg: '#1E88E5', glow: '#1E88E5' },  // синий
  { bg: '#8E24AA', glow: '#8E24AA' },  // фиолетовый
  { bg: '#E53935', glow: '#E53935' },  // красный
  { bg: '#43A047', glow: '#43A047' },  // зелёный
  { bg: '#FB8C00', glow: '#FB8C00' },  // оранжевый
  { bg: '#00838F', glow: '#00838F' },  // циан
  { bg: '#6D4C41', glow: '#6D4C41' },  // коричневый
  { bg: '#3949AB', glow: '#3949AB' },  // индиго
  { bg: '#C0CA33', glow: '#C0CA33' },  // лайм
  { bg: '#D81B60', glow: '#D81B60' },  // розовый
];

const DEFAULT_GYM_STYLE = { bg: '#424242', glow: 'rgba(255,255,255,0.15)' };

/** Простейший хеш строки */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Возвращает детерминированный стиль бейджа для зала по его названию.
 */
export function getGymStyle(name: string): { bg: string; glow: string } {
  if (!name) return DEFAULT_GYM_STYLE;
  const index = hashString(name) % GYM_COLORS.length;
  return GYM_COLORS[index];
}
