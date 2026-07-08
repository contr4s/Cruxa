import { useEffect, useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Collapse,
  CircularProgress,
  Typography,
  Box,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Person as PersonIcon,
  Build as BuildIcon,
  AdminPanelSettings as AdminIcon,
  Shield as ShieldIcon,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { getDevAccounts, devLogin, type DevAccountDto } from '../../services/dev.service';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';

interface GroupedAccounts {
  Climber: DevAccountDto[];
  Routesetter: DevAccountDto[];
  GymAdmin: DevAccountDto[];
  Admin: DevAccountDto[];
}

const ROLE_CONFIG: Record<string, { label: string; icon: React.ReactElement; color: string }> = {
  Climber: { label: 'Скалолазы', icon: <PersonIcon />, color: '#26A69A' },
  Routesetter: { label: 'Рутсеттеры', icon: <BuildIcon />, color: '#FFB300' },
  GymAdmin: { label: 'Админы залов', icon: <AdminIcon />, color: '#4DB6AC' },
  Admin: { label: 'Администраторы', icon: <ShieldIcon />, color: '#E53935' },
};

interface DevLoginDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function DevLoginDialog({ open, onClose }: DevLoginDialogProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [accounts, setAccounts] = useState<GroupedAccounts | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!open) return;
    if (accounts) return;
    getDevAccounts()
      .then((list) => {
        const grouped: GroupedAccounts = { Climber: [], Routesetter: [], GymAdmin: [], Admin: [] };
        for (const a of list) {
          const role = a.role as keyof GroupedAccounts;
          if (grouped[role]) grouped[role].push(a);
          else grouped.Climber.push(a);
        }
        setAccounts(grouped);
        // Start collapsed
        setExpanded({});
      })
      .catch(() => setError('Не удалось загрузить аккаунты'));
  }, [open, accounts]);

  const toggleExpand = useCallback((role: string) => {
    setExpanded((prev) => ({ ...prev, [role]: !prev[role] }));
  }, []);

  useEffect(() => {
    if (!open) return;
    if (accounts) return;
    getDevAccounts()
      .then((list) => {
        const grouped: GroupedAccounts = { Climber: [], Routesetter: [], GymAdmin: [], Admin: [] };
        for (const a of list) {
          const role = a.role as keyof GroupedAccounts;
          if (grouped[role]) grouped[role].push(a);
          else grouped.Climber.push(a);
        }
        setAccounts(grouped);
      })
      .catch(() => setError('Не удалось загрузить аккаунты'));
  }, [open, accounts]);

  const handleLogin = async (account: DevAccountDto) => {
    setLoadingId(account.id);
    setError(null);
    try {
      const res = await devLogin(account.id);
      localStorage.setItem('auth_token', res.token);
      localStorage.setItem('auth_user', JSON.stringify(res));
      useAuthStore.setState({
        token: res.token,
        userId: res.user.id,
        username: res.user.username,
        displayName: res.user.displayName,
        role: res.user.role,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      onClose();
      navigate('/feed', { replace: true });
    } catch {
      // fallback: form login
      await login(account.email, account.username);
      const state = useAuthStore.getState();
      if (state.error) {
        setError(state.error);
      } else {
        onClose();
        navigate('/feed', { replace: true });
      }
    }
    setLoadingId(null);
  };

  const totalCount = accounts ? Object.values(accounts).reduce((s, a) => s + a.length, 0) : 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { bgcolor: theme.palette.background.paper, borderRadius: '12px', backgroundImage: 'none' } } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          ⚡ Быстрый вход
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {totalCount > 0
            ? `${totalCount} тестовых аккаунтов — нажмите для входа`
            : 'Загрузка аккаунтов...'}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 0, pb: 1, '&:first-of-type': { pt: 1 } }}>
        {error && (
          <Typography variant="caption" color="error" sx={{ px: 3, display: 'block' }}>
            {error}
          </Typography>
        )}

        {!accounts ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          Object.entries(ROLE_CONFIG).map(([role, cfg]) => {
            const items = accounts[role as keyof GroupedAccounts];
            if (!items?.length) return null;
            const isOpen = expanded[role] ?? false;
            return (
              <List key={role} dense disablePadding sx={{ px: 1 }}>
                <ListItemButton
                  onClick={() => toggleExpand(role)}
                  sx={{ borderRadius: '8px', mx: 1, mb: 0.25 }}
                >
                  <ListItemAvatar sx={{ minWidth: 36 }}>
                    <Box sx={{ color: cfg.color, display: 'flex' }}>{cfg.icon}</Box>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 600, color: cfg.color }}>
                        {cfg.label} · {items.length}
                      </Typography>
                    }
                  />
                  {isOpen ? <ExpandLess sx={{ fontSize: 20, color: 'text.secondary' }} /> : <ExpandMore sx={{ fontSize: 20, color: 'text.secondary' }} />}
                </ListItemButton>
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  {items.map((a) => (
                    <ListItemButton
                      key={a.id}
                      disabled={loadingId !== null}
                      onClick={() => handleLogin(a)}
                      sx={{
                        borderRadius: '8px',
                        mx: 1,
                        mb: 0.25,
                        pl: 5,
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
                      }}
                    >
                      <ListItemAvatar sx={{ minWidth: 36 }}>
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            bgcolor: alpha(cfg.color, 0.15),
                            color: cfg.color,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                          }}
                        >
                          {(a.displayName || a.username).charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                            {a.displayName || a.username}
                            {a.gymNames && (
                              <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5, fontSize: '0.72rem' }}>
                                — {a.gymNames.join(', ')}
                              </Typography>
                            )}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
                            {a.email}
                          </Typography>
                        }
                      />
                      {loadingId === a.id && <CircularProgress size={16} sx={{ ml: 1 }} />}
                    </ListItemButton>
                  ))}
                </Collapse>
              </List>
            );
          })
        )}
      </DialogContent>
    </Dialog>
  );
}
