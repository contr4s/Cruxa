/**
 * Единые настройки тултипов для Chart.js.
 * Используется во всех графиках: CombinedChart, RadarChart, AscentDonut.
 */
export const CHART_TOOLTIP = {
  backgroundColor: '#1C2221',
  titleColor: '#F0F0F0',
  bodyColor: '#BDBDBD',
  borderColor: '#2D3D3A',
  borderWidth: 1,
  padding: 10,
} as const;

/**
 * Единая анимация для графиков
 */
export const CHART_ANIMATION = {
  duration: 1200,
} as const;
