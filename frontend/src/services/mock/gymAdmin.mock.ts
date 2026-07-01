import type { GymAdminStats, GymActivity, SetterManagementItem } from '../../types/gymAdmin';
import type { RouteDto } from '../../types/route';
import type { PaginatedList } from '../../types/common';
import { mockDelay } from './helpers';
import { MOCK_ROUTES } from './routes.mock';
import { MOCK_GYMS } from './gyms.mock';
import type { GetAdminRoutesParams } from '../gymAdmin.service';

export async function mockGetGymAdminStats(gymId: string): Promise<GymAdminStats> {
  await mockDelay(300);
  const gymRoutes = MOCK_ROUTES.filter((r) => r.gymId === gymId);
  const activeRoutes = gymRoutes.filter((r) => r.status === 'Active');
  const totalAscents = gymRoutes.reduce((sum, r) => sum + r.ascentsCount, 0);
  const avgRating = gymRoutes.length ? gymRoutes.reduce((sum, r) => sum + r.rating, 0) / gymRoutes.length : 0;
  return {
    totalRoutes: gymRoutes.length,
    activeRoutes: activeRoutes.length,
    averageRating: parseFloat(avgRating.toFixed(1)),
    totalAscents,
  };
}

export async function mockGetAdminRoutes(gymId: string, params?: GetAdminRoutesParams): Promise<PaginatedList<RouteDto>> {
  await mockDelay(400);

  let items = MOCK_ROUTES.filter((r) => r.gymId === gymId);

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
  if (params?.sector && params.sector !== 'all') {
    items = items.filter((r) => r.sector === params.sector);
  }
  if (params?.setterId && params.setterId !== 'all') {
    items = items.filter((r) => r.setterId === params.setterId);
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

export async function mockGetGymActivity(gymId: string): Promise<GymActivity> {
  await mockDelay(250);
  return {
    newRoutes: 12,
    ascents: 456,
    reviews: 89,
    visitors: 312,
    period: 'за неделю',
  };
}

export async function mockGetGymSetters(gymId: string): Promise<SetterManagementItem[]> {
  await mockDelay(300);
  const setterMap = new Map<string, SetterManagementItem>();
  MOCK_ROUTES.filter((r) => r.gymId === gymId).forEach((r) => {
    const existing = setterMap.get(r.setterId);
    if (existing) {
      existing.activeRoutes += r.status === 'Active' ? 1 : 0;
      existing.averageRating = parseFloat(((existing.averageRating * (existing.activeRoutes - 1) + r.rating) / existing.activeRoutes).toFixed(1));
    } else {
      setterMap.set(r.setterId, {
        id: r.setterId,
        name: r.setterName,
        avatarUrl: r.setterAvatarUrl,
        activeRoutes: r.status === 'Active' ? 1 : 0,
        averageRating: r.rating,
      });
    }
  });
  return Array.from(setterMap.values());
}

export async function mockLinkSetter(_gymId: string, _userId: string): Promise<void> {
  await mockDelay(200);
}

export async function mockUnlinkSetter(_gymId: string, _userId: string): Promise<void> {
  await mockDelay(200);
}

export async function mockExportGymData(_gymId: string, entity: 'routes' | 'ascents' | 'reviews'): Promise<Blob> {
  await mockDelay(400);
  const csv = `id,name,grade\nr1,Test,6A\n`;
  return new Blob([csv], { type: 'text/csv' });
}
