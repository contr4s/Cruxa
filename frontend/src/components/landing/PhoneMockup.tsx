
const routes = [
  { name: 'Speed 6A', gym: 'RockZona · Боулдеринг', color: 'hold-Red' },
  { name: 'Фараон 7A+', gym: 'BigWall · Трудность', color: 'hold-Blue' },
  { name: 'Баланс 6C', gym: 'Limestone · Боулдеринг', color: 'hold-Yellow' },
];

export function PhoneMockup() {
  return (
    <div className="phone-mockup">
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-screen">
          <div className="phone-status">
            <span className="phone-time">9:41</span>
            <div className="phone-icons">
              <span className="phone-signal">●●●●</span>
              <span className="phone-battery">▇▇▇▇</span>
            </div>
          </div>

          <div className="phone-header-bar">
            <span className="phone-header-title">▲ Крукса</span>
            <span className="phone-header-icon">⋯</span>
          </div>

          <div className="phone-welcome">С возвращением, Алекс!</div>

          <div className="phone-dashboard">
            <div className="phone-stat-item">
              <span className="phone-stat-value">7</span>
              <span className="phone-stat-label">пролазов</span>
            </div>
            <div className="phone-stat-item">
              <span className="phone-stat-value">5A</span>
              <span className="phone-stat-label">лучший</span>
            </div>
            <div className="phone-stat-item">
              <span className="phone-stat-value">12</span>
              <span className="phone-stat-label">дней</span>
            </div>
          </div>

          <div className="phone-activity-label">Недавние пролазы</div>

          <div className="phone-route-list">
            {routes.map((route) => (
              <div className="phone-route-row" key={route.name}>
                <span className={`route-dot ${route.color}`} />
                <div className="phone-route-info">
                  <span className="phone-route-name">{route.name}</span>
                  <span className="phone-route-gym">{route.gym}</span>
                </div>
                <span className="phone-route-check">✓</span>
              </div>
            ))}
          </div>

          <div className="phone-tab-bar">
            <span className="phone-tab active">🏠</span>
            <span className="phone-tab">📊</span>
            <span className="phone-tab">👥</span>
            <span className="phone-tab">👤</span>
          </div>
        </div>
      </div>
      <div className="phone-glow" />
    </div>
  );
}
