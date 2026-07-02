/**
 * Цвета зацеп по цвету (holdColor)
 */
export const HOLD_COLORS: Record<string, string> = {
  Red: '#E53935',
  Blue: '#1E88E5',
  Green: '#43A047',
  Yellow: '#FDD835',
  Purple: '#8E24AA',
  Orange: '#FB8C00',
  Pink: '#EC407A',
  White: '#BDBDBD',
  Black: '#424242',
  Brown: '#8D6E63',
  Gray: '#757575',
  Multi: 'linear-gradient(135deg,#E53935,#FDD835,#1E88E5,#43A047)',
};

export const QR_PDF_LAYOUTS: { cols: number; rows: number }[] = [
  { cols: 1, rows: 1 },
  { cols: 1, rows: 2 },
  { cols: 2, rows: 2 },
  { cols: 2, rows: 3 },
  { cols: 2, rows: 4 },
  { cols: 3, rows: 4 },
  { cols: 3, rows: 5 },
  { cols: 4, rows: 5 },
  { cols: 4, rows: 6 },
  { cols: 4, rows: 7 },
  { cols: 5, rows: 7 },
  { cols: 5, rows: 8 },
];

const _qrMap = Object.fromEntries(
  QR_PDF_LAYOUTS.map((l) => [l.cols * l.rows, l])
) as Record<number, { cols: number; rows: number }>;

export const QR_PDF_LAYOUT_MAP: Record<number, { cols: number; rows: number }> = _qrMap;

export const QR_PDF_GRID_LABELS = Object.fromEntries(
  Object.entries(_qrMap).map(([k, v]) => [k, `${v.cols}×${v.rows}`])
) as Record<number, string>;
