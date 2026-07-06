import { useNavigate } from 'react-router-dom';
import { Box, Typography, useTheme } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

export interface UserLinkProps {
  username: string;
  displayName: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  withAvatar?: boolean;
  subtitle?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  sx?: SxProps<Theme>;
}

const SIZE_MAP = {
  sm: { avatar: 24, font: '0.78rem', icon: 14 },
  md: { avatar: 32, font: '0.82rem', icon: 16 },
  lg: { avatar: 48, font: '1rem', icon: 20 },
};

export function UserLink({
  username,
  displayName,
  avatarUrl,
  size = 'md',
  withAvatar = true,
  subtitle,
  onClick,
  sx = {},
}: UserLinkProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const s = SIZE_MAP[size];
  const initial = displayName.charAt(0).toUpperCase();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!username || username === 'undefined') return;
    onClick?.(e);
    if (!e.defaultPrevented) {
      navigate(`/u/${username}`);
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        cursor: 'pointer',
        textDecoration: 'none',
        color: 'inherit',
        '&:hover .user-link-name': {
          color: theme.palette.primary.main,
        },
        '&:hover .user-link-avatar': {
          boxShadow: `0 0 14px 3px ${theme.palette.primary.main}55`,
        },
        ...sx,
      }}
    >
      {withAvatar && (
        <Box
          className="user-link-avatar"
          sx={{
            width: s.avatar,
            height: s.avatar,
            minWidth: s.avatar,
            borderRadius: '50%',
            bgcolor: theme.palette.primary.main,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: s.icon,
            fontWeight: 700,
            color: '#fff',
            flexShrink: 0,
            transition: 'box-shadow .2s ease',
            backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {!avatarUrl && initial}
        </Box>
      )}
      <Box sx={{ minWidth: 0 }}>
        <Typography
          className="user-link-name"
          sx={{
            fontSize: s.font,
            fontWeight: 600,
            color: theme.palette.text.primary,
            lineHeight: 1.2,
            transition: 'color .15s',
          }}
        >
          {displayName}
        </Typography>
        {subtitle && (
          <Box
            sx={{
              fontSize: '0.72rem',
              color: theme.palette.text.secondary,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mt: 0.15,
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </Box>
        )}
      </Box>
    </Box>
  );
}
