
import type { UserDto, UserStats, KruskorPoint, RadarSkillsResponse, GradePyramidItem, AscentTypeDistribution, TopRoutesResponse, MonthlyActivity } from '../../types/user';
import { mockDelay, randomInt } from './helpers';

export const MOCK_USER: UserDto = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  username: 'alexey',
  email: 'alexey@climb.ru',
  firstName: 'Алексей',
  lastName: 'Круглов',
  city: 'Москва',
  gender: 'М',
  height: 178,
  role: 'Climber',
  createdAt: '2025-06-01T00:00:00Z',
  avatarUrl: undefined,
};

export const MOCK_STATS: UserStats = {
  kruscore: 534,
  totalWorkouts: 14,
  followersCount: 24,
  followingCount: 12,
};

export async function mockGetUserProfile(): Promise<UserDto> {
  await mockDelay(350);
  return MOCK_USER;
}

export async function mockGetUserStats(): Promise<UserStats> {
  await mockDelay(500);
  return MOCK_STATS;
}

export async function mockGetKruskorHistory(period: string): Promise<KruskorPoint[]> {
  await mockDelay(300);
  const months = period === '1m' ? 1 : period === '3m' ? 3 : period === '6m' ? 6 : period === '1y' ? 12 : 24;
  const history: KruskorPoint[] = [];
  const startDate = new Date('2025-08-01');
  let score = 320;
  const grades = ['5C', '6A', '6A+', '6B', '6B+', '6C', '6C+', '7A'];

  // Всегда генерируем 15 точек равномерно по периоду
  for (let i = 0; i < 15; i++) {
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + Math.round((i / 14) * months));
    score += randomInt(-10, 30);
    if (score < 300) score = 300;
    const gradeIdx = Math.min(Math.floor((score - 300) / 25), grades.length - 1);
    history.push({
      date: d.toISOString().slice(0, 7),
      score,
      maxGrade: grades[Math.max(0, gradeIdx)],
    });
  }
  return history;
}

export async function mockGetRadarSkills(): Promise<RadarSkillsResponse> {
  await mockDelay(300);
  return {
    categories: {
      style: [
        { name: 'Баланс', value: 85 },
        { name: 'Динамика', value: 62 },
        { name: 'Силовой', value: 70 },
        { name: 'Статика', value: 78 },
        { name: 'Техничный', value: 44 },
        { name: 'Кампус', value: 55 },
      ],
      relief: [
        { name: 'Наклон', value: 75 },
        { name: 'Отвес', value: 68 },
        { name: 'Щель', value: 55 },
        { name: 'Потолок', value: 62 },
        { name: 'Щипок', value: 48 },
        { name: 'Арка', value: 40 },
      ],
      hold: [
        { name: 'Щипок', value: 72 },
        { name: 'Пассив', value: 65 },
        { name: 'Щель', value: 50 },
        { name: 'Карман', value: 58 },
        { name: 'Полка', value: 80 },
        { name: 'Зацепка', value: 45 },
      ],
      type: [
        { name: 'Трэд', value: 48 },
        { name: 'Спорт', value: 82 },
        { name: 'Боулд', value: 70 },
        { name: 'DWS', value: 35 },
        { name: 'Айс', value: 20 },
        { name: 'Индоор', value: 90 },
      ],
    },
  };
}

export async function mockGetGradePyramid(): Promise<GradePyramidItem[]> {
  await mockDelay(300);
  return [
    { grade: '7A', count: 1 },
    { grade: '6C+', count: 3 },
    { grade: '6C', count: 8 },
    { grade: '6B+', count: 7 },
    { grade: '6B', count: 10 },
    { grade: '6A+', count: 6 },
    { grade: '6A', count: 5 },
    { grade: '5C', count: 4 },
    { grade: '5B', count: 3 },
  ];
}

export async function mockGetAscentDistribution(): Promise<AscentTypeDistribution[]> {
  await mockDelay(300);
  return [
    { type: 'Flash', count: 20 },
    { type: 'Redpoint', count: 10 },
    { type: 'Onsight', count: 7 },
    { type: 'Attempt', count: 5 },
    { type: 'Project', count: 3 },
    { type: 'Repeat', count: 2 },
  ];
}

export async function mockGetTopRoutes(): Promise<TopRoutesResponse> {
  await mockDelay(300);
  const routes = [
    { id: 'r1', name: 'Красная стрела', grade: '6A', holdColor: 'Red', ascentType: 'Flash', gymName: 'RockZone', gymId: 'g1', rating: 5.0, date: '2026-06-10' },
    { id: 'r2', name: 'Синий мув', grade: '6B+', holdColor: 'Blue', ascentType: 'Repeat', gymName: 'RockZone', gymId: 'g1', rating: 4.8, date: '2026-06-08' },
    { id: 'r3', name: 'Апельсин', grade: '5C', holdColor: 'Orange', ascentType: 'Onsight', gymName: 'Лимейт', gymId: 'g3', rating: 4.6, date: '2026-06-05' },
    { id: 'r4', name: 'Чёрная молния', grade: '7A', holdColor: 'Black', ascentType: 'Project', gymName: 'Лимейт', gymId: 'g3', rating: 3.9, date: '2026-06-03' },
    { id: 'r5', name: 'Зелёный дракон', grade: '6C', holdColor: 'Green', ascentType: 'Redpoint', gymName: 'RockZone', gymId: 'g1', rating: 4.3, date: '2026-06-01' },
  ];
  return {
    routes,
    totalRoutes: 47,
    avgGrade: '6B',
    maxGrade: '7A',
  };
}

export async function mockGetMonthlyActivity(): Promise<MonthlyActivity> {
  await mockDelay(300);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: MonthlyActivity['days'] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const hasWorkout = Math.random() < 0.35;
    days.push({
      day: d,
      intensity: hasWorkout ? 0.3 + Math.random() * 0.7 : 0,
      hasWorkout,
      routeCount: hasWorkout ? randomInt(3, 20) : 0,
    });
  }
  return {
    year,
    month,
    days,
    totalWorkouts: days.filter((d) => d.hasWorkout).length,
    totalRoutes: days.reduce((sum, d) => sum + d.routeCount, 0),
    streak: 5,
  };
}
