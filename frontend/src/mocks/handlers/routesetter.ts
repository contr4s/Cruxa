import { http, HttpResponse } from 'msw';
import type { RoutesetterStats, RouteReviewSummary, LinkedGymSummary } from '../../types/routesetter';
import type { RouteDto } from '../../types/route';
import type { PaginatedList } from '../../types/common';
import { mockDelay } from '../helpers';
import { MOCK_GYMS } from './gyms';
import { MOCK_ROUTES } from './routes';

export const routesetterHandlers = [
  http.get('/api/routesetters/me/stats', async () => {
    await mockDelay(300);
    return HttpResponse.json<RoutesetterStats>({
      activeRoutes: MOCK_ROUTES.filter((r) => r.status === 'Active').length,
      averageRating: 4.3,
      totalAscents: MOCK_ROUTES.reduce((s, r) => s + r.ascentsCount, 0),
    });
  }),

  http.get('/api/routesetters/me/routes', async ({ request }) => {
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

  http.get('/api/routesetters/me/reviews', async () => {
    await mockDelay(300);
    return HttpResponse.json<RouteReviewSummary[]>([
      { id: 'rev1', routeId: 'r1', routeName: 'Красная стрела', routeGrade: '6A', userId: 'u2', username: 'ekaterina-smirnova', displayName: 'Екатерина Смирнова', rating: 4, comment: 'Отлично!', createdAt: '2026-06-20T18:30:00Z' },
      { id: 'rev2', routeId: 'r2', routeName: 'Синий мув', routeGrade: '6B+', userId: 'u3', username: 'dmitry-volkov', displayName: 'Дмитрий Волков', rating: 5, comment: 'Топ!', createdAt: '2026-06-19T20:00:00Z' },
    ]);
  }),

  http.get('/api/routesetters/me/gyms', async () => {
    await mockDelay(300);
    return HttpResponse.json<LinkedGymSummary[]>(
      MOCK_GYMS.filter((g) => MOCK_ROUTES.some((r) => r.gymId === g.id)).map((g) => ({
        id: g.id, name: g.name, city: g.city, address: g.address,
        activeRouteCount: g.activeRouteCount, rating: g.rating,
      })),
    );
  }),

  http.patch('/api/routes/:routeId/deactivate', async () => {
    await mockDelay(200);
    return HttpResponse.json(undefined, { status: 200 });
  }),

  http.patch('/api/routes/:routeId/reactivate', async () => {
    await mockDelay(200);
    return HttpResponse.json(undefined, { status: 200 });
  }),
];
