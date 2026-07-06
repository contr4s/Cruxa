// @ts-expect-error — qrcode ships its own types
import qrcode from 'qrcode';
import { jsPDF } from 'jspdf';
import type { RouteDto } from '../types/route';
import { QR_PDF_LAYOUT_MAP } from '../constants/routes';

const MM = 0.264583; // px → mm at 96dpi

// jsPDF built-in fonts don't support Cyrillic, so we render labels on a canvas.
// ponytail: replace with embedded TTF font when labels need vector sharpness at scale
function textImageData(text: string, px: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  ctx.font = `600 ${px}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  const m = ctx.measureText(text);
  canvas.width = Math.ceil(m.width);
  canvas.height = Math.ceil(px * 1.4);
  ctx.font = `600 ${px}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = '#333';
  ctx.textBaseline = 'top';
  ctx.fillText(text, 0, 0);
  return canvas;
}

export async function generateQrPdfBlob(routes: RouteDto[], qrPerPage: number, baseUrl: string): Promise<Blob> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageW = 210;
  const pageH = 297;
  const margin = 5;
  const gap = 5; // spacing between items

  const { cols, rows } = QR_PDF_LAYOUT_MAP[qrPerPage] ?? { cols: 3, rows: 4 };
  const cellW = (pageW - margin * 2) / cols;
  const cellH = (pageH - margin * 2) / rows;
  const qrSize = Math.min(cellW, cellH) - gap * 2;

  for (let i = 0; i < routes.length; i++) {
    if (i > 0 && i % qrPerPage === 0) pdf.addPage();

    const pos = i % qrPerPage;
    const col = pos % cols;
    const row = Math.floor(pos / cols);
    const cx = margin + col * cellW;
    const cy = margin + row * cellH;

    const route = routes[i];

    // QR — full URL so scanner opens the site
    const url = `${baseUrl.replace(/\/+$/, '')}/route/${route.id}`;
    const dataUrl = await qrcode.toDataURL(url, {
      width: Math.round(qrSize / MM),
      margin: 1,
    });
    const qrX = cx + (cellW - qrSize) / 2;
    const qrY = cy + 3;
    pdf.addImage(dataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

    // label: just the route name (rendered on canvas for Cyrillic support)
    const fontSizePx = Math.min(11, cellW / 6);
    const labelCanvas = textImageData(route.name, fontSizePx);
    const labelW = labelCanvas.width * MM;
    const labelH = labelCanvas.height * MM;
    const labelY = qrY + qrSize + 2;
    const lx = cx + (cellW - labelW) / 2;
    if (lx + labelW <= cx + cellW) {
      pdf.addImage(labelCanvas, 'PNG', lx, labelY, labelW, labelH);
    }
  }

  return pdf.output('blob');
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
