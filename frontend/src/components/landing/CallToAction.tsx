import { useNavigate } from 'react-router-dom';
import { GradientButton } from '../ui/GradientButton';
import { Reveal } from '../ui/Reveal';

export function CallToAction() {
  const navigate = useNavigate();

  return (
    <Reveal>
    <section className="cta-section">
      <div className="cta-card">
        <h2 className="cta-title">Готовы начать?</h2>
        <p className="cta-text">
          Присоединяйтесь к сообществу скалолазов. Трекинг, аналитика и новые друзья — всё в одном месте.
        </p>
        <GradientButton onClick={() => navigate('/register')}>
          Присоединиться бесплатно
          <svg
            className="btn-arrow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="18"
            height="18"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </GradientButton>
      </div>
    </section>
    </Reveal>
  );
}
