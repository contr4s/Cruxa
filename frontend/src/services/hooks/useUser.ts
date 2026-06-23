import { useQuery } from '@tanstack/react-query';
import { getUserProfile, getUserStats, getKruskorHistory, getRadarSkills, getGradePyramid, getAscentDistribution, getTopRoutes, getMonthlyActivity } from '../users.service';
import type { UserDto, UserStats, KruskorPoint, RadarSkillsResponse, GradePyramidItem, AscentTypeDistribution, TopRoutesResponse, MonthlyActivity } from '../../types/user';

export function useUserProfile(userId: string) {
  return useQuery<UserDto>({
    queryKey: ['user', userId, 'profile'],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
  });
}

export function useUserStats(userId: string) {
  return useQuery<UserStats>({
    queryKey: ['user', userId, 'stats'],
    queryFn: () => getUserStats(userId),
    enabled: !!userId,
  });
}

export function useKruskorHistory(userId: string, period: string) {
  return useQuery<KruskorPoint[]>({
    queryKey: ['user', userId, 'kruskor-history', period],
    queryFn: () => getKruskorHistory(userId, period),
    enabled: !!userId,
  });
}

export function useRadarSkills(userId: string, enabled?: boolean) {
  return useQuery<RadarSkillsResponse>({
    queryKey: ['user', userId, 'radar-skills'],
    queryFn: () => getRadarSkills(userId),
    enabled: !!userId && enabled !== false,
  });
}

export function useGradePyramid(userId: string, enabled?: boolean) {
  return useQuery<GradePyramidItem[]>({
    queryKey: ['user', userId, 'grade-pyramid'],
    queryFn: () => getGradePyramid(userId),
    enabled: !!userId && enabled !== false,
  });
}

export function useTopRoutes(userId: string, enabled?: boolean) {
  return useQuery<TopRoutesResponse>({
    queryKey: ['user', userId, 'top-routes'],
    queryFn: () => getTopRoutes(userId),
    enabled: !!userId && enabled !== false,
  });
}

export function useMonthlyActivity(userId: string) {
  return useQuery<MonthlyActivity>({
    queryKey: ['user', userId, 'monthly-activity'],
    queryFn: () => getMonthlyActivity(userId),
    enabled: !!userId,
  });
}

export function useAscentDistribution(userId: string, enabled?: boolean) {
  return useQuery<AscentTypeDistribution[]>({
    queryKey: ['user', userId, 'ascent-distribution'],
    queryFn: () => getAscentDistribution(userId),
    enabled: !!userId && enabled !== false,
  });
}
