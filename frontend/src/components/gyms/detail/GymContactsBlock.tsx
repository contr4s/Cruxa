import { Box, Link, useTheme } from '@mui/material';
import { Phone, Email, Language } from '@mui/icons-material';
import type { GymDto } from '../../../types/gym';

interface GymContactsBlockProps {
  gym: GymDto;
}

function extractSocials(gym: GymDto): { key: string; label: string; url: string }[] {
  if (!gym.socialLinks) return [];
  return gym.socialLinks
    .map(url => {
      const label = url.includes('vk.') || url.includes('vkontakte') ? 'VK'
        : url.includes('instagram') ? 'Instagram'
        : url.includes('youtube') || url.includes('youtu.be') ? 'YouTube'
        : 'Сайт';
      return { key: url, label, url };
    });
}

export function GymContactsBlock({ gym }: GymContactsBlockProps) {
  const theme = useTheme();
  const socials = extractSocials(gym);
  const hasSocials = socials.length > 0;
  const hasWebsite = !!gym.website;

  if (!gym.phone && !gym.email && !hasSocials && !hasWebsite) return null;

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
      {(hasSocials || hasWebsite) && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {hasWebsite && (
            <Link href={gym.website!} target="_blank" rel="noopener noreferrer" underline="hover" sx={{ fontSize: '0.78rem', color: theme.palette.primary.light, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Language sx={{ fontSize: 14 }} />Сайт
            </Link>
          )}
          {socials.map(({ key, label, url }) => (
            <Link key={key} href={url} target="_blank" rel="noopener noreferrer" underline="hover" sx={{ fontSize: '0.78rem', color: theme.palette.primary.light, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Language sx={{ fontSize: 14 }} />{label}
            </Link>
          ))}
        </Box>
      )}
    </>
  );
}
