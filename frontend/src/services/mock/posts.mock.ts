import type { PostDto, PostAscentDto, CommentDto, PostDetailDto, RecommendedUserDto, RecommendedRouteDto, RecommendedGymDto, FeedSuggestionsDto } from '../../types/post';
import type { PaginatedList } from '../../types/common';
import { mockDelay } from './helpers';

const CURRENT_USER_ID = '550e8400-e29b-41d4-a716-446655440001';

function paginate<T>(items: T[], page: number, pageSize: number): PaginatedList<T> {
  const totalCount = items.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    page,
    pageSize,
    totalCount,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
}

const FILLER_ASCENTS: PostAscentDto[][] = [
  [
    { id: 'fa1', routeId: 'r1', routeName: 'Красная стрела', grade: '6A', holdColor: 'Red', style: 'Flash', isFlash: true },
    { id: 'fa2', routeId: 'r7', routeName: 'Ночной дозор', grade: '6A+', holdColor: 'Black', style: 'Attempt' },
    { id: 'fa3', routeId: 'r3', routeName: 'Золотая середина', grade: '5C', holdColor: 'Yellow', style: 'Onsight' },
    { id: 'fa4', routeId: 'r5', routeName: 'Лягушка', grade: '5B', holdColor: 'Green', style: 'Flash', isFlash: true },
  ],
  [
    { id: 'fb1', routeId: 'r4', routeName: 'Пурпурный пик', grade: '6C', holdColor: 'Purple', style: 'Attempt' },
    { id: 'fb2', routeId: 'r9', routeName: 'Гранит', grade: '6B', holdColor: 'Gray', style: 'Redpoint' },
    { id: 'fb3', routeId: 'r6', routeName: 'Мандарин', grade: '5C', holdColor: 'Orange', style: 'Flash', isFlash: true },
  ],
  [
    { id: 'fc1', routeId: 'r2', routeName: 'Синий мув', grade: '6B+', holdColor: 'Blue', style: 'Flash', isFlash: true },
    { id: 'fc2', routeId: 'r8', routeName: 'Арктика', grade: '5A', holdColor: 'White', style: 'Onsight' },
    { id: 'fc3', routeId: 'r10', routeName: 'Розовый фламинго', grade: '5C+', holdColor: 'Pink', style: 'Redpoint' },
    { id: 'fc4', routeId: 'r5', routeName: 'Лягушка', grade: '5B', holdColor: 'Green', style: 'Attempt' },
  ],
  [
    { id: 'fd1', routeId: 'r12', routeName: 'Чёрная молния', grade: '7A', holdColor: 'Black', style: 'Attempt' },
    { id: 'fd2', routeId: 'r11', routeName: 'Белый рывок', grade: '6A', holdColor: 'White', style: 'Flash', isFlash: true },
  ],
  [
    { id: 'fe1', routeId: 'r17', routeName: 'Пурпурный туман', grade: '6A', holdColor: 'Purple', style: 'Redpoint' },
    { id: 'fe2', routeId: 'r19', routeName: 'Лагуна', grade: '6B', holdColor: 'Blue', style: 'Flash', isFlash: true },
    { id: 'fe3', routeId: 'r21', routeName: 'Тень', grade: '6B+', holdColor: 'Black', style: 'Attempt' },
  ],
  [
    { id: 'ff1', routeId: 'r23', routeName: 'Новатор', grade: '6A', holdColor: 'Red', style: 'Onsight' },
    { id: 'ff2', routeId: 'r24', routeName: 'Сапфир', grade: '6B', holdColor: 'Blue', style: 'Attempt' },
  ],
  [
    { id: 'fg1', routeId: 'r13', routeName: 'Зелёный дракон', grade: '6C', holdColor: 'Green', style: 'Flash', isFlash: true },
    { id: 'fg2', routeId: 'r15', routeName: 'Изумруд', grade: '6B', holdColor: 'Green', style: 'Redpoint' },
    { id: 'fg3', routeId: 'r16', routeName: 'Коричневый сахар', grade: '6A', holdColor: 'Brown', style: 'Attempt' },
  ],
  [
    { id: 'fh1', routeId: 'r26', routeName: 'Лофт-лайн', grade: '6B+', holdColor: 'Gray', style: 'Attempt' },
    { id: 'fh2', routeId: 'r28', routeName: 'Террариум', grade: '6A', holdColor: 'Green', style: 'Flash', isFlash: true },
  ],
];

// ── Посты тренировок (свои, isOwner = true) ──────────────
export const MOCK_MY_POSTS: PostDto[] = [
  {
    id: 'p1',
    userId: CURRENT_USER_ID,
    displayName: 'Алексей Кузнецов',
    userAvatarUrl: undefined,
    gymId: 'g1',
    gymName: 'RockZone',
    body: 'Отличная тренировка перед выходными! Пролез 14 трасс, из них 2 в проекте — прогресс идёт 💪🔥',
    mediaUrls: ['/mock/post1-1.jpg', '/mock/post1-2.jpg', '/mock/post1-3.jpg'],
    visibility: 'Public',
    stats: { totalKruskor: 42, avgGrade: '5C', duration: 105, totalRoutes: 14, maxGrade: '6C' },
    ascents: [
      { id: 'a1', routeId: 'r1', routeName: 'Красная стрела', grade: '6A', holdColor: 'Red', style: 'Flash', isFlash: true, tags: [{ name: 'overhang' , category: 'style' }, { name: 'crimp' , category: 'hold' }, { name: 'dynamic' , category: 'style' }, { name: 'roof' , category: 'relief' }] },
      { id: 'a2', routeId: 'r2', routeName: 'Синий мув', grade: '6B+', holdColor: 'Blue', style: 'Attempt', tags: [{ name: 'technical' , category: 'style' }, { name: 'slab' , category: 'style' }, { name: 'sloper' , category: 'hold' }, { name: 'arete' , category: 'relief' }] },
      { id: 'a3', routeId: 'r3', routeName: 'Золотая середина', grade: '5C', holdColor: 'Yellow', style: 'Redpoint', tags: [{ name: 'endurance' , category: 'style' }, { name: 'steep' , category: 'relief' }, { name: 'boulder' , category: 'type' }] },
      { id: 'a4', routeId: 'r4', routeName: 'Пурпурный пик', grade: '6C', holdColor: 'Purple', style: 'Attempt', tags: [{ name: 'overhang' , category: 'style' }, { name: 'power' , category: 'style' }, { name: 'pinch' , category: 'hold' }, { name: 'lead' , category: 'type' }] },
      { id: 'a5', routeId: 'r5', routeName: 'Лягушка', grade: '5B', holdColor: 'Green', style: 'Flash', isFlash: true, tags: [{ name: 'slab' , category: 'style' }, { name: 'pocket' , category: 'hold' }] },
      { id: 'a6', routeId: 'r6', routeName: 'Мандарин', grade: '5C', holdColor: 'Orange', style: 'Onsight', tags: [{ name: 'endurance' , category: 'style' }, { name: 'dihedral' , category: 'relief' }, { name: 'toprope' , category: 'type' }] },
      { id: 'a7', routeId: 'r7', routeName: 'Ночной дозор', grade: '6A+', holdColor: 'Black', style: 'Flash', isFlash: true, tags: [{ name: 'technical' , category: 'style' }, { name: 'overhang' , category: 'style' }, { name: 'jug' , category: 'hold' }] },
      { id: 'a8', routeId: 'r8', routeName: 'Арктика', grade: '5A', holdColor: 'White', style: 'Redpoint', tags: [{ name: 'slab' , category: 'style' }, { name: 'boulder' , category: 'type' }] },
      { id: 'a9', routeId: 'r9', routeName: 'Гранит', grade: '6B', holdColor: 'Gray', style: 'Attempt', tags: [{ name: 'campus' , category: 'style' }, { name: 'lead' , category: 'type' }] },
      { id: 'a10', routeId: 'r10', routeName: 'Розовый фламинго', grade: '5C+', holdColor: 'Pink', style: 'Flash', isFlash: true, tags: [{ name: 'dynamic' , category: 'style' }, { name: 'toprope' , category: 'type' }] },
      { id: 'a11', routeId: 'r11', routeName: 'Белый рывок', grade: '6A', holdColor: 'White', style: 'Flash', isFlash: true, tags: [{ name: 'speed' , category: 'style' }, { name: 'dynamic' , category: 'style' }] },
      { id: 'a12', routeId: 'r12', routeName: 'Чёрная молния', grade: '7A', holdColor: 'Black', style: 'Project', tags: [{ name: 'overhang' , category: 'style' }, { name: 'power' , category: 'style' }] },
      { id: 'a13', routeId: 'r13', routeName: 'Глубина', grade: '6C', holdColor: 'Blue', style: 'Project', tags: [{ name: 'overhang' , category: 'style' }, { name: 'power' , category: 'style' }, { name: 'project' , category: 'style' }] },
      { id: 'a14', routeId: 'r14', routeName: 'Солнцеворот', grade: '5A', holdColor: 'Yellow', style: 'Flash', isFlash: true, tags: [{ name: 'warmup' , category: 'style' }] },
    ],
    likesCount: 12,
    commentsCount: 3,
    isLiked: false,
    isBookmarked: false,
    createdAt: '2026-06-25T19:30:00Z',
  },
  {
    id: 'p2',
    userId: CURRENT_USER_ID,
    displayName: 'Алексей Кузнецов',
    userAvatarUrl: undefined,
    gymId: 'g3',
    gymName: 'Лимейт',
    body: 'Работа над проектами. Зелёный дракон 6C пока не дался, но в следующий раз 🔥',
    mediaUrls: ['/mock/post2-1.jpg', '/mock/post2-2.jpg'],
    visibility: 'Private',
    stats: { totalKruskor: 28, avgGrade: '5C+', duration: 130, totalRoutes: 8, maxGrade: '6C' },
    ascents: [
      { id: 'a15', routeId: 'r15', routeName: 'Зелёный дракон', grade: '6C', holdColor: 'Green', style: 'Project', tags: [{ name: 'overhang' , category: 'style' }, { name: 'project' , category: 'style' }, { name: 'crimp' , category: 'hold' }, { name: 'lead' , category: 'type' }] },
      { id: 'a16', routeId: 'r16', routeName: 'Коричневый сахар', grade: '6A', holdColor: 'Brown', style: 'Redpoint', tags: [{ name: 'endurance' , category: 'style' }, { name: 'vert' , category: 'relief' }] },
      { id: 'a17', routeId: 'r17', routeName: 'Пурпурный туман', grade: '6A', holdColor: 'Purple', style: 'Flash', isFlash: true, tags: [{ name: 'technical' , category: 'style' }, { name: 'sloper' , category: 'hold' }, { name: 'dihedral' , category: 'relief' }] },
      { id: 'a18', routeId: 'r18', routeName: 'Лагуна', grade: '6B', holdColor: 'Blue', style: 'Redpoint', tags: [{ name: 'slab' , category: 'style' }, { name: 'boulder' , category: 'type' }] },
      { id: 'a19', routeId: 'r19', routeName: 'Цитрус', grade: '5A', holdColor: 'Orange', style: 'Flash', isFlash: true, tags: [{ name: 'warmup' , category: 'style' }, { name: 'jug' , category: 'hold' }] },
      { id: 'a20', routeId: 'r20', routeName: 'Тень', grade: '6B+', holdColor: 'Black', style: 'Attempt', tags: [{ name: 'overhang' , category: 'style' }, { name: 'power' , category: 'style' }, { name: 'roof' , category: 'relief' }] },
      { id: 'a21', routeId: 'r21', routeName: 'Облако', grade: '5B', holdColor: 'White', style: 'Flash', isFlash: true, tags: [{ name: 'slab' , category: 'style' }, { name: 'pocket' , category: 'hold' }] },
      { id: 'a22', routeId: 'r22', routeName: 'Заря', grade: '6A', holdColor: 'Yellow', style: 'Redpoint', tags: [{ name: 'endurance' , category: 'style' }] },
    ],
    likesCount: 4,
    commentsCount: 1,
    isLiked: false,
    isBookmarked: false,
    createdAt: '2026-05-30T18:00:00Z',
  },
  {
    id: 'p3',
    userId: CURRENT_USER_ID,
    displayName: 'Алексей Кузнецов',
    userAvatarUrl: undefined,
    gymId: 'g2',
    gymName: 'BigWall',
    body: 'Первый раз в BigWall! Отличный зал с интересными трассами. 7A пока не осилил, но всё впереди 💪',
    mediaUrls: ['/mock/post3-1.jpg', '/mock/post3-2.jpg', '/mock/post3-3.jpg'],
    visibility: 'Public',
    stats: { totalKruskor: 24, avgGrade: '6A', duration: 90, totalRoutes: 5, maxGrade: '7A' },
    ascents: [
      { id: 'a23', routeId: 'r23', routeName: 'Новатор', grade: '6A', holdColor: 'Red', style: 'Onsight', tags: [{ name: 'overhang' , category: 'style' }, { name: 'lead' , category: 'type' }] },
      { id: 'a24', routeId: 'r24', routeName: 'Сапфир', grade: '6B', holdColor: 'Blue', style: 'Attempt', tags: [{ name: 'technical' , category: 'style' }] },
      { id: 'a25', routeId: 'r25', routeName: 'Заря', grade: '5C', holdColor: 'Yellow', style: 'Flash', isFlash: true, tags: [{ name: 'warmup' , category: 'style' }] },
      { id: 'a26', routeId: 'r26', routeName: 'Лофт-лайн', grade: '6B+', holdColor: 'Gray', style: 'Redpoint', tags: [{ name: 'power' , category: 'style' }, { name: 'crimp' , category: 'hold' }] },
      { id: 'a27', routeId: 'r27', routeName: 'Скорость света', grade: '5A', holdColor: 'White', style: 'Flash', isFlash: true, tags: [{ name: 'speed' , category: 'style' }] },
    ],
    likesCount: 8,
    commentsCount: 2,
    isLiked: true,
    isBookmarked: false,
    createdAt: '2026-05-25T14:00:00Z',
  },
  // дополнительные посты для пагинации
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `my${i + 10}`,
    userId: CURRENT_USER_ID,
    displayName: 'Алексей Кузнецов',
    userAvatarUrl: undefined,
    gymId: ['g1','g1','g1','g2','g3','g4','g5','g2'][i],
    gymName: ['RockZone','RockZone','RockZone','BigWall','Лимейт','НоваЦентр','Лодж','BigWall'][i],
    body: `Тренировка #${i + 4}. ${['Работа над техникой.','Силовой день.','Лёгкая разминка.','Проекты.','Боулдеринг.','Скорость и динамика.','Выносливость.','Флагманские трассы.'][i]}`,
    mediaUrls: i % 2 === 0 ? ['/mock/route1-1.jpg'] : ([] as string[]),
    visibility: 'Public' as const,
    stats: { totalKruskor: 15 + i * 3, avgGrade: ['6A','5C+','5B','7A','6A','5C','6B','6B+'][i], duration: 60 + i * 10, totalRoutes: FILLER_ASCENTS[i].length, maxGrade: ['6C','6C','6B+','7A','6B+','6B','6C','6B+'][i] },
    ascents: FILLER_ASCENTS[i],
    likesCount: Math.floor(Math.random() * 12),
    commentsCount: Math.floor(Math.random() * 4),
    isLiked: i % 3 === 0,
    isBookmarked: false,
    createdAt: new Date(2026, 5, 20 - i).toISOString(),
  })),
];

// ── Посты ленты (чужие, isOwner = false) ──────────────
export const MOCK_FEED_POSTS: PostDto[] = [
  {
    id: 'f1',
    userId: 'u2',
    displayName: 'Екатерина Смирнова',
    userAvatarUrl: undefined,
    gymId: 'g1',
    gymName: 'RockZone',
    body: 'Отличная тренировка! Пролезла свою первую 6B на редпоинт 💪',
    mediaUrls: ['/mock/feed1-1.jpg', '/mock/feed1-2.jpg', '/mock/feed1-3.jpg'],
    visibility: 'Public',
    stats: { totalKruskor: 42, avgGrade: '5C', duration: 105, totalRoutes: 12, maxGrade: '6C' },
    ascents: [
      { id: 'f1a', routeId: 'r1', routeName: 'Красная стрела', grade: '6A', holdColor: 'Red', style: 'Flash', isFlash: true, tags: [{ name: 'overhang' , category: 'style' }, { name: 'crimp' , category: 'hold' }, { name: 'roof' , category: 'relief' }] },
      { id: 'f1b', routeId: 'r2', routeName: 'Синий мув', grade: '6B', holdColor: 'Blue', style: 'Redpoint', tags: [{ name: 'technical' , category: 'style' }, { name: 'sloper' , category: 'hold' }, { name: 'lead' , category: 'type' }] },
      { id: 'f1c', routeId: 'r3', routeName: 'Золотая середина', grade: '5C', holdColor: 'Yellow', style: 'Flash', isFlash: true, tags: [{ name: 'endurance' , category: 'style' }, { name: 'arete' , category: 'relief' }] },
      { id: 'f1d', routeId: 'r4', routeName: 'Пурпурный туман', grade: '6A', holdColor: 'Purple', style: 'Flash', isFlash: true, tags: [{ name: 'technical' , category: 'style' }, { name: 'boulder' , category: 'type' }] },
      { id: 'f1e', routeId: 'r5', routeName: 'Апельсин', grade: '5B', holdColor: 'Orange', style: 'Onsight', tags: [{ name: 'warmup' , category: 'style' }, { name: 'jug' , category: 'hold' }] },
      { id: 'f1f', routeId: 'r15', routeName: 'Зелёный дракон', grade: '6C', holdColor: 'Green', style: 'Project', tags: [{ name: 'overhang' , category: 'style' }, { name: 'project' , category: 'style' }, { name: 'pinch' , category: 'hold' }, { name: 'toprope' , category: 'type' }] },
      { id: 'f1g', routeId: 'r7', routeName: 'Ночной дозор', grade: '6A+', holdColor: 'Black', style: 'Flash', isFlash: true, tags: [{ name: 'dynamic' , category: 'style' }, { name: 'steep' , category: 'relief' }] },
      { id: 'f1h', routeId: 'r8', routeName: 'Арктика', grade: '5A', holdColor: 'White', style: 'Redpoint', tags: [{ name: 'slab' , category: 'style' }, { name: 'lead' , category: 'type' }] },
      { id: 'f1i', routeId: 'r10', routeName: 'Розовый фламинго', grade: '5C+', holdColor: 'Pink', style: 'Flash', isFlash: true, tags: [{ name: 'dynamic' , category: 'style' }, { name: 'pocket' , category: 'hold' }] },
      { id: 'f1j', routeId: 'r11', routeName: 'Коричневый сахар', grade: '6A', holdColor: 'Brown', style: 'Redpoint', tags: [{ name: 'endurance' , category: 'style' }] },
      { id: 'f1k', routeId: 'r9', routeName: 'Гранит', grade: '6B', holdColor: 'Gray', style: 'Attempt', tags: [{ name: 'campus' , category: 'style' }] },
      { id: 'f1l', routeId: 'r13', routeName: 'Глубина', grade: '6C', holdColor: 'Blue', style: 'Project', tags: [{ name: 'power' , category: 'style' }, { name: 'project' , category: 'style' }] },
    ],
    likesCount: 24,
    commentsCount: 5,
    isLiked: false,
    isBookmarked: false,
    createdAt: '2026-06-25T10:00:00Z',
  },
  {
    id: 'f2',
    userId: 'u3',
    displayName: 'Михаил Петров',
    userAvatarUrl: undefined,
    gymId: 'g3',
    gymName: 'Лимейт',
    body: 'Наконец-то закрыл этот проект! 7A в зале Лимейт 🔥',
    mediaUrls: [],
    visibility: 'Public',
    stats: { totalKruskor: 64, avgGrade: '6C', duration: 120, totalRoutes: 6, maxGrade: '7A' },
    ascents: [
      { id: 'f2a', routeId: 'r24', routeName: 'Чёрная молния', grade: '7A', holdColor: 'Black', style: 'Redpoint', tags: [{ name: 'overhang' , category: 'style' }, { name: 'power' , category: 'style' }, { name: 'crimp' , category: 'hold' }, { name: 'lead' , category: 'type' }] },
      { id: 'f2b', routeId: 'r2', routeName: 'Синий мув', grade: '6B+', holdColor: 'Blue', style: 'Flash', isFlash: true, tags: [{ name: 'technical' , category: 'style' }, { name: 'sloper' , category: 'hold' }, { name: 'boulder' , category: 'type' }] },
      { id: 'f2c', routeId: 'r3', routeName: 'Золотая середина', grade: '5C', holdColor: 'Yellow', style: 'Flash', isFlash: true, tags: [{ name: 'endurance' , category: 'style' }, { name: 'dihedral' , category: 'relief' }, { name: 'toprope' , category: 'type' }] },
      { id: 'f2d', routeId: 'r27', routeName: 'Изумруд', grade: '6B', holdColor: 'Green', style: 'Redpoint', tags: [{ name: 'slab' , category: 'style' }, { name: 'jug' , category: 'hold' }] },
      { id: 'f2e', routeId: 'r19', routeName: 'Цитрус', grade: '5A', holdColor: 'Orange', style: 'Flash', isFlash: true, tags: [{ name: 'warmup' , category: 'style' }, { name: 'steep' , category: 'relief' }] },
      { id: 'f2f', routeId: 'r26', routeName: 'Сирень', grade: '5C', holdColor: 'Purple', style: 'Onsight', tags: [{ name: 'endurance' , category: 'style' }] },
    ],
    likesCount: 18,
    commentsCount: 4,
    isLiked: true,
    isBookmarked: true,
    createdAt: '2026-06-24T15:00:00Z',
  },
  {
    id: 'f3',
    userId: 'u4',
    displayName: 'Дмитрий Волков',
    userAvatarUrl: undefined,
    gymId: 'g2',
    gymName: 'BigWall',
    body: 'Размялся в BigWall — отличные новые трассы, всем советую! 👌',
    mediaUrls: ['/mock/feed3-1.jpg', '/mock/feed3-2.jpg'],
    visibility: 'Public',
    stats: { totalKruskor: 28, avgGrade: '5C', duration: 70, totalRoutes: 4, maxGrade: '7A' },
    ascents: [
      { id: 'f3a', routeId: 'r23', routeName: 'Апельсин', grade: '5B', holdColor: 'Orange', style: 'Onsight', tags: [{ name: 'warmup' , category: 'style' }, { name: 'lead' , category: 'type' }] },
      { id: 'f3b', routeId: 'r25', routeName: 'Белый рывок', grade: '6A', holdColor: 'White', style: 'Flash', isFlash: true, tags: [{ name: 'dynamic' , category: 'style' }, { name: 'roof' , category: 'relief' }, { name: 'boulder' , category: 'type' }] },
      { id: 'f3c', routeId: 'r24', routeName: 'Чёрная молния', grade: '7A', holdColor: 'Black', style: 'Attempt', tags: [{ name: 'overhang' , category: 'style' }, { name: 'power' , category: 'style' }, { name: 'crimp' , category: 'hold' }] },
      { id: 'f3d', routeId: 'r26', routeName: 'Сирень', grade: '5C', holdColor: 'Purple', style: 'Redpoint', tags: [{ name: 'slab' , category: 'style' }] },
    ],
    likesCount: 8,
    commentsCount: 2,
    isLiked: false,
    isBookmarked: false,
    createdAt: '2026-06-24T09:00:00Z',
  },
];

// ── Комментарии ────────────────────────────────────
const MOCK_COMMENTS: Record<string, CommentDto[]> = {
  p1: [
    { id: 'c1', postId: 'p1', userId: 'u2', displayName: 'Екатерина Смирнова', text: 'Классная тренировка! 🔥', createdAt: '2026-06-25T20:00:00Z' },
    { id: 'c2', postId: 'p1', userId: 'u3', displayName: 'Михаил Петров', text: '14 трасс — мощно!', createdAt: '2026-06-25T20:30:00Z' },
    { id: 'c3', postId: 'p1', userId: 'u4', displayName: 'Дмитрий Волков', text: 'Красная стрела — отличная трасса', createdAt: '2026-06-25T21:00:00Z' },
  ],
  p2: [
    { id: 'c4', postId: 'p2', userId: 'u2', displayName: 'Екатерина Смирнова', text: 'Зелёный дракон коварный!', createdAt: '2026-05-30T19:00:00Z' },
  ],
  p3: [
    { id: 'c5', postId: 'p3', userId: 'u3', displayName: 'Михаил Петров', text: 'BigWall — топ зал!', createdAt: '2026-05-25T15:00:00Z' },
    { id: 'c6', postId: 'p3', userId: 'u4', displayName: 'Дмитрий Волков', text: 'Чёрная молния — моя любимая', createdAt: '2026-05-25T16:00:00Z' },
  ],
  f1: [
    { id: 'c7', postId: 'f1', userId: CURRENT_USER_ID, displayName: 'Алексей Кузнецов', text: 'Круто! 6B редпоинт — огонь! 🔥', createdAt: '2026-06-25T11:00:00Z' },
    { id: 'c8', postId: 'f1', userId: 'u3', displayName: 'Михаил Петров', text: 'Поздравляю!', createdAt: '2026-06-25T12:00:00Z' },
    { id: 'c9', postId: 'f1', userId: 'u4', displayName: 'Дмитрий Волков', text: 'В какой сектор ходила?', createdAt: '2026-06-25T12:30:00Z' },
    { id: 'c10', postId: 'f1', userId: 'u2', displayName: 'Екатерина Смирнова', text: 'Спасибо! В левый, там новый сет', createdAt: '2026-06-25T13:00:00Z' },
    { id: 'c11', postId: 'f1', userId: 'u5', displayName: 'Ольга Иванова', text: 'Супер! 💪', createdAt: '2026-06-25T14:00:00Z' },
  ],
  f2: [
    { id: 'c12', postId: 'f2', userId: CURRENT_USER_ID, displayName: 'Алексей Кузнецов', text: '7A! Красава!', createdAt: '2026-06-24T16:00:00Z' },
    { id: 'c13', postId: 'f2', userId: 'u2', displayName: 'Екатерина Смирнова', text: 'Сколько подходов было?', createdAt: '2026-06-24T16:30:00Z' },
    { id: 'c14', postId: 'f2', userId: 'u3', displayName: 'Михаил Петров', text: 'Где-то 8 подходов за месяц', createdAt: '2026-06-24T17:00:00Z' },
    { id: 'c15', postId: 'f2', userId: 'u4', displayName: 'Дмитрий Волков', text: 'Мощно!', createdAt: '2026-06-24T18:00:00Z' },
  ],
  f3: [
    { id: 'c16', postId: 'f3', userId: CURRENT_USER_ID, displayName: 'Алексей Кузнецов', text: 'Согласен, отличный зал!', createdAt: '2026-06-24T10:00:00Z' },
    { id: 'c17', postId: 'f3', userId: 'u2', displayName: 'Екатерина Смирнова', text: 'О, тоже там был на днях!', createdAt: '2026-06-24T11:00:00Z' },
  ],
};

// ── Mock functions ─────────────────────────────────

export async function mockGetWorkoutFeed(page = 1, pageSize = 10): Promise<PaginatedList<PostDto>> {
  await mockDelay(400);
  return paginate(MOCK_MY_POSTS, page, pageSize);
}

export async function mockGetFeedPosts(filter?: 'subs' | 'recommended', page = 1, pageSize = 10): Promise<PaginatedList<PostDto>> {
  await mockDelay(400);
  const items = filter === 'recommended' ? MOCK_FEED_POSTS.filter((_, i) => i === 2) : MOCK_FEED_POSTS;
  return paginate(items, page, pageSize);
}

export async function mockGetPostById(postId: string): Promise<PostDetailDto | null> {
  await mockDelay(300);
  const allPosts = [...MOCK_MY_POSTS, ...MOCK_FEED_POSTS];
  const post = allPosts.find((p) => p.id === postId);
  if (!post) return null;
  return {
    ...post,
    likedBy: [
      { id: 'u2', displayName: 'Екатерина Смирнова' },
      { id: 'u3', displayName: 'Михаил Петров' },
      { id: 'u5', displayName: 'Ольга Иванова' },
      { id: 'u6', displayName: 'Иван Сидоров' },
      { id: 'u7', displayName: 'Настя Козлова' },
    ].slice(0, post.likesCount > 4 ? 5 : post.likesCount),
  };
}

export async function mockGetComments(postId: string): Promise<CommentDto[]> {
  await mockDelay(200);
  return MOCK_COMMENTS[postId] ?? [];
}

export async function mockToggleLike(_postId: string, _isLiked: boolean): Promise<void> {
  void _postId;
  void _isLiked;
  await mockDelay(150);
}

export async function mockAddComment(postId: string, text: string): Promise<CommentDto> {
  await mockDelay(150);
  return {
    id: crypto.randomUUID(),
    postId,
    userId: CURRENT_USER_ID,
    displayName: 'Алексей',
    text,
    createdAt: new Date().toISOString(),
  };
}

export async function mockDeletePost(_postId: string): Promise<void> {
  void _postId;
  await mockDelay(200);
}

export async function mockCreatePost(): Promise<PostDto> {
  await mockDelay(300);
  return MOCK_MY_POSTS[0];
}

export async function mockGetFeedSuggestions(): Promise<FeedSuggestionsDto> {
  await mockDelay(200);
  return {
    users: [
      { id: 'u4', displayName: 'Дмитрий Волков', commonFollowers: 2, isFollowed: false },
      { id: 'u5', displayName: 'Ольга Иванова', commonFollowers: 5, isFollowed: false },
      { id: 'u6', displayName: 'Иван Сидоров', commonFollowers: 1, isFollowed: false },
      { id: 'u7', displayName: 'Настя Козлова', commonFollowers: 3, isFollowed: true },
    ],
    routes: [
      { id: 'r1', name: 'Красная стрела', grade: '6A', holdColor: 'Red', rating: 4.8, gymName: 'RockZone', gymId: 'g1' },
      { id: 'r12', name: 'Чёрная молния', grade: '7A', holdColor: 'Black', rating: 4.6, gymName: 'BigWall', gymId: 'g2' },
      { id: 'r15', name: 'Зелёный дракон', grade: '6C', holdColor: 'Green', rating: 4.3, gymName: 'RockZone', gymId: 'g1' },
      { id: 'r2', name: 'Синий мув', grade: '6B+', holdColor: 'Blue', rating: 4.5, gymName: 'BigWall', gymId: 'g2' },
    ],
    gyms: [
      { id: 'g1', name: 'RockZone', rating: 4.5, distance: '1.2 км', area: 1200, maxHeight: 14, activeRouteCount: 24 },
      { id: 'g2', name: 'BigWall', rating: 4.7, distance: '2.8 км', area: 2500, maxHeight: 18, activeRouteCount: 42 },
      { id: 'g3', name: 'Лимейт', rating: 4.2, distance: '3.5 км', area: 800, maxHeight: 10, activeRouteCount: 18 },
    ],
  };
}

