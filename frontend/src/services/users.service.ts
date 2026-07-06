import api from './api';
import type { UserDto, UserStats, KruskorPoint, RadarSkillsResponse, GradePyramidItem, AscentTypeDistribution, TopRoutesResponse, MonthlyActivity } from '../types/user';

// ponytail: these functions delegate to real API. When MSW is off, ensure backend
// implements all endpoints. Add `username` to PostDto if missing.
export async function getUserProfile(userId: string): Promise<UserDto> {
  const response = await api.get<UserDto>(`/users/${userId}`);
  return response.data;
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const response = await api.get<UserStats>(`/users/${userId}/stats`);
  return response.data;
}

export async function updateUserProfile(userId: string, data: Partial<UserDto>): Promise<UserDto> {
  const response = await api.put<UserDto>(`/users/${userId}`, data);
  return response.data;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await api.put('/auth/password', { currentPassword, newPassword });
}

export async function getKruskorHistory(userId: string, period: string): Promise<KruskorPoint[]> {
  const response = await api.get<KruskorPoint[]>(`/users/${userId}/kruskor-history`, { params: { period } });
  return response.data;
}

export async function getRadarSkills(userId: string): Promise<RadarSkillsResponse> {
  const response = await api.get<RadarSkillsResponse>(`/users/${userId}/radar-skills`);
  return response.data;
}

export async function getGradePyramid(userId: string): Promise<GradePyramidItem[]> {
  const response = await api.get<GradePyramidItem[]>(`/users/${userId}/grade-pyramid`);
  return response.data;
}

export async function getAscentDistribution(userId: string): Promise<AscentTypeDistribution[]> {
  const response = await api.get<AscentTypeDistribution[]>(`/users/${userId}/ascent-distribution`);
  return response.data;
}

export async function getTopRoutes(userId: string): Promise<TopRoutesResponse> {
  const response = await api.get<TopRoutesResponse>(`/users/${userId}/top-routes`);
  return response.data;
}

export async function getMonthlyActivity(userId: string): Promise<MonthlyActivity> {
  const response = await api.get<MonthlyActivity>(`/users/${userId}/monthly-activity`);
  return response.data;
}

export async function getUserByUsername(username: string): Promise<UserDto> {
  const response = await api.get<UserDto>(`/users/username/${username}`);
  return response.data;
}

export async function followUser(userId: string): Promise<void> {
  await api.post(`/users/${userId}/follow`);
}

export async function unfollowUser(userId: string): Promise<void> {
  await api.delete(`/users/${userId}/follow`);
}

export async function isFollowing(userId: string): Promise<boolean> {
  const response = await api.get<boolean>(`/users/${userId}/is-following`);
  return response.data;
}
