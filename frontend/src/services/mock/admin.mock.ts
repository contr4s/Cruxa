import type { AdminDashboardStats, RecentActivityItem, TopGymItem, AdminGymItem } from '../../types/admin';
import type { PaginatedList } from '../../types/common';
import type { AdminGymFilterState } from '../../types/admin';
import { mockDelay } from './helpers';
import { MOCK_GYMS } from './gyms.mock';
import { MOCK_ROUTES } from './routes.mock';

/* ---------- helpers ---------- */

const GYM_STATUS: Record<string, 'Active' | 'Pending' | 'Blocked'> = {
  g1: 'Active',
  g2: 'Active',
  g3: 'Active',
  g4: 'Active',
  g5: 'Pending',
};

function getSettersPerGym(): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  for (const r of MOCK_ROUTES) {
    if (!map.has(r.gymId)) map.set(r.gymId, new Set());
    map.get(r.gymId)!.add(r.setterId);
  }
  return map;
}

function getAscentsPerGym(): Map<string, number> {
  const map = new Map<string, number>();
  for (const r of MOCK_ROUTES) {
    map.set(r.gymId, (map.get(r.gymId) ?? 0) + r.ascentsCount);
  }
  return map;
}

function buildAdminGyms(): AdminGymItem[] {
  const settersMap = getSettersPerGym();
  const ascentsMap = getAscentsPerGym();
  return MOCK_GYMS.map((g) => ({
    id: g.id,
    name: g.name,
    city: g.city,
    routeCount: g.routeCount,
    setterCount: settersMap.get(g.id)?.size ?? 0,
    rating: g.rating,
    monthlyAscents: ascentsMap.get(g.id) ?? 0,
    status: GYM_STATUS[g.id] ?? 'Pending',
  }));
}

const CACHED_ADMIN_GYMS = buildAdminGyms();

/* ---------- mocks ---------- */

export async function mockGetAdminStats(): Promise<AdminDashboardStats> {
  await mockDelay(300);
  const uniqueSetters = new Set(MOCK_ROUTES.map((r) => r.setterId));
  const monthlyAscents = MOCK_ROUTES
    .filter((r) => {
      const d = new Date(r.createdAt);
      const now = new Date();
      return d.getTime() > now.getTime() - 30 * 86400000;
    })
    .reduce((sum, r) => sum + r.ascentsCount, 0);

  return {
    totalGyms: MOCK_GYMS.length,
    totalRoutes: MOCK_ROUTES.length,
    totalSetters: uniqueSetters.size,
    monthlyAscents: monthlyAscents || 5890, // fallback if no routes in last 30d
  };
}

export async function mockGetRecentActivity(): Promise<RecentActivityItem[]> {
  await mockDelay(250);
  return [
    { gymId: 'g1', gymName: 'RockZone', event: '5 новых трасс', timestamp: 'сегодня', isOnline: true },
    { gymId: 'g3', gymName: 'Лимейт', event: 'обновление цен', timestamp: 'вчера', isOnline: true },
    { gymId: 'g2', gymName: 'BigWall', event: '+2 рутсеттера, новые трассы', timestamp: '3 дня назад', isOnline: true },
    { gymId: 'g5', gymName: 'Лодж', event: 'нет данных', timestamp: 'неделю', isOnline: false },
  ];
}

export async function mockGetTopGyms(): Promise<TopGymItem[]> {
  await mockDelay(250);
  const ascentsMap = getAscentsPerGym();
  return MOCK_GYMS
    .map((g) => ({ gymId: g.id, gymName: g.name, ascentsCount: ascentsMap.get(g.id) ?? 0 }))
    .sort((a, b) => b.ascentsCount - a.ascentsCount)
    .slice(0, 4);
}

export async function mockGetAdminGyms(
  params?: Partial<AdminGymFilterState> & { page?: number; pageSize?: number },
): Promise<PaginatedList<AdminGymItem>> {
  await mockDelay(400);

  let items = [...CACHED_ADMIN_GYMS];

  if (params?.city && params.city !== 'all') {
    items = items.filter((g) => g.city === params.city);
  }
  if (params?.status && params.status !== 'all') {
    items = items.filter((g) => g.status === params.status);
  }
  if (params?.sort) {
    if (params.sort === 'name') items.sort((a, b) => a.name.localeCompare(b.name));
    else if (params.sort === 'rating') items.sort((a, b) => b.rating - a.rating);
    else if (params.sort === 'routes') items.sort((a, b) => b.routeCount - a.routeCount);
    else if (params.sort === 'ascents') items.sort((a, b) => b.monthlyAscents - a.monthlyAscents);
  }

  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const totalCount = items.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const paginated = items.slice((page - 1) * pageSize, page * pageSize);

  return {
    items: paginated,
    page,
    pageSize,
    totalCount,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
}
