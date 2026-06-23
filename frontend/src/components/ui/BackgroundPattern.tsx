import { useTheme } from '@mui/material';

interface BackgroundPatternProps {
  /** Множитель opacity для линий (1.0 = как на лендинге) */
  intensity?: number;
}

/**
 * Топографический SVG-паттерн — как на лендинге.
 * Используется на фоне страниц: ярче на логине/регистрации,
 * еле заметный на страницах дашборда.
 */
export function BackgroundPattern({ intensity = 1.0 }: BackgroundPatternProps) {
  const theme = useTheme();
  const color = theme.palette.primary.main;

  const paths = [
    { d: 'M0,250 Q300,100 600,250 T1200,200', sw: 1.5, op: 0.12 },
    { d: 'M0,270 Q300,120 600,270 T1200,220', sw: 1, op: 0.1 },
    { d: 'M0,290 Q300,140 600,290 T1200,240', sw: 1, op: 0.08 },
    { d: 'M0,230 Q300,80  600,230 T1200,180', sw: 1, op: 0.1 },
    { d: 'M0,210 Q300,60  600,210 T1200,160', sw: 0.8, op: 0.07 },
    { d: 'M0,310 Q300,160 600,310 T1200,260', sw: 0.8, op: 0.07 },
    { d: 'M0,330 Q300,180 600,330 T1200,280', sw: 0.5, op: 0.05 },
  ];

  return (
    <svg
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill="none"
          stroke={color}
          strokeWidth={p.sw}
          opacity={p.op * intensity}
        />
      ))}
    </svg>
  );
}
