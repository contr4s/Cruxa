import { Box, Link, useTheme } from '@mui/material';
import { Phone, Email, Language } from '@mui/icons-material';
import type { GymDto } from '../../../types/gym';

interface GymContactsBlockProps {
  gym: GymDto;
}

const SOCIALS = [['vkUrl', 'VK'], ['instagramUrl', 'Instagram'], ['youtubeUrl', 'YouTube'], ['website', 'Сайт']] as const;

export function GymContactsBlock({ gym }: GymContactsBlockProps) {
  const theme = useTheme();
  const hasSocials = SOCIALS.some(([k]) => gym[k]);

  if (!gym.phone && !gym.email && !hasSocials) return null;

  return (
    <>
      {(gym.phone || gym.email) && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
          {gym.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Phone sx={{ fontSize: 16, color: theme.palette.primary.main }} />
              <Link href={`tel:${gym.phone}`} underline="hover" sx={{ fontSize: '0.82rem', color: theme.palette.text.primary }}>
                {gym.phone}
              </Link>
            </Box>
          )}
          {gym.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Email sx={{ fontSize: 16, color: theme.palette.primary.main }} />
              <Link href={`mailto:${gym.email}`} underline="hover" sx={{ fontSize: '0.82rem', color: theme.palette.text.primary }}>
                {gym.email}
              </Link>
            </Box>
          )}
        </Box>
      )}
      {hasSocials && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {SOCIALS.map(([key, label]) => {
            const url = gym[key];
            if (!url) return null;
            return (
              <Link key={key} href={url} target="_blank" rel="noopener noreferrer" underline="hover" sx={{ fontSize: '0.78rem', color: theme.palette.primary.light, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Language sx={{ fontSize: 14 }} />{label}
              </Link>
            );
          })}
        </Box>
      )}
    </>
  );
}
