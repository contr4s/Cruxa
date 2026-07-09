import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getUserProfile, getUserStats, getKruskorHistory, getRadarSkills, getGradePyramid, getAscentDistribution, getTopRoutes, getMonthlyActivity, getUserByUsername, followUser, unfollowUser, isFollowing, updateUserProfile, changePassword } from '../users.service';
import type { UserDto, UserStats, KruskorPoint, RadarSkillsResponse, GradePyramidItem, AscentTypeDistribution, TopRoutesResponse, MonthlyActivity } from '../../types/user';
import { useAuthStore } from '../../stores/authStore';

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

export function useMonthlyActivity(userId: string, year?: number, month?: number) {
  return useQuery<MonthlyActivity>({
    queryKey: ['user', userId, 'monthly-activity', year, month],
    queryFn: () => getMonthlyActivity(userId, year, month),
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

// ── Follow / public profile ─────────────────────────────

export function useUserByUsername(username: string | undefined) {
  return useQuery<UserDto>({
    queryKey: ['user', 'username', username],
    queryFn: () => getUserByUsername(username ?? ''),
    enabled: !!username,
  });
}

export function useIsFollowing(userId: string | undefined) {
  const currentUserId = useAuthStore((s) => s.userId);
  return useQuery<boolean>({
    queryKey: ['user', userId, 'is-following'],
    queryFn: () => isFollowing(userId ?? ''),
    enabled: !!userId && !!currentUserId && userId !== currentUserId,
  });
}

function invalidateUser(queryClient: ReturnType<typeof useQueryClient>, userId: string) {
  queryClient.invalidateQueries({ queryKey: ['user', userId, 'stats'] });
  queryClient.invalidateQueries({ queryKey: ['user', userId, 'is-following'] });
  queryClient.invalidateQueries({ queryKey: ['user', userId, 'profile'] });
  queryClient.invalidateQueries({ queryKey: ['feedSuggestions'] });
  queryClient.invalidateQueries({ queryKey: ['feed'] });
}

export function useFollowUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => followUser(userId),
    onSuccess: (_, userId) => invalidateUser(queryClient, userId),
  });
}

export function useUnfollowUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => unfollowUser(userId),
    onSuccess: (_, userId) => invalidateUser(queryClient, userId),
  });
}

// ── Profile update / password ────────────────────────────

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);
  const setDisplayName = useAuthStore((s) => s.setDisplayName);
  return useMutation({
    mutationFn: (data: Partial<UserDto>) => updateUserProfile(userId ?? '', data),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId, 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['user', userId, 'stats'] });
      const newDisplayName = updatedUser.firstName
        ? updatedUser.lastName
          ? `${updatedUser.firstName} ${updatedUser.lastName}`
          : updatedUser.firstName
        : updatedUser.username;
      if (setDisplayName) setDisplayName(newDisplayName);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      changePassword(currentPassword, newPassword),
  });
}
