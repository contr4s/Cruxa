import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

export function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">▲ Крукса</Link>
      <div className="nav-links">
        <Link to="/login" className="nav-link nav-login">Войти</Link>
        <Button
          component={Link}
          to="/register"
          variant="contained"
          size="small"
          sx={{
            background: 'var(--gradient-accent)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.78rem',
            px: 2,
            py: 0.6,
            '&:hover': {
              background: 'var(--gradient-accent)',
              filter: 'brightness(1.1)',
            },
          }}
        >
          Присоединиться
        </Button>
      </div>
    </nav>
  );
}
