import type { RoutesetterStats, QuickOverview, RouteReviewSummary, LinkedGymSummary } from '../../types/routesetter';
import type { RouteDto } from '../../types/route';
import type { PaginatedList } from '../../types/common';
import { mockDelay } from './helpers';
import { MOCK_ROUTES } from './routes.mock';
import type { GetSetterRoutesParams } from '../routesetter.service';

const CURRENT_SETTER_ID = 's1';

function getSetterRoutesInternal(): RouteDto[] {
  return MOCK_ROUTES.filter((r) => r.setterId === CURRENT_SETTER_ID);
}

export async function mockGetRoutesetterStats(): Promise<RoutesetterStats> {
  await mockDelay(300);
  const routes = getSetterRoutesInternal().filter((r) => r.status === 'Active');
  const totalAscents = routes.reduce((sum, r) => sum + r.ascentsCount, 0);
  const avgRating = routes.length ? routes.reduce((sum, r) => sum + r.rating, 0) / routes.length : 0;
  return {
    activeRoutes: routes.length,
    averageRating: parseFloat(avgRating.toFixed(1)),
    totalAscents,
  };
}

export async function mockGetSetterRoutes(params?: GetSetterRoutesParams): Promise<PaginatedList<RouteDto>> {
  await mockDelay(400);

  let items = getSetterRoutesInternal();

  if (params?.type && params.type !== 'all') {
    items = items.filter((r) => r.type === params.type);
  }
  if (params?.holdColor && params.holdColor !== 'all') {
    items = items.filter((r) => r.holdColor === params.holdColor);
  }
  if (params?.minGradeIndex !== undefined) {
    items = items.filter((r) => r.gradeIndex >= (params.minGradeIndex ?? 0));
  }
  if (params?.maxGradeIndex !== undefined) {
    items = items.filter((r) => r.gradeIndex <= (params.maxGradeIndex ?? 99));
  }
  if (params?.status && params.status !== 'all') {
    items = items.filter((r) => r.status === params.status);
  }
  if (params?.gymId && params.gymId !== 'all') {
    items = items.filter((r) => r.gymId === params.gymId);
  }
  if (params?.searchQuery) {
    const q = params.searchQuery.toLowerCase();
    items = items.filter((r) => r.name.toLowerCase().includes(q));
  }
  if (params?.minRating !== undefined) {
    items = items.filter((r) => r.rating >= (params.minRating ?? 0));
  }
  if (params?.maxRating !== undefined) {
    items = items.filter((r) => r.rating <= (params.maxRating ?? 5));
  }
  if (params?.minAscents !== undefined) {
    items = items.filter((r) => r.ascentsCount >= (params.minAscents ?? 0));
  }
  if (params?.maxAscents !== undefined) {
    items = items.filter((r) => r.ascentsCount <= (params.maxAscents ?? 10000));
  }
  if (params?.createdWithin && params.createdWithin > 0) {
    const cutoff = Date.now() - params.createdWithin * 86400000;
    items = items.filter((r) => new Date(r.createdAt).getTime() >= cutoff);
  }
  if (params?.tags) {
    const tags = params.tags.split(',').map((t) => t.trim().toLowerCase());
    items = items.filter((r) => tags.some((t) => r.tags.some((rt) => rt.toLowerCase().includes(t))));
  }

  if (params?.sort) {
    if (params.sort === 'grade_asc') items.sort((a, b) => a.gradeIndex - b.gradeIndex);
    else if (params.sort === 'grade_desc') items.sort((a, b) => b.gradeIndex - a.gradeIndex);
    else if (params.sort === 'rating') items.sort((a, b) => b.rating - a.rating);
    else if (params.sort === 'ascents') items.sort((a, b) => b.ascentsCount - a.ascentsCount);
    else if (params.sort === 'newest') items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    else if (params.sort === 'oldest') items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    else if (params.sort === 'name_asc') items.sort((a, b) => a.name.localeCompare(b.name));
    else if (params.sort === 'name_desc') items.sort((a, b) => b.name.localeCompare(a.name));
  }

  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const totalCount = items.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const paginated = items.slice((page - 1) * pageSize, page * pageSize);

  return { items: paginated, page, pageSize, totalCount, totalPages, hasPreviousPage: page > 1, hasNextPage: page < totalPages };
}

export async function mockGetSetterReviews(): Promise<RouteReviewSummary[]> {
  await mockDelay(300);
  const setterRoutes = getSetterRoutesInternal();
  const reviews: RouteReviewSummary[] = [
    { id: 'rev_s1', routeId: 'r1', routeName: 'Красная стрела', routeGrade: '6A', userId: 'u1', displayName: 'Алексей К.', rating: 5, comment: 'Отличная трасса, очень техничная.', createdAt: '2026-06-10T12:00:00Z' },
    { id: 'rev_s2', routeId: 'r1', routeName: 'Красная стрела', routeGrade: '6A', userId: 'u2', displayName: 'Мария С.', rating: 4, comment: 'Классика RockZone. Сложнее, чем кажется.', createdAt: '2026-06-08T10:30:00Z' },
    { id: 'rev_s3', routeId: 'r3', routeName: 'Золотая середина', routeGrade: '5C', userId: 'u4', displayName: 'Наталья Ц.', rating: 4, comment: 'Идеальная для работы на выносливость.', createdAt: '2026-05-15T10:00:00Z' },
    { id: 'rev_s4', routeId: 'r6', routeName: 'Мандарин', routeGrade: '5C', userId: 'u5', displayName: 'Сергей Н.', rating: 3, comment: 'Немного скучновата для разминки.', createdAt: '2026-05-10T09:00:00Z' },
    { id: 'rev_s5', routeId: 'r9', routeName: 'Гранит', routeGrade: '6B', userId: 'u6', displayName: 'Ольга Б.', rating: 5, comment: 'Кампус-трасса огонь! Руки устали отлично.', createdAt: '2026-05-18T08:30:00Z' },
  ];
  return reviews;
}

export async function mockGetLinkedGyms(): Promise<LinkedGymSummary[]> {
  await mockDelay(250);
  return [
    { id: 'g1', name: 'RockZone', city: 'Москва', address: 'ул. Красная Пресня, 12', activeRouteCount: 132, rating: 4.5 },
    { id: 'g2', name: 'BigWall', city: 'Москва', address: 'ул. Большая Дмитровка, 9', activeRouteCount: 87, rating: 4.7 },
  ];
}

export async function mockArchiveRoute(routeId: string): Promise<void> {
  await mockDelay(200);
  const route = MOCK_ROUTES.find((r) => r.id === routeId);
  if (route) route.status = 'Archived';
}

export async function mockRestoreRoute(routeId: string): Promise<void> {
  await mockDelay(200);
  const route = MOCK_ROUTES.find((r) => r.id === routeId);
  if (route) route.status = 'Active';
}
