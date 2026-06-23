import type { Chart } from 'chart.js';

interface CenterTextConfig {
  /** Key under `options.plugins.centerText` where the numeric value is stored */
  valueKey: string;
  /** Label shown below the value */
  label: string;
  /** Font size of the main value */
  valueFontSize?: number;
  /** Font size of the label */
  labelFontSize?: number;
  /** Hook into which the plugin draws */
  hook?: 'beforeDraw' | 'beforeDatasetsDraw' | 'afterDraw' | 'afterDatasetsDraw';
}

/**
 * Creates a Chart.js plugin that renders centered text (value + label)
 * inside a chart (radar, doughnut, etc.).
 *
 * Usage:
 *   plugins: [createCenterTextPlugin({ valueKey: 'avg', label: 'среднее' })]
 *   options: { plugins: { centerText: { avg: 66 } } }
 */
export function createCenterTextPlugin(config: CenterTextConfig) {
  const {
    valueKey,
    label,
    valueFontSize = 26,
    labelFontSize = 12,
    hook = 'beforeDatasetsDraw',
  } = config;

  return {
    id: 'centerText',
    [hook](chart: Chart) {
      const value = (chart.options.plugins as any)?.centerText?.[valueKey] as number | undefined;
      if (value === undefined) return;

      const { width, height, ctx } = chart;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.font = `700 ${valueFontSize}px Inter, system-ui, sans-serif`;
      ctx.fillStyle = '#F0F0F0';
      ctx.fillText(`${value}`, centerX, centerY - labelFontSize / 2 - 2);

      ctx.font = `500 ${labelFontSize}px Inter, system-ui, sans-serif`;
      ctx.fillStyle = '#c5c5c5';
      ctx.fillText(label, centerX, centerY + labelFontSize / 2 + 4);

      ctx.restore();
    },
  };
}
