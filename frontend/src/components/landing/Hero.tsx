import { useNavigate } from 'react-router-dom';
import { Button, useTheme } from '@mui/material';
import { PhoneMockup } from './PhoneMockup';
import { GradientButton } from '../ui/GradientButton';

export function Hero() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      {/* Topographic pattern */}
      <svg
        className="hero-pattern"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path d="M0,250 Q300,100 600,250 T1200,200" fill="none" stroke={theme.palette.primary.main} strokeWidth="1.5" opacity=".12" />
        <path d="M0,270 Q300,120 600,270 T1200,220" fill="none" stroke={theme.palette.primary.main} strokeWidth="1" opacity=".1" />
        <path d="M0,290 Q300,140 600,290 T1200,240" fill="none" stroke={theme.palette.primary.main} strokeWidth="1" opacity=".08" />
        <path d="M0,230 Q300,80  600,230 T1200,180" fill="none" stroke={theme.palette.primary.main} strokeWidth="1" opacity=".1" />
        <path d="M0,210 Q300,60  600,210 T1200,160" fill="none" stroke={theme.palette.primary.main} strokeWidth=".8" opacity=".07" />
        <path d="M0,310 Q300,160 600,310 T1200,260" fill="none" stroke={theme.palette.primary.main} strokeWidth=".8" opacity=".07" />
        <path d="M0,330 Q300,180 600,330 T1200,280" fill="none" stroke={theme.palette.primary.main} strokeWidth=".5" opacity=".05" />
      </svg>

      {/* Shine */}
      <div className="hero-shine" />

      <div className="hero-content">
        <div className="hero-left">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Социальная сеть для скалолазов
          </div>

          <h1 className="hero-title">
            Встречай<br />
            <span className="hero-title-gradient">единомышленников</span><br />
            покоряй вершины
          </h1>

          <p className="hero-text">
            Трекинг пролазов, каталог скалодромов по всей России, аналитика прогресса и общение с единомышленниками.
          </p>

          <div className="hero-actions">
            <GradientButton onClick={() => navigate('/register')}>
              Присоединиться
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

            <Button
              component="a"
              href="https://vc.ru/tribuna/3029031-ya-sdelal-strava-dlya-rossiiskih-skalolazov-kruksa"
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                py: 1.8,
                px: 3.5,
                borderRadius: 3,
                fontSize: '0.95rem',
                fontWeight: 500,
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary,
                '&:hover': {
                  borderColor: theme.palette.text.secondary,
                  background: 'rgba(255,255,255,.03)',
                },
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="18"
                height="18"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              Узнать больше
            </Button>
          </div>
        </div>

        <div className="hero-right">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}
