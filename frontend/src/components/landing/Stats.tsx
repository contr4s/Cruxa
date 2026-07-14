import { motion } from 'framer-motion';
import { Reveal } from '../ui/Reveal';

const stats = [
  { num: '50+', label: 'Городов' },
  { num: '500+', label: 'Скалодромов' },
  { num: '100+', label: 'Тренировок' },
  { num: '1 000+', label: 'Трасс в базе' },
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
            <div className="stat-bar">
              <motion.div
                className="stat-bar-fill"
                initial={{ width: 0 }}
                whileInView={{ width: '60%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="stats-disclaimer">
        Данные по скалодромам — <a href="https://climbingpro.ru" target="_blank" rel="noopener noreferrer">climbingpro.ru</a>. Активность и трассы — сгенерированы для демо.
      </p>
    </section>
    </Reveal>
  );
}
