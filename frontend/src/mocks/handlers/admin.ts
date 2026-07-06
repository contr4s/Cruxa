import { http, HttpResponse } from 'msw';
import type { AdminDashboardStats, AdminGymItem } from '../../types/admin';
import type { PaginatedList } from '../../types/common';
import { mockDelay } from '../helpers';
import { MOCK_GYMS } from './gyms';
import { MOCK_ROUTES } from './routes';

export const adminHandlers = [
  http.get('/api/admin/stats', async () => {
    await mockDelay(300);
    const uniqueSetters = new Set(MOCK_ROUTES.map((r) => r.setterId));
    return HttpResponse.json<AdminDashboardStats>({
      totalGyms: MOCK_GYMS.length,
      totalRoutes: MOCK_ROUTES.length,
      totalSetters: uniqueSetters.size,
      monthlyAscents: 5890,
    });
  }),

  http.get('/api/admin/recent-activity', async () => {
    await mockDelay(250);
    return HttpResponse.json([
      { gymId: 'g1', gymName: 'RockZone', event: '5 новых трасс', timestamp: 'сегодня', isOnline: true },
      { gymId: 'g3', gymName: 'Лимейт', event: 'обновление цен', timestamp: 'вчера', isOnline: true },
      { gymId: 'g5', gymName: 'Лодж', event: 'нет данных', timestamp: 'неделю', isOnline: false },
    ]);
  }),

  http.get('/api/admin/top-gyms', async () => {
    await mockDelay(250);
    return HttpResponse.json(
      MOCK_GYMS.map((g) => ({ gymId: g.id, gymName: g.name, ascentsCount: g.routeCount }))
        .sort((a, b) => b.ascentsCount - a.ascentsCount)
        .slice(0, 4),
    );
  }),

  http.get('/api/admin/gyms', async ({ request }) => {
    await mockDelay(400);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const items: AdminGymItem[] = MOCK_GYMS.map((g) => ({
      id: g.id, name: g.name, city: g.city,
      routeCount: g.routeCount, setterCount: MOCK_ROUTES.filter((r) => r.gymId === g.id).length,
      rating: g.rating, monthlyAscents: g.routeCount * 3,
      status: g.id === 'g5' ? 'Pending' as const : 'Active' as const,
    }));
    return HttpResponse.json<PaginatedList<AdminGymItem>>({
      items, page, pageSize, totalCount: items.length, totalPages: 1,
      hasPreviousPage: false, hasNextPage: false,
    });
  }),
];
