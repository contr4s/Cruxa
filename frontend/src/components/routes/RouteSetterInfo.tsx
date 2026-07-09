import { Box, Typography, useTheme } from '@mui/material';
import type { RouteDto } from '../../types/route';
import { UserLink } from '../user/UserLink';

interface RouteSetterInfoProps {
  route: Pick<RouteDto, 'setterId' | 'setterUsername' | 'setterName' | 'setterAvatarUrl' | 'setterGender' | 'createdAt'>;
  size?: 'sm' | 'md';
}

export function RouteSetterInfo({ route, size = 'md' }: RouteSetterInfoProps) {
  const theme = useTheme();

  if (!route.setterUsername) return null;

  const date = route.createdAt && route.createdAt !== '0001-01-01T00:00:00'
    ? new Date(route.createdAt).toLocaleDateString('ru-RU')
    : null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
      <UserLink
        username={route.setterUsername}
        displayName={route.setterName}
        avatarUrl={route.setterAvatarUrl}
        size={size === 'sm' ? 'sm' : 'md'}
        withAvatar
      />
      {date && (
        <Typography sx={{ fontSize: '0.82rem', color: theme.custom.text3 }}>
          {route.setterGender === 'female' ? 'накрутила' : 'накрутил'} {date}
        </Typography>
      )}
    </Box>
  );
}
