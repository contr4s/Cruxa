import { Reveal } from '../ui/Reveal';

const stats = [
  { num: '50+', label: 'Городов' },
  { num: '500+', label: 'Скалолазов' },
  { num: '1 000+', label: 'Трасс в базе' },
  { num: '24/7', label: 'Доступно' },
];

export function Stats() {
  return (
    <Reveal>
    <section className="stats-section">
      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <span className="stat-num">{s.num}</span>
            <span className="stat-label">{s.label}</span>
            <div className="stat-bar" />
          </div>
        ))}
      </div>
    </section>
    </Reveal>
  );
}
