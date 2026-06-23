import type { UserDto, UserStats, KruskorPoint, RadarSkillsResponse, GradePyramidItem, AscentTypeDistribution, TopRoutesResponse, MonthlyActivity } from '../types/user';
import {
  mockGetUserProfile, mockGetUserStats, mockGetKruskorHistory,
  mockGetRadarSkills, mockGetGradePyramid, mockGetAscentDistribution,
  mockGetTopRoutes, mockGetMonthlyActivity
} from './mock/climber.mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export async function getUserProfile(userId: string): Promise<UserDto> {
  if (USE_MOCK) return mockGetUserProfile();
  const { default: api } = await import('./api');
  const response = await api.get<UserDto>(`/users/${userId}`);
  return response.data;
}

export async function getUserStats(userId: string): Promise<UserStats> {
  if (USE_MOCK) return mockGetUserStats();
  const { default: api } = await import('./api');
  const response = await api.get<UserStats>(`/users/${userId}/stats`);
  return response.data;
}

export async function updateUserProfile(userId: string, data: Partial<UserDto>): Promise<UserDto> {
  if (USE_MOCK) return mockGetUserProfile();
  const { default: api } = await import('./api');
  const response = await api.put<UserDto>(`/users/${userId}`, data);
  return response.data;
}

export async function getKruskorHistory(userId: string, period: string): Promise<KruskorPoint[]> {
  if (USE_MOCK) return mockGetKruskorHistory(period);
  const { default: api } = await import('./api');
  const response = await api.get<KruskorPoint[]>(`/users/${userId}/kruskor-history`, { params: { period } });
  return response.data;
}

export async function getRadarSkills(userId: string): Promise<RadarSkillsResponse> {
  if (USE_MOCK) return mockGetRadarSkills();
  const { default: api } = await import('./api');
  const response = await api.get<RadarSkillsResponse>(`/users/${userId}/radar-skills`);
  return response.data;
}

export async function getGradePyramid(userId: string): Promise<GradePyramidItem[]> {
  if (USE_MOCK) return mockGetGradePyramid();
  const { default: api } = await import('./api');
  const response = await api.get<GradePyramidItem[]>(`/users/${userId}/grade-pyramid`);
  return response.data;
}

export async function getAscentDistribution(userId: string): Promise<AscentTypeDistribution[]> {
  if (USE_MOCK) return mockGetAscentDistribution();
  const { default: api } = await import('./api');
  const response = await api.get<AscentTypeDistribution[]>(`/users/${userId}/ascent-distribution`);
  return response.data;
}

export async function getTopRoutes(userId: string): Promise<TopRoutesResponse> {
  if (USE_MOCK) return mockGetTopRoutes();
  const { default: api } = await import('./api');
  const response = await api.get<TopRoutesResponse>(`/users/${userId}/top-routes`);
  return response.data;
}

export async function getMonthlyActivity(userId: string): Promise<MonthlyActivity> {
  if (USE_MOCK) return mockGetMonthlyActivity();
  const { default: api } = await import('./api');
  const response = await api.get<MonthlyActivity>(`/users/${userId}/monthly-activity`);
  return response.data;
}
