import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuthStore } from '../../stores/authStore';
import { NAV_ITEMS } from './navigation';
import { avatarInitial } from '../../theme/commonStyles';
import type { UserRole } from '../../types/user';

export function Sidebar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { displayName, logout, role } = useAuthStore();

  const currentPath = location.pathname;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const initial = displayName ? displayName[0].toUpperCase() : '?';

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (!item.roles) return true;
    return role ? item.roles.includes(role as UserRole) : false;
  });

  return (
    <Box
      className="sidebar"
      sx={{
        width: 72,
        flexShrink: 0,
        background: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        p: '12px 8px 20px',
        overflow: 'hidden',
        transition: 'width .2s cubic-bezier(.4,0,.2,1)',
        zIndex: 100,
        '&:hover': { width: 220 },
        '&:hover .si-label': { opacity: 1 },
        '@media (max-width: 768px)': { display: 'none' },
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          p: '10px',
          mb: '4px',
          minHeight: 44,
        }}
      >
        <Box className="si-icon" sx={{ flexShrink: 0, width: 28, textAlign: 'center', fontSize: '1.6rem', color: theme.palette.primary.main }}>
          ▲
        </Box>
        <Typography
          className="si-label"
          sx={{
            fontWeight: 800,
            fontSize: '1.15rem',
            color: theme.palette.primary.main,
            letterSpacing: '-.3px',
            opacity: 0,
            transition: 'opacity .15s ease .1s',
            whiteSpace: 'nowrap',
          }}
        >
          Крукса
        </Typography>
      </Box>

      {/* Navigation */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        {visibleItems.map((item) => (
          <Box
            key={item.path}
            onClick={() => item.path && navigate(item.path)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              p: '10px',
              borderRadius: `${(theme.shape.borderRadius as number) - 4}px`,
              cursor: item.path ? 'pointer' : 'default',
              color: currentPath === item.path ? theme.palette.primary.main : theme.palette.text.secondary,
              whiteSpace: 'nowrap',
              transition: 'background .15s, color .15s',
              minHeight: 44,
              background: currentPath === item.path ? theme.custom.surface2 : 'transparent',
              borderLeft: currentPath === item.path ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
              '&:hover': item.path ? { background: theme.custom.surface2, color: theme.palette.text.primary } : {},
            }}
          >
            <Box className="si-icon" sx={{ flexShrink: 0, width: 28, textAlign: 'center', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.path === '/profile' ? (
                <Box sx={avatarInitial(28)}>
                  {initial}
                </Box>
              ) : item.icon ? (
                <item.icon sx={{ fontSize: '1.2rem', color: currentPath === item.path ? theme.palette.primary.main : 'inherit' }} />
              ) : null}
            </Box>
            <Box
              className="si-label"
              sx={{
                opacity: 0,
                transition: 'opacity .15s ease .1s',
                fontWeight: 500,
                fontSize: '0.95rem',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </Box>
          </Box>
        ))}
      </Box>

      {/* User area */}
      <Box
        onClick={handleLogout}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          p: '10px',
          borderRadius: `${(theme.shape.borderRadius as number) - 4}px`,
          cursor: 'pointer',
          color: theme.palette.text.secondary,
          transition: 'background .15s',
          minHeight: 44,
          '&:hover': { background: theme.custom.surface2 },
        }}
      >
        <Avatar sx={{ width: 32, height: 32, fontSize: '0.85rem', bgcolor: theme.palette.primary.main }}>
          {initial}
        </Avatar>
        <Box
          className="si-label"
          sx={{
            opacity: 0,
            transition: 'opacity .15s ease .1s',
            fontWeight: 500,
            fontSize: '0.85rem',
            whiteSpace: 'nowrap',
          }}
        >
          Выйти
        </Box>
      </Box>
    </Box>
  );
}
