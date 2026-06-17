
const stats = [
  { num: '10+', label: 'Скалодромов' },
  { num: '500+', label: 'Скалолазов' },
  { num: '1 000+', label: 'Трасс в базе' },
  { num: '24/7', label: 'Доступно' },
];

export function Stats() {
  return (
    <section className="stats-section scroll-reveal">
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
  );
}
