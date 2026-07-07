import { http, HttpResponse } from 'msw';
import type { RouteDto, GradeConsensus, RouteReviewDto, CreateRoutePayload, UpdateRoutePayload } from '../../types/route';
import type { PaginatedList } from '../../types/common';
import { mockDelay } from '../helpers';

export const MOCK_ROUTES: RouteDto[] = [
  { id: 'r1', name: 'Красная стрела', grade: '6A', gradeIndex: 10, type: 'Lead', holdColor: 'Red', sector: 'Главная стена', gymId: 'g1', gymName: 'RockZone', setterId: 's1', setterUsername: 'ivan-rutov', setterName: 'Иван Рутов', setterAvatarUrl: undefined, setterGender: 'male', tags: ['overhang', 'crimp'], description: 'Техничная трасса с перехватами через нависание.', photoUrls: ['/mock/route1-1.jpg'], rating: 4.8, ascentsCount: 124, status: 'Active', createdAt: '2026-06-01T00:00:00Z' },
  { id: 'r2', name: 'Синий мув', grade: '6B+', gradeIndex: 13, type: 'Boulder', holdColor: 'Blue', sector: 'Боулдеринг', gymId: 'g1', gymName: 'RockZone', setterId: 's2', setterUsername: 'anna-trassova', setterName: 'Анна Трассова', setterAvatarUrl: undefined, setterGender: 'female', tags: ['technical', 'sloper'], description: 'Динамичный мув через большой слоупер.', photoUrls: [], rating: 4.5, ascentsCount: 89, status: 'Active', createdAt: '2026-05-20T00:00:00Z' },
  { id: 'r3', name: 'Золотая середина', grade: '5C', gradeIndex: 7, type: 'TopRope', holdColor: 'Yellow', sector: 'Начинающие', gymId: 'g1', gymName: 'RockZone', setterId: 's1', setterUsername: 'ivan-rutov', setterName: 'Иван Рутов', tags: ['endurance', 'arete'], photoUrls: [], rating: 4.2, ascentsCount: 210, status: 'Active', createdAt: '2026-04-15T00:00:00Z' },
  { id: 'r4', name: 'Пурпурный пик', grade: '6C', gradeIndex: 14, type: 'Lead', holdColor: 'Purple', sector: 'Главная стена', gymId: 'g1', gymName: 'RockZone', setterId: 's3', setterUsername: 'dmitry-zatsep', setterName: 'Дмитрий Зацеп', tags: ['power', 'pinch'], photoUrls: ['/mock/route4-1.jpg'], rating: 4.3, ascentsCount: 45, status: 'Active', createdAt: '2026-06-10T00:00:00Z' },
  { id: 'r5', name: 'Лягушка', grade: '5B', gradeIndex: 5, type: 'Boulder', holdColor: 'Green', sector: 'Боулдеринг', gymId: 'g1', gymName: 'RockZone', setterId: 's2', setterUsername: 'anna-trassova', setterName: 'Анна Трассова', tags: ['slab', 'pocket'], photoUrls: [], rating: 4.0, ascentsCount: 178, status: 'Active', createdAt: '2026-03-01T00:00:00Z' },
  { id: 'r6', name: 'Мандарин', grade: '5C', gradeIndex: 7, type: 'TopRope', holdColor: 'Orange', sector: 'Начинающие', gymId: 'g1', gymName: 'RockZone', setterId: 's1', setterUsername: 'ivan-rutov', setterName: 'Иван Рутов', tags: ['warmup'], photoUrls: [], rating: 4.0, ascentsCount: 340, status: 'Active', createdAt: '2026-03-01T00:00:00Z' },
  { id: 'r7', name: 'Ночной дозор', grade: '6A+', gradeIndex: 11, type: 'Lead', holdColor: 'Black', sector: 'Экстрим', gymId: 'g1', gymName: 'RockZone', setterId: 's3', setterUsername: 'dmitry-zatsep', setterName: 'Дмитрий Зацеп', tags: ['technical', 'crimp'], photoUrls: [], rating: 4.6, ascentsCount: 67, status: 'Active', createdAt: '2026-05-25T00:00:00Z' },
  { id: 'r8', name: 'Арктика', grade: '5A', gradeIndex: 3, type: 'Boulder', holdColor: 'White', sector: 'Боулдеринг', gymId: 'g1', gymName: 'RockZone', setterId: 's2', setterUsername: 'anna-trassova', setterName: 'Анна Трассова', tags: ['slab'], photoUrls: [], rating: 4.1, ascentsCount: 300, status: 'Active', createdAt: '2026-01-10T00:00:00Z' },
  { id: 'r9', name: 'Гранит', grade: '6B', gradeIndex: 12, type: 'Lead', holdColor: 'Gray', sector: 'Главная стена', gymId: 'g1', gymName: 'RockZone', setterId: 's1', setterUsername: 'ivan-rutov', setterName: 'Иван Рутов', tags: ['campus'], photoUrls: [], rating: 4.4, ascentsCount: 76, status: 'Active', createdAt: '2026-05-01T00:00:00Z' },
  { id: 'r10', name: 'Розовый фламинго', grade: '5C+', gradeIndex: 8, type: 'TopRope', holdColor: 'Pink', sector: 'Начинающие', gymId: 'g1', gymName: 'RockZone', setterId: 's2', setterUsername: 'anna-trassova', setterName: 'Анна Трассова', tags: ['dynamic'], photoUrls: [], rating: 4.5, ascentsCount: 145, status: 'Active', createdAt: '2026-04-20T00:00:00Z' },
  { id: 'r11', name: 'Белый рывок', grade: '6A', gradeIndex: 10, type: 'Speed', holdColor: 'White', sector: 'Скорость', gymId: 'g2', gymName: 'BigWall', setterId: 's4', setterUsername: 'maria-speed', setterName: 'Мария Скорость', tags: ['speed', 'dynamic'], photoUrls: [], rating: 4.3, ascentsCount: 92, status: 'Active', createdAt: '2026-06-05T00:00:00Z' },
  { id: 'r12', name: 'Чёрная молния', grade: '7A', gradeIndex: 17, type: 'Lead', holdColor: 'Black', sector: 'Спорт', gymId: 'g2', gymName: 'BigWall', setterId: 's5', setterUsername: 'alexey-strong', setterName: 'Алексей Сильный', tags: ['overhang', 'power', 'crimp'], photoUrls: ['/mock/route12-1.jpg'], rating: 4.9, ascentsCount: 34, status: 'Active', createdAt: '2026-06-01T00:00:00Z' },
  { id: 'r13', name: 'Зелёный дракон', grade: '6C', gradeIndex: 14, type: 'Lead', holdColor: 'Green', sector: 'Спорт', gymId: 'g2', gymName: 'BigWall', setterId: 's4', setterUsername: 'maria-speed', setterName: 'Мария Скорость', tags: ['endurance', 'arete'], photoUrls: [], rating: 4.4, ascentsCount: 56, status: 'Active', createdAt: '2026-05-15T00:00:00Z' },
  { id: 'r14', name: 'Сирень', grade: '5C', gradeIndex: 7, type: 'Boulder', holdColor: 'Purple', sector: 'Боулдер', gymId: 'g2', gymName: 'BigWall', setterId: 's5', setterUsername: 'alexey-strong', setterName: 'Алексей Сильный', tags: ['slab'], photoUrls: [], rating: 4.0, ascentsCount: 120, status: 'Active', createdAt: '2026-04-01T00:00:00Z' },
  { id: 'r15', name: 'Изумруд', grade: '6B', gradeIndex: 12, type: 'Lead', holdColor: 'Green', sector: 'Спорт', gymId: 'g2', gymName: 'BigWall', setterId: 's4', setterUsername: 'maria-speed', setterName: 'Мария Скорость', tags: ['endurance'], photoUrls: [], rating: 4.2, ascentsCount: 88, status: 'Active', createdAt: '2026-05-10T00:00:00Z' },
  { id: 'r16', name: 'Коричневый сахар', grade: '6A', gradeIndex: 10, type: 'TopRope', holdColor: 'Brown', sector: 'Начинающие', gymId: 'g2', gymName: 'BigWall', setterId: 's5', setterUsername: 'alexey-strong', setterName: 'Алексей Сильный', tags: ['warmup'], photoUrls: [], rating: 3.9, ascentsCount: 200, status: 'Active', createdAt: '2026-03-20T00:00:00Z' },
  { id: 'r17', name: 'Пурпурный туман', grade: '6A', gradeIndex: 10, type: 'Boulder', holdColor: 'Purple', sector: 'Зал А', gymId: 'g3', gymName: 'Лимейт', setterId: 's6', setterUsername: 'olga-boulder', setterName: 'Ольга Боулдер', tags: ['technical', 'sloper'], photoUrls: [], rating: 4.3, ascentsCount: 110, status: 'Active', createdAt: '2026-05-22T00:00:00Z' },
  { id: 'r18', name: 'Алый парус', grade: '5C', gradeIndex: 7, type: 'Boulder', holdColor: 'Red', sector: 'Зал Б', gymId: 'g3', gymName: 'Лимейт', setterId: 's6', setterUsername: 'olga-boulder', setterName: 'Ольга Боулдер', tags: ['endurance', 'slab'], photoUrls: [], rating: 4.1, ascentsCount: 150, status: 'Active', createdAt: '2026-04-10T00:00:00Z' },
  { id: 'r19', name: 'Лагуна', grade: '6B', gradeIndex: 12, type: 'Boulder', holdColor: 'Blue', sector: 'Зал А', gymId: 'g3', gymName: 'Лимейт', setterId: 's7', setterUsername: 'pavel-laza', setterName: 'Павел Лаза', tags: ['slab', 'dynamic'], photoUrls: ['/mock/route19-1.jpg'], rating: 4.5, ascentsCount: 80, status: 'Active', createdAt: '2026-05-05T00:00:00Z' },
  { id: 'r20', name: 'Цитрус', grade: '5A', gradeIndex: 3, type: 'Boulder', holdColor: 'Orange', sector: 'Зал Б', gymId: 'g3', gymName: 'Лимейт', setterId: 's7', setterUsername: 'pavel-laza', setterName: 'Павел Лаза', tags: ['warmup'], photoUrls: [], rating: 4.0, ascentsCount: 250, status: 'Active', createdAt: '2026-02-01T00:00:00Z' },
  { id: 'r21', name: 'Тень', grade: '6B+', gradeIndex: 13, type: 'Boulder', holdColor: 'Black', sector: 'Зал А', gymId: 'g3', gymName: 'Лимейт', setterId: 's6', setterUsername: 'olga-boulder', setterName: 'Ольга Боулдер', tags: ['overhang', 'power'], photoUrls: [], rating: 4.6, ascentsCount: 42, status: 'Active', createdAt: '2026-06-08T00:00:00Z' },
  { id: 'r22', name: 'Облако', grade: '5B', gradeIndex: 5, type: 'Boulder', holdColor: 'White', sector: 'Зал Б', gymId: 'g3', gymName: 'Лимейт', setterId: 's7', setterUsername: 'pavel-laza', setterName: 'Павел Лаза', tags: ['slab', 'pocket'], photoUrls: [], rating: 3.8, ascentsCount: 180, status: 'Active', createdAt: '2026-03-15T00:00:00Z' },
  { id: 'r23', name: 'Новатор', grade: '6A', gradeIndex: 10, type: 'Lead', holdColor: 'Red', sector: 'Центральная стена', gymId: 'g4', gymName: 'НоваЦентр', setterId: 's8', setterUsername: 'sergey-novy', setterName: 'Сергей Новый', tags: ['overhang'], photoUrls: [], rating: 4.4, ascentsCount: 95, status: 'Active', createdAt: '2026-06-12T00:00:00Z' },
  { id: 'r24', name: 'Сапфир', grade: '6B', gradeIndex: 12, type: 'Boulder', holdColor: 'Blue', sector: 'Боулдеринг', gymId: 'g4', gymName: 'НоваЦентр', setterId: 's9', setterUsername: 'natalya-tsentr', setterName: 'Наталья Центр', tags: ['technical'], photoUrls: [], rating: 4.3, ascentsCount: 70, status: 'Active', createdAt: '2026-05-28T00:00:00Z' },
  { id: 'r25', name: 'Заря', grade: '5C', gradeIndex: 7, type: 'TopRope', holdColor: 'Yellow', sector: 'Автостраховка', gymId: 'g4', gymName: 'НоваЦентр', setterId: 's8', setterUsername: 'sergey-novy', setterName: 'Сергей Новый', tags: ['warmup'], photoUrls: [], rating: 4.1, ascentsCount: 160, status: 'Active', createdAt: '2026-04-05T00:00:00Z' },
  { id: 'r26', name: 'Лофт-лайн', grade: '6B+', gradeIndex: 13, type: 'Boulder', holdColor: 'Gray', sector: 'Зал 1', gymId: 'g5', gymName: 'Лодж', setterId: 's10', setterUsername: 'kirill-lodge', setterName: 'Кирилл Лодж', tags: ['power', 'crimp'], photoUrls: [], rating: 4.7, ascentsCount: 38, status: 'Active', createdAt: '2026-06-15T00:00:00Z' },
  { id: 'r27', name: 'Скорость света', grade: '5A', gradeIndex: 3, type: 'Boulder', holdColor: 'White', sector: 'Зал 2', gymId: 'g5', gymName: 'Лодж', setterId: 's10', setterUsername: 'kirill-lodge', setterName: 'Кирилл Лодж', tags: ['speed'], photoUrls: [], rating: 4.2, ascentsCount: 90, status: 'Active', createdAt: '2026-05-30T00:00:00Z' },
  { id: 'r28', name: 'Террариум', grade: '6A', gradeIndex: 10, type: 'Boulder', holdColor: 'Green', sector: 'Зал 1', gymId: 'g5', gymName: 'Лодж', setterId: 's11', setterUsername: 'evgeny-les', setterName: 'Евгений Лес', tags: ['slab', 'endurance'], photoUrls: ['/mock/route28-1.jpg'], rating: 4.4, ascentsCount: 55, status: 'Active', createdAt: '2026-05-20T00:00:00Z' },
];

function paginate<T>(items: T[], page: number, pageSize: number): PaginatedList<T> {
  const totalCount = items.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    page, pageSize, totalCount, totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
}

export const routeHandlers = [
  http.get('/api/routes/gym/:gymId', async ({ request, params }) => {
    await mockDelay(400);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    let items = MOCK_ROUTES.filter((r) => r.gymId === params.gymId);
    const type = url.searchParams.get('type');
    if (type && type !== 'all') items = items.filter((r) => r.type === type);
    const holdColor = url.searchParams.get('holdColor');
    if (holdColor && holdColor !== 'all') items = items.filter((r) => r.holdColor === holdColor);
    const status = url.searchParams.get('status');
    if (status && status !== 'all') items = items.filter((r) => r.status === status);
    return HttpResponse.json<PaginatedList<RouteDto>>(paginate(items, page, pageSize));
  }),

  http.get('/api/routes/:id', async ({ params }) => {
    await mockDelay(300);
    const route = MOCK_ROUTES.find((r) => r.id === params.id);
    if (!route) return HttpResponse.json(null, { status: 404 });
    return HttpResponse.json<RouteDto>(route);
  }),

  http.put('/api/routes/:routeId/notes', async () => {
    await mockDelay(200);
    return HttpResponse.json(undefined, { status: 200 });
  }),

  http.get('/api/routes/:routeId/consensus', async ({ params }) => {
    await mockDelay(300);
    const route = MOCK_ROUTES.find((r) => r.id === params.routeId);
    if (!route) return HttpResponse.json(null, { status: 404 });
    const baseIndex = route.gradeIndex;
    const consensus: GradeConsensus = {
      routeId: route.id,
      gradeDistribution: [
        { grade: '6A', gradeIndex: 10, count: 5 },
        { grade: '6A+', gradeIndex: 11, count: 12 },
        { grade: '6B', gradeIndex: 12, count: 20 },
        { grade: '6B+', gradeIndex: 13, count: 18 },
        { grade: '6C', gradeIndex: 14, count: 10 },
      ].map((g) => ({
        ...g,
        gradeIndex: g.gradeIndex + Math.max(0, baseIndex - 12),
      })),
      consensusGrade: route.grade,
      consensusGradeIndex: baseIndex,
      totalVotes: 65,
      userVote: baseIndex,
    };
    return HttpResponse.json<GradeConsensus>(consensus);
  }),

  http.get('/api/routes/:routeId/reviews', async ({ params }) => {
    await mockDelay(300);
    const reviews: RouteReviewDto[] = [
      { id: 'rev1', routeId: params.routeId as string, userId: 'u2', username: 'ekaterina-smirnova', displayName: 'Екатерина Смирнова', rating: 4, comment: 'Классная трасса, отлично проработана!', createdAt: '2026-06-20T18:30:00Z' },
      { id: 'rev2', routeId: params.routeId as string, userId: 'u3', username: 'dmitry-volkov', displayName: 'Дмитрий Волков', rating: 5, comment: 'Огонь! Обязательно попробуйте.', createdAt: '2026-06-19T20:00:00Z' },
    ];
    return HttpResponse.json<PaginatedList<RouteReviewDto>>(paginate(reviews, 1, 10));
  }),

  http.post('/api/routes', async ({ request }) => {
    await mockDelay(300);
    const body = (await request.json()) as CreateRoutePayload;
    const newRoute: RouteDto = {
      id: `r${MOCK_ROUTES.length + 100}`,
      name: body.name ?? '',
      grade: body.gradeRaw ?? '6A',
      gradeIndex: 10,
      type: body.type ?? 'Boulder',
      holdColor: body.holdColor ?? 'Red',
      sector: body.sector ?? undefined,
      gymId: body.gymId,
      gymName: '',
      setterId: body.setterId ?? '',
      setterUsername: '',
      setterName: '',
      tags: body.tags ?? [],
      description: body.description,
      photoUrls: body.photoUrls ?? [],
      rating: 0,
      ascentsCount: 0,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };
    MOCK_ROUTES.push(newRoute);
    return HttpResponse.json<RouteDto>(newRoute, { status: 201 });
  }),

  http.put('/api/routes/:id', async ({ params: _p, request }) => {
    await mockDelay(300);
    const body = (await request.json()) as UpdateRoutePayload;
    const idx = MOCK_ROUTES.findIndex((r) => r.id === _p.id);
    if (idx === -1) return HttpResponse.json(null, { status: 404 });
    MOCK_ROUTES[idx] = { ...MOCK_ROUTES[idx], ...body, sector: body.sector ?? undefined, description: body.description ?? undefined };
    return HttpResponse.json<RouteDto>(MOCK_ROUTES[idx]);
  }),
];
