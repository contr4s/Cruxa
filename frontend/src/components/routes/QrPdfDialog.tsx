import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import type { RouteDto } from '../../types/route';
import { pluralize } from '../../utils/pluralize';
import { QR_PDF_GRID_LABELS, QR_PDF_LAYOUT_MAP } from '../../constants/routes';

interface QrPdfDialogProps {
  open: boolean;
  routes: RouteDto[];
  onClose: () => void;
  onConfirm: (qrPerPage: number, baseUrl: string) => void;
}

const QR_OPTIONS = Object.keys(QR_PDF_LAYOUT_MAP).map(Number);
const BASE_URL = import.meta.env.VITE_QR_BASE_URL ?? 'https://cruxa.app';

export function QrPdfDialog({ open, routes, onClose, onConfirm }: QrPdfDialogProps) {
  const [qty, setQty] = useState<number>(20);
  const n = routes.length;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <QrCodeScannerIcon sx={{ color: 'primary.main' }} />
        PDF с QR-кодами
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
          Выбрано {n} {pluralize(n, ['трасса', 'трассы', 'трасс'])}.
        </Typography>

        <FormControl fullWidth size="small">
          <InputLabel>QR на страницу</InputLabel>
          <Select value={qty} label="QR на страницу" onChange={(e) => setQty(Number(e.target.value))}>
            {QR_OPTIONS.map((v) => (
              <MenuItem key={v} value={v}>
                {v} шт. — сетка {QR_PDF_GRID_LABELS[v]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Отмена</Button>
        <Button variant="contained" onClick={() => onConfirm(qty, BASE_URL)}>Скачать</Button>
      </DialogActions>
    </Dialog>
  );
}
