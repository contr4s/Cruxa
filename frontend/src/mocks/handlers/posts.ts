import { http, HttpResponse } from 'msw';
import type { PaginatedList } from '../../types/common';
import type { PostDto, CommentDto, PostDetailDto, PostAscentDto, FeedSuggestionsDto } from '../../types/post';
import { mockDelay } from '../helpers';
import { MOCK_ROUTES } from './routes';

const CURRENT_USER_ID = '550e8400-e29b-41d4-a716-446655440001';

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

const FILLER_ASCENTS: PostDto['ascents'][] = [
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

const MOCK_MY_POSTS: PostDto[] = [
  {
    id: 'p1', userId: CURRENT_USER_ID, username: 'alexey', displayName: 'Алексей Кузнецов',
    gymId: 'g1', gymName: 'RockZone',
    body: 'Отличная тренировка перед выходными! Пролез 14 трасс, из них 2 в проекте — прогресс идёт 💪🔥',
    mediaUrls: ['/mock/post1-1.jpg', '/mock/post1-2.jpg', '/mock/post1-3.jpg'],
    visibility: 'Public',
    stats: { deltaKruskor: 42, avgGrade: '5C', duration: 105, totalRoutes: 14, maxGrade: '6C' },
    ascents: [
      { id: 'a1', routeId: 'r1', routeName: 'Красная стрела', grade: '6A', holdColor: 'Red', style: 'Flash', isFlash: true },
      { id: 'a2', routeId: 'r2', routeName: 'Синий мув', grade: '6B+', holdColor: 'Blue', style: 'Attempt' },
      { id: 'a3', routeId: 'r3', routeName: 'Золотая середина', grade: '5C', holdColor: 'Yellow', style: 'Redpoint' },
      { id: 'a4', routeId: 'r4', routeName: 'Пурпурный пик', grade: '6C', holdColor: 'Purple', style: 'Attempt' },
      { id: 'a5', routeId: 'r5', routeName: 'Лягушка', grade: '5B', holdColor: 'Green', style: 'Flash', isFlash: true },
      { id: 'a6', routeId: 'r6', routeName: 'Мандарин', grade: '5C', holdColor: 'Orange', style: 'Onsight' },
      { id: 'a7', routeId: 'r7', routeName: 'Ночной дозор', grade: '6A+', holdColor: 'Black', style: 'Flash', isFlash: true },
      { id: 'a8', routeId: 'r8', routeName: 'Арктика', grade: '5A', holdColor: 'White', style: 'Redpoint' },
      { id: 'a9', routeId: 'r9', routeName: 'Гранит', grade: '6B', holdColor: 'Gray', style: 'Attempt' },
      { id: 'a10', routeId: 'r10', routeName: 'Розовый фламинго', grade: '5C+', holdColor: 'Pink', style: 'Flash', isFlash: true },
      { id: 'a11', routeId: 'r11', routeName: 'Белый рывок', grade: '6A', holdColor: 'White', style: 'Flash', isFlash: true },
      { id: 'a12', routeId: 'r12', routeName: 'Чёрная молния', grade: '7A', holdColor: 'Black', style: 'Project' },
      { id: 'a13', routeId: 'r13', routeName: 'Глубина', grade: '6C', holdColor: 'Blue', style: 'Project' },
      { id: 'a14', routeId: 'r14', routeName: 'Солнцеворот', grade: '5A', holdColor: 'Yellow', style: 'Flash', isFlash: true },
    ],
    likesCount: 12, commentsCount: 3, isLiked: false,
    createdAt: '2026-06-25T19:30:00Z',
  },
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `my${i + 10}`, username: 'alexey', userId: CURRENT_USER_ID, displayName: 'Алексей Кузнецов',
    gymId: ['g1','g1','g1','g2','g3','g4','g5','g2'][i],
    gymName: ['RockZone','RockZone','RockZone','BigWall','Лимейт','НоваЦентр','Лодж','BigWall'][i],
    body: `Тренировка #${i + 4}. ${['Работа над техникой.','Силовой день.','Лёгкая разминка.','Проекты.','Боулдеринг.','Скорость и динамика.','Выносливость.','Флагманские трассы.'][i]}`,
    mediaUrls: i % 2 === 0 ? ['/mock/route1-1.jpg'] : [],
    visibility: 'Public' as const,
    stats: { deltaKruskor: 15 + i * 3, avgGrade: ['6A','5C+','5B','7A','6A','5C','6B','6B+'][i], duration: 60 + i * 10, totalRoutes: FILLER_ASCENTS[i].length, maxGrade: ['6C','6C','6B+','7A','6B+','6B','6C','6B+'][i] },
    ascents: FILLER_ASCENTS[i],
    likesCount: Math.floor(Math.random() * 12),
    commentsCount: Math.floor(Math.random() * 4),
    isLiked: i % 3 === 0,
    createdAt: new Date(2026, 5, 20 - i).toISOString(),
  })),
];

const MOCK_FEED_POSTS: PostDto[] = [
  {
    id: 'f1', username: 'ekaterina-smirnova', userId: 'u2', displayName: 'Екатерина Смирнова',
    gymId: 'g1', gymName: 'RockZone',
    body: 'Отличная тренировка! Пролезла свою первую 6B на редпоинт 💪',
    mediaUrls: ['/mock/feed1-1.jpg', '/mock/feed1-2.jpg', '/mock/feed1-3.jpg'],
    visibility: 'Public',
    stats: { deltaKruskor: 42, avgGrade: '5C', duration: 105, totalRoutes: 12, maxGrade: '6C' },
    ascents: [
      { id: 'f1a', routeId: 'r1', routeName: 'Красная стрела', grade: '6A', holdColor: 'Red', style: 'Flash', isFlash: true },
      { id: 'f1b', routeId: 'r2', routeName: 'Синий мув', grade: '6B', holdColor: 'Blue', style: 'Redpoint' },
      { id: 'f1c', routeId: 'r3', routeName: 'Золотая середина', grade: '5C', holdColor: 'Yellow', style: 'Flash', isFlash: true },
    ],
    likesCount: 8, commentsCount: 2, isLiked: false,
    createdAt: '2026-06-24T15:00:00Z',
  },
];

const MOCK_COMMENTS: Record<string, CommentDto[]> = {
  p1: [
    { id: 'c1', postId: 'p1', userId: 'u2', username: 'ekaterina-smirnova', displayName: 'Екатерина Смирнова', text: 'Красава! 🔥', createdAt: '2026-06-25T20:00:00Z' },
    { id: 'c2', postId: 'p1', userId: 'u3', username: 'dmitry-volkov', displayName: 'Дмитрий Волков', text: 'Классная тренировка!', createdAt: '2026-06-25T21:15:00Z' },
    { id: 'c3', postId: 'p1', userId: 'u4', username: 'anna-pavlova', displayName: 'Анна Павлова', text: 'Сколько раз ходил на дракона?', createdAt: '2026-06-25T22:00:00Z' },
  ],
};

let _draftCounter = 10;
// Shared mutable store for user-created drafts/posts
const _userPosts: Map<string, PostDto> = new Map();

export const postHandlers = [
  http.get('/api/posts/feed', async ({ request }) => {
    await mockDelay(400);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const filter = url.searchParams.get('filter');
    const userPostsArr = Array.from(_userPosts.values()).filter(p => p.mediaUrls.length > 0 || (p.body && p.body.length > 0));
    const items = filter === 'subs' ? MOCK_FEED_POSTS : [...userPostsArr, ...MOCK_MY_POSTS, ...MOCK_FEED_POSTS];
    return HttpResponse.json<PaginatedList<PostDto>>(paginate(items, page, pageSize));
  }),

  http.get('/api/posts/:postId', async ({ params }) => {
    await mockDelay(300);
    const post = [..._userPosts.values(), ...MOCK_MY_POSTS, ...MOCK_FEED_POSTS].find((p) => p.id === params.postId);
    if (!post) return HttpResponse.json(null, { status: 404 });
    const detail: PostDetailDto = {
      ...post,
      likedBy: post.isLiked ? [{ id: 'u2', username: 'ekaterina-smirnova', displayName: 'Екатерина Смирнова' }] : [],
    };
    return HttpResponse.json<PostDetailDto>(detail);
  }),

  http.get('/api/posts/:postId/comments', async ({ params: p }) => {
    await mockDelay(200);
    const comments = MOCK_COMMENTS[p.postId as string] ?? [];
    return HttpResponse.json<PaginatedList<CommentDto>>(paginate(comments, 1, 10));
  }),

  http.post('/api/posts/:postId/like', async ({ params: _p }) => {
    await mockDelay(150);
    return HttpResponse.json(undefined, { status: 200 });
  }),

  http.delete('/api/posts/:postId/unlike', async () => {
    await mockDelay(150);
    return HttpResponse.json(undefined, { status: 200 });
  }),

  http.post('/api/posts/:postId/comments', async ({ params, request }) => {
    await mockDelay(200);
    const { text } = (await request.json()) as { text: string };
    const comment: CommentDto = {
      id: `c${Date.now()}`, postId: params.postId as string,
      userId: CURRENT_USER_ID, username: 'alexey', displayName: 'Алексей Кузнецов',
      text, createdAt: new Date().toISOString(),
    };
    return HttpResponse.json<CommentDto>(comment, { status: 201 });
  }),

  http.delete('/api/posts/:postId', async () => {
    await mockDelay(200);
    return HttpResponse.json(undefined, { status: 200 });
  }),

  http.post('/api/posts', async ({ request }) => {
    await mockDelay(300);
    _draftCounter++;
    const body = (await request.json()) as { gymId?: string; status?: string } | null;
    const newPost: PostDto = {
      id: `draft-${_draftCounter}`, username: 'alexey', userId: CURRENT_USER_ID, displayName: 'Алексей',
      gymId: body?.gymId, gymName: body?.gymId ? MOCK_ROUTES.find(r => r.gymId === body.gymId)?.gymName : undefined,
      ascents: [], mediaUrls: [], visibility: 'Public',
      stats: { deltaKruskor: 0, avgGrade: '', totalRoutes: 0 },
      likesCount: 0, commentsCount: 0, isLiked: false,
      createdAt: new Date().toISOString(),
    };
    _userPosts.set(newPost.id, newPost);
    return HttpResponse.json<PostDto>(newPost, { status: 201 });
  }),

  http.put('/api/posts/:id', async ({ params, request }) => {
    await mockDelay(200);
    const data = (await request.json()) as Partial<PostDto> & { status?: string };
    const existing = _userPosts.get(params.id as string);
    const updated: PostDto = {
      id: params.id as string, username: 'alexey', userId: CURRENT_USER_ID, displayName: 'Алексей',
      gymId: 'g1', gymName: 'RockZone',
      ascents: existing?.ascents ?? [], mediaUrls: existing?.mediaUrls ?? [], visibility: 'Public',
      stats: { deltaKruskor: 0, avgGrade: '', totalRoutes: (existing?.ascents ?? []).length },
      likesCount: 0, commentsCount: 0, isLiked: false,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      ...data,
    };
    delete (updated as unknown as Record<string, unknown>).status;
    _userPosts.set(updated.id, updated);
    return HttpResponse.json<PostDto>(updated);
  }),

  http.post('/api/posts/:postId/ascents', async ({ request, params }) => {
    await mockDelay(250);
    _draftCounter++;
    const data = (await request.json()) as { routeId: string; style: string; mediaUrls?: string[] };
    const route = MOCK_ROUTES.find((r) => r.id === data.routeId);
    const ascent: PostAscentDto = {
      id: `ascent-${_draftCounter}`,
      routeId: data.routeId, routeName: route?.name ?? 'Трасса',
      grade: route?.grade ?? '6A', holdColor: route?.holdColor ?? 'Red',
      style: data.style as PostAscentDto['style'],
      mediaUrls: data.mediaUrls,
    };
    // Store ascent in the user post
    const post = _userPosts.get(params.postId as string);
    if (post) {
      post.ascents = [...post.ascents, ascent];
      if (data.mediaUrls && data.mediaUrls.length > 0) {
        post.mediaUrls = [...post.mediaUrls, ...data.mediaUrls];
      }
    }
    return HttpResponse.json<PostAscentDto>(ascent, { status: 201 });
  }),

  http.delete('/api/posts/:postId/ascents/:ascentId', async () => {
    await mockDelay(150);
    return HttpResponse.json(undefined, { status: 200 });
  }),

  http.get('/api/posts/user/:userId', async ({ request }) => {
    await mockDelay(300);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    return HttpResponse.json<PaginatedList<PostDto>>(paginate(MOCK_MY_POSTS, page, pageSize));
  }),

  http.get('/api/feed/suggestions', async () => {
    await mockDelay(300);
    return HttpResponse.json<FeedSuggestionsDto>({
      users: [
        { id: 'u2', username: 'ekaterina-smirnova', displayName: 'Екатерина Смирнова', userAvatarUrl: undefined, commonFollowers: 3, isFollowed: false },
        { id: 'u3', username: 'dmitry-volkov', displayName: 'Дмитрий Волков', userAvatarUrl: undefined, commonFollowers: 1, isFollowed: false },
      ],
      routes: [
        { id: 'r4', name: 'Пурпурный пик', grade: '6C', holdColor: 'Purple', rating: 4.3, gymName: 'RockZone', gymId: 'g1' },
        { id: 'r12', name: 'Чёрная молния', grade: '7A', holdColor: 'Black', rating: 4.9, gymName: 'BigWall', gymId: 'g2' },
        { id: 'r21', name: 'Тень', grade: '6B+', holdColor: 'Black', rating: 4.6, gymName: 'Лимейт', gymId: 'g3' },
      ],
      gyms: [
        { id: 'g2', name: 'BigWall', rating: 4.7, lat: 55.7654, lon: 37.6141, area: 1800, maxHeight: 22, activeRouteCount: 87 },
        { id: 'g4', name: 'НоваЦентр', rating: 4.3, lat: 55.7812, lon: 37.5678, area: 1500, maxHeight: 15, activeRouteCount: 95 },
      ],
    });
  }),
];
