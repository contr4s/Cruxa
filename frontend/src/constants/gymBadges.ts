import type { SxProps } from '@mui/system';

/** Цвета бейджей залов из мокапа */
export const GYM_BADGE_COLORS: Record<string, string> = {
  RockZone: '#1E88E5',
  'Big Wall': '#E53935',
  BigWall: '#E53935',
  LimeIt: '#8E24AA',
  Лимейт: '#8E24AA',
};

export function getGymBadgeColor(gymName: string): string {
  return GYM_BADGE_COLORS[gymName] ?? '#757575';
}

export function gymBadgeSx(gymName: string): SxProps {
  const color = getGymBadgeColor(gymName);
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.5,
    background: `${color}22`,
    color,
    borderRadius: '100px',
    px: 1.25,
    py: 0.35,
    fontSize: '0.78rem',
    fontWeight: 700,
  };
}
