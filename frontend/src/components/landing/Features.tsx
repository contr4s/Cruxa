import { Card, CardContent, Typography } from '@mui/material';
import {
  LocationOnOutlined,
  TrendingUpOutlined,
  GroupOutlined,
  QrCodeScannerOutlined,
  FormatListBulletedOutlined,
  VerifiedUserOutlined,
} from '@mui/icons-material';

const features = [
  {
    icon: <LocationOnOutlined sx={{ fontSize: 26, color: 'var(--primary)' }} />,
    title: 'Каталог залов',
    desc: '50+ скалодромов Москвы и СПб с контактами, ценами и часами работы.',
    delay: '.1s',
  },
  {
    icon: <TrendingUpOutlined sx={{ fontSize: 26, color: 'var(--primary)' }} />,
    title: 'Аналитика прогресса',
    desc: 'Единый Крускор — отслеживай рост в любой системе оценок. Графики и достижения.',
    delay: '.2s',
  },
  {
    icon: <GroupOutlined sx={{ fontSize: 26, color: 'var(--primary)' }} />,
    title: 'Сообщество',
    desc: 'Лента тренировок, лайки, комментарии, подписки. Делиcь успехами с друзьями.',
    delay: '.3s',
  },
  {
    icon: <QrCodeScannerOutlined sx={{ fontSize: 26, color: 'var(--primary)' }} />,
    title: 'QR-сканер',
    desc: 'Сканируй QR на стене — мгновенное логирование пролаза. Mobile App скоро.',
    delay: '.4s',
  },
  {
    icon: <FormatListBulletedOutlined sx={{ fontSize: 26, color: 'var(--primary)' }} />,
    title: 'База трасс',
    desc: 'Тысячи трасс с цветами зацепок, тегами стиля и отзывами. Фильтруй что угодно.',
    delay: '.5s',
  },
  {
    icon: <VerifiedUserOutlined sx={{ fontSize: 26, color: 'var(--primary)' }} />,
    title: 'Роли и доступ',
    desc: 'Скалолаз, Рутсеттер, Администратор зала. Инструменты для каждого участника экосистемы.',
    delay: '.6s',
  },
];

export function Features() {
  return (
    <section className="features-section scroll-reveal">
      <div className="section-header">
        <span className="section-tag">Возможности</span>
        <h2 className="section-title">
          Что вас ждёт в <span className="hero-title-gradient">Круксе</span>
        </h2>
        <p className="section-desc">
          Всё, что нужно скалолазу — от трекинга до общения с комьюнити
        </p>
      </div>

      <div className="feature-grid">
        {features.map((f) => (
          <Card
            key={f.title}
            className="scroll-reveal feature-card"
            sx={{ animationDelay: f.delay }}
          >
            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
              <div className="feature-icon-box">{f.icon}</div>
              <Typography
                variant="h3"
                sx={{ fontSize: '1.15rem', fontWeight: 600, mb: 1 }}
              >
                {f.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'var(--text2)', fontSize: '0.82rem' }}
              >
                {f.desc}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
