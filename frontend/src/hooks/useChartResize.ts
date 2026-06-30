import { useEffect, type RefObject } from 'react';
import type { Chart } from 'chart.js';

/**
 * Принудительно ресайзит chart.js-график под ширину контейнера.
 * Нужен когда `responsive: false` (для анимации при монтировании),
 * т.к. chart.js не тянет размер автоматически при выключенном responsive.
 */
export function useChartResize(
  chartRef: RefObject<Chart | null>,
  containerRef: RefObject<HTMLDivElement | null>,
  deps: unknown[],
) {
  useEffect(() => {
    const chart = chartRef.current;
    const container = containerRef.current;
    if (chart && container) {
      chart.resize(container.clientWidth, container.clientHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
