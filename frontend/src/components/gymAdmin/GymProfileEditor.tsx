import { Box, Typography, useTheme } from '@mui/material';
import { Card } from '../../theme/cardStyles';
import type { GymDto } from '../../types/gym';

interface GymProfileEditorProps {
  gym: GymDto;
}

export function GymProfileEditor({ gym }: GymProfileEditorProps) {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
      <Box sx={{ ...Card(theme), display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: theme.palette.text.primary }}>
          Основная информация
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <InfoRow label="Название" value={gym.name} />
          <InfoRow label="Город" value={gym.city} />
          <InfoRow label="Адрес" value={gym.address} />
          <InfoRow label="Описание" value={gym.description || '—'} />
          <InfoRow label="Телефон" value={gym.phone || '—'} />
          <InfoRow label="Email" value={gym.email || '—'} />
          <InfoRow label="Сайт" value={gym.website || '—'} />
        </Box>
      </Box>

      <Box sx={{ ...Card(theme), display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: theme.palette.text.primary }}>
          Часы и цены
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          {Object.entries(gym.hours).map(([day, hours]) => (
            <InfoRow key={day} label={day} value={hours} />
          ))}
          {gym.prices.map((price) => (
            <InfoRow key={price.name} label={price.name} value={`${price.price} ₽`} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  return (
    <Box>
      <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: theme.palette.text.secondary, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.primary, mt: 0.25 }}>
        {value}
      </Typography>
    </Box>
  );
}
