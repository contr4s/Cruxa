import { Box, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { Schedule, AttachMoney } from '@mui/icons-material';
import type { GymDto } from '../../types/gym';

interface GymHoursPricesBlockProps {
  prices: GymDto['prices'];
  hours: GymDto['hours'];
}

const MAX_PRICES = 3;

export function GymHoursPricesBlock({ prices, hours }: GymHoursPricesBlockProps) {
  const theme = useTheme();
  const [showAllPrices, setShowAllPrices] = useState(false);
  const visiblePrices = showAllPrices ? prices : prices.slice(0, MAX_PRICES);

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: theme.palette.text.secondary }}>
          <Schedule sx={{ fontSize: 16 }} />
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>Часы работы</Typography>
        </Box>
        {Object.entries(hours).map(([days, time]) => (
          <Typography key={days} sx={{ fontSize: '0.82rem', color: theme.palette.text.secondary, pl: 2.5 }}>
            {days}: {time}
          </Typography>
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: theme.palette.text.secondary }}>
          <AttachMoney sx={{ fontSize: 16 }} />
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>Цены</Typography>
        </Box>
        {visiblePrices.map((p) => (
          <Typography key={p.name} sx={{ fontSize: '0.82rem', color: theme.palette.text.secondary, pl: 2.5 }}>
            {p.name} — {p.price.toLocaleString()} ₽
          </Typography>
        ))}
        {prices.length > MAX_PRICES && (
          <Typography
            onClick={() => setShowAllPrices(!showAllPrices)}
            sx={{ fontSize: '0.78rem', fontWeight: 600, color: theme.palette.primary.main, pl: 2.5, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            {showAllPrices ? 'Скрыть' : `Показать все (${prices.length})`}
          </Typography>
        )}
      </Box>
    </>
  );
}
