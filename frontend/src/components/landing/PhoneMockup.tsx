

const ROUTE_COLORS = ['#E53935', '#1E88E5', '#43A047', '#FDD835', '#8E24AA', '#FB8C00'];

const ascents = [
  { name: 'Красная стрела', grade: '6A', color: ROUTE_COLORS[0], style: 'Flash' },
  { name: 'Синий мув', grade: '6B+', color: ROUTE_COLORS[1], style: 'Redpoint' },
  { name: 'Золотая середина', grade: '5C', color: ROUTE_COLORS[2], style: 'Onsight' },
  { name: 'Чёрная молния', grade: '7A', color: ROUTE_COLORS[4], style: 'Project' },
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

          {/* Header */}
          <div className="phone-header-bar">
            <span className="phone-header-title">Крукса</span>
            <span className="phone-header-icon">⋯</span>
          </div>

          {/* Single post card with multiple ascents */}
          <div className="phone-post-card">
            {/* Header */}
            <div className="phone-post-header">
              <div className="phone-avatar" />
              <div className="phone-post-user">
                <span className="phone-post-name">Алексей Кузнецов</span>
                <span className="phone-post-gym">RockZone</span>
              </div>
            </div>

            {/* Description + stats */}
            <div className="phone-post-body">
              Отличная тренировка! Пролез 4 трассы, из них 1 в проекте 🔥
            </div>
            <div className="phone-post-stats">
              <span className="phone-stat-chip">
                <svg className="phone-chip-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                Крускор 42
              </span>
              <span className="phone-stat-chip">
                <svg className="phone-chip-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                6A ср.
              </span>
              <span className="phone-stat-chip">
                <svg className="phone-chip-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                1ч 45м
              </span>
            </div>

            {/* Ascent list */}
            <div className="phone-ascent-list">
              {ascents.map((a) => (
                <div className="phone-ascent-row" key={a.name}>
                  <span className="phone-route-dot" style={{ background: a.color }} />
                  <span className="phone-ascent-name">{a.name}</span>
                  <span className="phone-ascent-grade">{a.grade}</span>
                  <span className="phone-ascent-style">{a.style}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="phone-post-actions">
              <div className="phone-action-row">
                <svg className="phone-action-svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span className="phone-action-count">12</span>
              </div>
              <div className="phone-action-row" style={{ marginLeft: 12 }}>
                <svg className="phone-action-svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span className="phone-action-count">3</span>
              </div>
            </div>
          </div>

          {/* Bottom tab bar — SVG icons */}
          <div className="phone-tab-bar">
            <svg className="phone-tab active" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            <svg className="phone-tab" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18h6" /><path d="M10 22h4" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
            </svg>
            <svg className="phone-tab" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="10" r="3" /><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
            </svg>
            <svg className="phone-tab" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      </div>
      <div className="phone-glow" />
    </div>
  );
}
