import { useCallback, useEffect, useState } from 'react';
import { getDevAccounts, devLogin, type DevAccountDto } from '../../services/dev.service';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';

function roleRoute(role?: string | null): string | undefined {
  return { Routesetter: '/routesetter', GymAdmin: '/gym-admin', Admin: '/admin' }[role ?? ''];
}

interface GroupedAccounts {
  Climber: DevAccountDto[];
  Routesetter: DevAccountDto[];
  GymAdmin: DevAccountDto[];
  Admin: DevAccountDto[];
}

const ROLE_LABELS: Record<string, string> = {
  Climber: '🧗 Скалолазы',
  Routesetter: '🔧 Рутсеттеры',
  GymAdmin: '🏢 Админы залов',
  Admin: '🛡️ Администраторы',
};

export default function DevAccountPicker() {
  const [accounts, setAccounts] = useState<GroupedAccounts | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  useEffect(() => {
    if (import.meta.env.VITE_DEV_ACCOUNTS_ENABLED !== 'true') return;

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
      .catch((err) => console.warn('[Dev] Backend not available, account picker disabled:', err));
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    await login(email, password);
    const state = useAuthStore.getState();
    setLoading(false);
    if (!state.error) {
      navigate(roleRoute(state.role) || '/feed', { replace: true });
    } else {
      setError(state.error);
    }
  }, [login, navigate]);

  // Try direct dev login API first, fallback to form fill
  const handleDevLogin = useCallback(async (account: DevAccountDto) => {
    setLoading(true);
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
      navigate(roleRoute(res.user.role) || '/feed', { replace: true });
    } catch {
      // Fallback: form-fill with password=username
      await handleLogin(account.email, account.username);
    }
  }, [handleLogin, navigate]);

  if (import.meta.env.VITE_DEV_ACCOUNTS_ENABLED !== 'true') return null;
  if (!accounts) return null;

  const allAccounts = Object.values(accounts).flat();
  if (allAccounts.length === 0) return null;

  return (
    <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
      <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', textAlign: 'center' }}>
        ⚡ Быстрый вход (dev)
      </p>
      {error && <p style={{ color: '#d32f2f', fontSize: '0.75rem', textAlign: 'center' }}>{error}</p>}
      {loading && <p style={{ fontSize: '0.75rem', textAlign: 'center', color: '#888' }}>Вход...</p>}
      {Object.entries(ROLE_LABELS).map(([role, label]) => {
        const items = accounts[role as keyof GroupedAccounts];
        if (!items?.length) return null;
        return (
          <details key={role} style={{ marginBottom: '0.25rem' }}>
            <summary style={{ cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, padding: '0.25rem 0' }}>
              {label} ({items.length})
            </summary>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', paddingLeft: '0.5rem' }}>
              {items.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => handleDevLogin(a)}
                  disabled={loading}
                  style={{
                    textAlign: 'left',
                    padding: '0.3rem 0.5rem',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    background: '#fafafa',
                    cursor: loading ? 'wait' : 'pointer',
                    fontSize: '0.75rem',
                    fontFamily: 'inherit',
                  }}
                >
                  <strong>{a.displayName || a.username}</strong>
                  {a.gymNames && <span style={{ color: '#666' }}> — {a.gymNames.join(', ')}</span>}
                  <br />
                  <span style={{ color: '#999' }}>{a.email}</span>
                </button>
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
}
