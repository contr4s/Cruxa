import { http, HttpResponse } from 'msw';
import type { UserDto, UserStats, KruskorPoint, RadarSkillsResponse, GradePyramidItem, AscentTypeDistribution, TopRoutesResponse, MonthlyActivity } from '../../types/user';
import { mockDelay, randomInt } from '../helpers';

const MOCK_USER: UserDto = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  username: 'alexey',
  email: 'alexey@climb.ru',
  firstName: 'Алексей', lastName: 'Круглов',
  city: 'Москва', gender: 'М', height: 178,
  role: 'Climber',
  createdAt: '2025-06-01T00:00:00Z',
  avatarUrl: undefined,
};

const MOCK_USER_OTHER: UserDto = {
  id: '550e8400-e29b-41d4-a716-446655440002',
  username: 'dmitry-volkov',
  email: 'dmitry@climb.ru',
  firstName: 'Дмитрий', lastName: 'Волков',
  city: 'Санкт-Петербург', gender: 'М', height: 182,
  role: 'Climber',
  createdAt: '2025-04-12T00:00:00Z',
  avatarUrl: undefined,
};

const MOCK_USERS: UserDto[] = [MOCK_USER, MOCK_USER_OTHER];

const MOCK_STATS: UserStats = {
  kruscore: 534, totalWorkouts: 14, followersCount: 24, followingCount: 12,};

// mutable follow state
const followedSet = new Set<string>([MOCK_USER.id]);

export const userHandlers = [
  http.get('/api/users/:userId', async ({ params }) => {
    await mockDelay(300);
    const { userId } = params;
    const user = MOCK_USERS.find((u) => u.id === userId) ?? MOCK_USER;
    return HttpResponse.json<UserDto>(user);
  }),

  http.get('/api/users/username/:username', async ({ params }) => {
    await mockDelay(300);
    const user = MOCK_USERS.find((u) => u.username === params.username);
    if (!user) return HttpResponse.json(null, { status: 404 });
    return HttpResponse.json<UserDto>(user);
  }),

  http.get('/api/users/:userId/stats', async () => {
    await mockDelay(400);
    return HttpResponse.json<UserStats>(MOCK_STATS);
  }),

  http.get('/api/users/:userId/kruskor-history', async ({ request }) => {
    await mockDelay(300);
    const url = new URL(request.url);
    const period = url.searchParams.get('period') ?? 'all';
    const months = period === '1m' ? 1 : period === '3m' ? 3 : period === '6m' ? 6 : period === '1y' ? 12 : 24;
    const history: KruskorPoint[] = [];
    const startDate = new Date('2025-08-01');
    let score = 320;
    const grades = ['5C', '6A', '6A+', '6B', '6B+', '6C', '6C+', '7A'];
    for (let i = 0; i < 15; i++) {
      const d = new Date(startDate);
      d.setMonth(d.getMonth() + Math.round((i / 14) * months));
      score += randomInt(-10, 30);
      if (score < 300) score = 300;
      const gradeIdx = Math.min(Math.floor((score - 300) / 25), grades.length - 1);
      history.push({ date: d.toISOString().slice(0, 7), score, maxGrade: grades[Math.max(0, gradeIdx)] });
    }
    return HttpResponse.json<KruskorPoint[]>(history);
  }),

  http.get('/api/users/:userId/radar-skills', async () => {
    await mockDelay(300);
    return HttpResponse.json<RadarSkillsResponse>({
      categories: {
        style: [
          { name: 'Баланс', value: 85 }, { name: 'Динамика', value: 62 },
          { name: 'Силовой', value: 70 }, { name: 'Статика', value: 78 },
          { name: 'Техничный', value: 44 }, { name: 'Кампус', value: 55 },
        ],
        relief: [
          { name: 'Наклон', value: 75 }, { name: 'Отвес', value: 68 },
          { name: 'Щель', value: 55 }, { name: 'Потолок', value: 62 },
          { name: 'Щипок', value: 48 }, { name: 'Арка', value: 40 },
        ],
        hold: [
          { name: 'Щипок', value: 72 }, { name: 'Пассив', value: 65 },
          { name: 'Щель', value: 50 }, { name: 'Карман', value: 58 },
          { name: 'Полка', value: 80 }, { name: 'Зацепка', value: 45 },
        ],
        type: [
          { name: 'Трэд', value: 48 }, { name: 'Спорт', value: 82 },
          { name: 'Боулд', value: 70 }, { name: 'DWS', value: 35 },
          { name: 'Айс', value: 20 }, { name: 'Индоор', value: 90 },
        ],
      },
    });
  }),

  http.get('/api/users/:userId/grade-pyramid', async () => {
    await mockDelay(300);
    return HttpResponse.json<GradePyramidItem[]>([
      { grade: '7A', count: 1 }, { grade: '6C+', count: 3 },
      { grade: '6C', count: 8 }, { grade: '6B+', count: 7 },
      { grade: '6B', count: 10 }, { grade: '6A+', count: 6 },
      { grade: '6A', count: 5 }, { grade: '5C', count: 4 },
      { grade: '5B', count: 3 },
    ]);
  }),

  http.get('/api/users/:userId/ascent-distribution', async () => {
    await mockDelay(300);
    return HttpResponse.json<AscentTypeDistribution[]>([
      { type: 'Flash', count: 20 }, { type: 'Redpoint', count: 10 },
      { type: 'Onsight', count: 7 }, { type: 'Attempt', count: 5 },
      { type: 'Project', count: 3 }, { type: 'Repeat', count: 2 },
    ]);
  }),

  http.get('/api/users/:userId/top-routes', async () => {
    await mockDelay(300);
    return HttpResponse.json<TopRoutesResponse>({
      routes: [
        { id: 'r12', name: 'Чёрная молния', grade: '7A', holdColor: 'Black', ascentType: 'Project', gymName: 'BigWall', gymId: 'g2', rating: 4.9, date: '2026-06-01' },
        { id: 'r4', name: 'Пурпурный пик', grade: '6C', holdColor: 'Purple', ascentType: 'Redpoint', gymName: 'RockZone', gymId: 'g1', rating: 4.3, date: '2026-06-10' },
        { id: 'r2', name: 'Синий мув', grade: '6B+', holdColor: 'Blue', ascentType: 'Flash', gymName: 'RockZone', gymId: 'g1', rating: 4.5, date: '2026-05-20' },
      ],
      totalRoutes: 47, avgGrade: '6A', maxGrade: '7A',
    });
  }),

  http.get('/api/users/:userId/monthly-activity', async () => {
    await mockDelay(300);
    return HttpResponse.json<MonthlyActivity>({
      year: 2026, month: 6,
      days: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        intensity: Math.random(),
        hasWorkout: Math.random() > 0.5,
        routeCount: Math.floor(Math.random() * 10),
      })),
      weekActivity: 5,
    });
  }),

  http.put('/api/users/:userId', async ({ request, params: _p }) => {
    await mockDelay(400);
    const data = (await request.json()) as Partial<UserDto>;
    Object.assign(MOCK_USER, data);
    return HttpResponse.json<UserDto>({ ...MOCK_USER });
  }),

  http.put('/api/auth/password', async ({ request }) => {
    await mockDelay(300);
    const { currentPassword, newPassword } = (await request.json()) as { currentPassword: string; newPassword: string };
    if (currentPassword !== 'password123') {
      return HttpResponse.json({ title: 'Неверный текущий пароль' }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return HttpResponse.json({ title: 'Новый пароль должен быть не менее 6 символов' }, { status: 400 });
    }
    return HttpResponse.json(undefined, { status: 200 });
  }),

  http.post('/api/users/:userId/follow', async ({ params }) => {
    await mockDelay(150);
    followedSet.add(params.userId as string);
    return HttpResponse.json(undefined, { status: 200 });
  }),

  http.delete('/api/users/:userId/follow', async ({ params }) => {
    await mockDelay(150);
    followedSet.delete(params.userId as string);
    return HttpResponse.json(undefined, { status: 200 });
  }),

  http.get('/api/users/:userId/is-following', async ({ params }) => {
    await mockDelay(100);
    return HttpResponse.json<boolean>(followedSet.has(params.userId as string));
  }),

  http.get('/api/users/me/goals', async () => {
    await mockDelay(250);
    return HttpResponse.json([
      { id: 'gl1', type: 'grade', label: 'Целевой грейд', current: 534, target: 580, unit: 'Крускор' },
      { id: 'gl2', type: 'routes', label: 'Всего трасс', current: 47, target: 100, unit: 'шт' },
      { id: 'gl3', type: 'gyms', label: 'Всего залов', current: 12, target: 20, unit: 'шт' },
    ]);
  }),
];
