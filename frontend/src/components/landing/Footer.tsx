import { Reveal } from '../ui/Reveal';

const footerLinks = [
  { label: 'GitHub', to: 'https://github.com/contr4s/Cruxa' },
];

export function Footer() {
  return (
    <Reveal>
    <footer className="landing-footer">
      <span className="footer-brand">
        <img src="/logo.png" alt="" style={{ height: 24, verticalAlign: 'middle', marginRight: 6 }} />
        Крукса — 2026
      </span>
      <p className="footer-disclaimer">Ранняя версия продукта · <a href="https://github.com/contr4s/Cruxa/issues/new" target="_blank" rel="noopener noreferrer">Сообщить о проблеме</a></p>
      <div className="footer-links">
        {footerLinks.map((link) => (
          <a key={link.label} href={link.to} target="_blank" rel="noopener noreferrer" className="footer-link">
            {link.label}
          </a>
        ))}
      </div>
    </footer>
    </Reveal>
  );
}
