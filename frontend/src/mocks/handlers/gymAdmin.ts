import { http, HttpResponse } from 'msw';
import type { GymAdminStats, GymActivity, SetterManagementItem } from '../../types/gymAdmin';
import type { RouteDto } from '../../types/route';
import type { PaginatedList } from '../../types/common';
import { mockDelay } from '../helpers';
import { MOCK_ROUTES } from './routes';

export const gymAdminHandlers = [
  http.get('/api/gyms/:gymId/admin-stats', async () => {
    await mockDelay(300);
    return HttpResponse.json<GymAdminStats>({
      totalRoutes: MOCK_ROUTES.length,
      activeRoutes: MOCK_ROUTES.filter((r) => r.status === 'Active').length,
      averageRating: 4.3,
      totalAscents: MOCK_ROUTES.reduce((s, r) => s + r.ascentsCount, 0),
    });
  }),

  http.get('/api/gyms/:gymId/admin-routes', async ({ request }) => {
    await mockDelay(400);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const items = MOCK_ROUTES;
    const totalCount = items.length;
    return HttpResponse.json<PaginatedList<RouteDto>>({
      items: items.slice((page - 1) * pageSize, page * pageSize),
      page, pageSize, totalCount, totalPages: Math.ceil(totalCount / pageSize),
      hasPreviousPage: page > 1, hasNextPage: page < Math.ceil(totalCount / pageSize),
    });
  }),

  http.get('/api/gyms/:gymId/activity', async () => {
    await mockDelay(250);
    return HttpResponse.json<GymActivity>({
      newRoutes: 5, ascents: 89, reviews: 3, visitors: 24, period: '7 дней',
    });
  }),

  http.get('/api/gyms/:gymId/setters', async () => {
    await mockDelay(300);
    const setterMap = new Map<string, SetterManagementItem>();
    for (const r of MOCK_ROUTES) {
      if (!setterMap.has(r.setterId)) {
        setterMap.set(r.setterId, {
          id: r.setterId, name: r.setterName, activeRoutes: 0, averageRating: 0,
        });
      }
    }
    return HttpResponse.json<SetterManagementItem[]>(Array.from(setterMap.values()));
  }),

  http.post('/api/gyms/:gymId/setters', async () => {
    await mockDelay(200);
    return HttpResponse.json(undefined, { status: 201 });
  }),

  http.delete('/api/gyms/:gymId/setters/:userId', async () => {
    await mockDelay(200);
    return HttpResponse.json(undefined, { status: 200 });
  }),

  http.get('/api/admin/export/:entity', async () => {
    await mockDelay(200);
    return new HttpResponse(new Blob(['id,name\n1,test'], { type: 'text/csv' }), { status: 200 });
  }),
];
