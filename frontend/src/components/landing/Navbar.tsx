import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

export function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">
        <img src="/logo.png" alt="" style={{ height: 34, verticalAlign: 'middle', marginRight: 8 }} />
        Крукса
      </Link>
      <div className="nav-links">
        <Link to="/login" className="nav-link nav-login">Войти</Link>
        <Button component={Link} to="/register" variant="contained" color="primary" size="small">
          Присоединиться
        </Button>
      </div>
    </nav>
  );
}
