import { Box, Typography, useTheme } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { TAB_ITEMS } from './navigation';
import { avatarInitial } from '../../theme/commonStyles';
import type { UserRole } from '../../types/user';

export function BottomTabBar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { displayName, role } = useAuthStore();

  const currentPath = location.pathname;
  const initial = displayName ? displayName[0].toUpperCase() : '?';

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  const visibleItems = TAB_ITEMS.filter((item) => {
    if (!item.roles) return true;
    return role ? item.roles.includes(role as UserRole) : false;
  });

  return (
    <Box
      sx={{
        display: 'none',
        '@media (max-width: 768px)': {
          display: 'flex',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
          zIndex: 100,
          justifyContent: 'space-around',
          py: '8px',
        },
      }}
    >
      {visibleItems.map((item) => {
        const active = currentPath === item.path;
        return (
          <Box
            key={item.path}
            onClick={() => handleTabClick(item.path)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              py: item.path === '/profile' ? '10px' : '8px',
              px: 1.5,
              cursor: 'pointer',
              color: active ? theme.palette.primary.main : theme.custom.text3,
              transition: 'color .15s',
              borderTop: active ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
              userSelect: 'none',
              flexShrink: 0,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {item.path === '/profile' ? (
                <Box
                  sx={{ ...avatarInitial(28), cursor: 'pointer', bgcolor: (t) => t.palette.primary.main }}
                >
                  {initial}
                </Box>
              ) : item.icon ? (
                <item.icon
                  sx={{
                    fontSize: '1.3rem',
                    color: active ? theme.palette.primary.main : theme.custom.text3,
                  }}
                />
              ) : null}
            </Box>
            <Typography sx={{ fontSize: '0.62rem', fontWeight: 600, lineHeight: 1, whiteSpace: 'nowrap' }}>
              {item.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
