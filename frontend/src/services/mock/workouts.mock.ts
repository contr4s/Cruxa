import type { PostDto, CommentDto } from '../../types/post';
import { mockDelay } from './helpers';

export const MOCK_POSTS: PostDto[] = [
  {
    id: 'p1',
    userId: '550e8400-e29b-41d4-a716-446655440001',
    userName: 'Алексей К.',
    gymId: 'g1',
    gymName: 'RockZone',
    body: 'Отличная тренировка! Наконец-то закрыл проект 6C 🎉',
    mediaUrls: ['/mock/post1-1.jpg', '/mock/post1-2.jpg', '/mock/post1-3.jpg'],
    visibility: 'Public',
    stats: { totalKruskor: 42, avgGrade: '5C', duration: 105, totalRoutes: 22 },
    ascents: [
      { id: 'a1', routeId: 'r1', routeName: 'Красный дракон', grade: '6C', holdColor: 'Red', style: 'Flash', isFlash: true },
      { id: 'a2', routeId: 'r3', routeName: 'Зелёный гоблин', grade: '6C+', holdColor: 'Green', style: 'Project' },
      { id: 'a3', routeId: 'r4', routeName: 'Жёлтая подводная лодка', grade: '6B', holdColor: 'Yellow', style: 'Flash', isFlash: true },
    ],
    likesCount: 18,
    commentsCount: 4,
    isLiked: false,
    isBookmarked: false,
    createdAt: '2026-06-15T19:30:00Z',
  },
  {
    id: 'p2',
    userId: '660e8400-e29b-41d4-a716-446655440002',
    userName: 'Мария С.',
    gymId: 'g2',
    gymName: 'Big Wall',
    body: 'Утренняя сессия перед работой 🔥',
    mediaUrls: ['/mock/post2-1.jpg'],
    visibility: 'Public',
    stats: { totalKruskor: 38, avgGrade: '6A', duration: 90, totalRoutes: 15 },
    ascents: [
      { id: 'a4', routeId: 'r2', routeName: 'Синяя лагуна', grade: '6B+', holdColor: 'Blue', style: 'Redpoint' },
      { id: 'a5', routeId: 'r5', routeName: 'Оранжевое настроение', grade: '6C', holdColor: 'Orange', style: 'Attempt' },
    ],
    likesCount: 12,
    commentsCount: 2,
    isLiked: true,
    isBookmarked: false,
    createdAt: '2026-06-14T08:15:00Z',
  },
  {
    id: 'p3',
    userId: '770e8400-e29b-41d4-a716-446655440003',
    userName: 'Дмитрий В.',
    gymId: 'g3',
    gymName: 'LimeIt',
    body: 'Работаем над динамикой 💪',
    mediaUrls: ['/mock/post3-1.jpg', '/mock/post3-2.jpg'],
    visibility: 'Public',
    stats: { totalKruskor: 55, avgGrade: '6B', duration: 120, totalRoutes: 28 },
    ascents: [
      { id: 'a6', routeId: 'r4', routeName: 'Жёлтая подводная лодка', grade: '6B', holdColor: 'Yellow', style: 'Onsight' },
      { id: 'a7', routeId: 'r1', routeName: 'Красный дракон', grade: '6C', holdColor: 'Red', style: 'Attempt' },
    ],
    likesCount: 24,
    commentsCount: 6,
    isLiked: false,
    isBookmarked: true,
    createdAt: '2026-06-13T20:00:00Z',
  },
];

const MOCK_COMMENTS: Record<string, CommentDto[]> = {
  p1: [
    { id: 'c1', postId: 'p1', userId: 'u2', userName: 'Мария С.', text: 'Красава! 🔥', createdAt: '2026-06-15T20:00:00Z' },
    { id: 'c2', postId: 'p1', userId: 'u3', userName: 'Дмитрий В.', text: 'Классная тренировка!', createdAt: '2026-06-15T21:15:00Z' },
    { id: 'c3', postId: 'p1', userId: 'u4', userName: 'Анна П.', text: 'Сколько раз ходил на дракона?', createdAt: '2026-06-15T22:00:00Z' },
    { id: 'c4', postId: 'p1', userId: '550e8400-e29b-41d4-a716-446655440001', userName: 'Алексей К.', text: 'Анна, 3 попытки, зафлешил 💪', createdAt: '2026-06-15T22:30:00Z' },
  ],
  p2: [
    { id: 'c5', postId: 'p2', userId: 'u3', userName: 'Дмитрий В.', text: 'Утренние — самые лучшие!', createdAt: '2026-06-14T09:00:00Z' },
    { id: 'c6', postId: 'p2', userId: 'u5', userName: 'Елена К.', text: 'Согласна 👍', createdAt: '2026-06-14T10:30:00Z' },
  ],
  p3: [
    { id: 'c7', postId: 'p3', userId: 'u2', userName: 'Мария С.', text: 'Динамика огонь!', createdAt: '2026-06-13T21:00:00Z' },
    { id: 'c8', postId: 'p3', userId: 'u4', userName: 'Анна П.', text: 'Какой зал?', createdAt: '2026-06-13T21:30:00Z' },
    { id: 'c9', postId: 'p3', userId: '770e8400-e29b-41d4-a716-446655440003', userName: 'Дмитрий В.', text: 'LimeIt', createdAt: '2026-06-13T22:00:00Z' },
  ],
};

export async function mockGetWorkoutFeed(): Promise<PostDto[]> {
  await mockDelay(400);
  return MOCK_POSTS;
}

export async function mockGetComments(postId: string): Promise<CommentDto[]> {
  await mockDelay(200);
  return MOCK_COMMENTS[postId] ?? [];
}

export async function mockToggleLike(_postId: string, _isLiked: boolean): Promise<void> {
  void _postId;
  void _isLiked;
  await mockDelay(150);
  // In mock mode, just return success
  return;
}
