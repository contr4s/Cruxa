import { Link } from 'react-router-dom';
import { GradientButton } from '../ui/GradientButton';

export function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">▲ Крукса</Link>
      <div className="nav-links">
        <Link to="/login" className="nav-link nav-login">Войти</Link>
        <GradientButton component={Link} to="/register" size="sm">
          Присоединиться
        </GradientButton>
      </div>
    </nav>
  );
}
