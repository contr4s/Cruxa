import { keyframes } from '@mui/material';
import type { SxProps } from '@mui/system';

export const heartBeat = keyframes`
  0%   { transform: scale(1); }
  15%  { transform: scale(1.3); }
  30%  { transform: scale(1); }
  45%  { transform: scale(1.15); }
  60%  { transform: scale(1); }
`;

export const growWidth = keyframes`
  from { width: 0; }
`;

/* ── PostCard ─────────────────────────────────── */

export const postCardSx: SxProps = {
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 2,
  bgcolor: 'background.paper',
  overflow: 'hidden',
};

export const postHeaderSx: SxProps = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  px: 2.5,
  pt: 2,
  pb: 1,
};

export const postAuthorSx: SxProps = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  px: 2.5,
  pb: 1.5,
};

/* ── Ascent row ────────────────────────────────── */

export function ascentDotSx(color: string, size = 10): SxProps {
  return {
    width: size,
    height: size,
    borderRadius: '50%',
    bgcolor: color,
    flexShrink: 0,
  };
}

export function ascentBadgeSx(bgColor: string): SxProps {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    px: 1,
    py: 0.25,
    borderRadius: '100px',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#fff',
    bgcolor: bgColor,
    lineHeight: 1.4,
  };
}

export const ascentRowSx: SxProps = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  py: 0.5,
  px: 2.5,
  '&:hover': { bgcolor: 'action.hover' },
};

/* ── Gym badge ─────────────────────────────────── */

export function gymBadgeSx(bgColor: string): SxProps {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.5,
    background: `${bgColor}22`,
    color: bgColor,
    borderRadius: '100px',
    px: 1.25,
    py: 0.35,
    fontSize: '0.78rem',
    fontWeight: 700,
  };
}
