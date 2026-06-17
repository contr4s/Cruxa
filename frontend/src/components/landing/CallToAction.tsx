import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

export function CallToAction() {
  const navigate = useNavigate();

  return (
    <section className="cta-section scroll-reveal">
      <div className="cta-card">
        <h2 className="cta-title">Готовы начать?</h2>
        <p className="cta-text">
          Присоединяйтесь к сообществу скалолазов. Трекинг, аналитика и новые друзья — всё в одном месте.
        </p>
        <Button
          onClick={() => navigate('/register')}
          variant="contained"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            py: 1.8,
            px: 4,
            borderRadius: 3,
            fontSize: '0.95rem',
            fontWeight: 600,
            background: 'var(--gradient-accent)',
            color: '#fff',
            boxShadow: '0 4px 24px rgba(38,166,154,.3)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 32px rgba(38,166,154,.4)',
              background: 'var(--gradient-accent)',
            },
          }}
        >
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
        </Button>
      </div>
    </section>
  );
}
