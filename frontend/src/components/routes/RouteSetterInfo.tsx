import { Box, Avatar, Typography, useTheme } from '@mui/material';
import type { RouteDto } from '../../types/route';

interface RouteSetterInfoProps {
  route: Pick<RouteDto, 'setterName' | 'setterGender' | 'createdAt'>;
  size?: 'sm' | 'md';
}

export function RouteSetterInfo({ route, size = 'md' }: RouteSetterInfoProps) {
  const theme = useTheme();
  const avatarSize = size === 'sm' ? 16 : 20;
  const fontSize = size === 'sm' ? '0.5rem' : '0.6rem';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
      <Avatar
        sx={{
          width: avatarSize,
          height: avatarSize,
          fontSize,
          background: theme.palette.primary.main,
          flexShrink: 0,
        }}
      >
        {route.setterName.charAt(0)}
      </Avatar>
      <Typography sx={{ fontSize: '0.82rem', color: theme.custom.text3 }}>
        <Typography component="span" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
          {route.setterName}
        </Typography>{' '}
        {route.setterGender === 'female' ? 'накрутила' : 'накрутил'}{' '}
        {new Date(route.createdAt).toLocaleDateString('ru-RU')}
      </Typography>
    </Box>
  );
}
