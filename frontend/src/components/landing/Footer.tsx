import { Link } from 'react-router-dom';

const footerLinks = [
  { label: 'Документация', to: '#' },
  { label: 'API', to: '#' },
  { label: 'GitHub', to: '#' },
  { label: 'Telegram', to: '#' },
];

export function Footer() {
  return (
    <footer className="landing-footer scroll-reveal">
      <span className="footer-brand">▲ Крукса — 2026</span>
      <div className="footer-links">
        {footerLinks.map((link) => (
          <Link key={link.label} to={link.to} className="footer-link">
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
