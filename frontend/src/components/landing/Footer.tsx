import { Link } from 'react-router-dom';

const footerLinks = [
  { label: 'Документация', to: '#' },
  { label: 'API', to: '#' },
  { label: 'GitHub', to: '#' },
  { label: 'Telegram', to: '#' },
];

import { Reveal } from '../ui/Reveal';

export function Footer() {
  return (
    <Reveal>
    <footer className="landing-footer">
      <span className="footer-brand">
        <img src="/logo.png" alt="" style={{ height: 24, verticalAlign: 'middle', marginRight: 6 }} />
        Крукса — 2026
      </span>
      <div className="footer-links">
        {footerLinks.map((link) => (
          <Link key={link.label} to={link.to} className="footer-link">
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
    </Reveal>
  );
}
