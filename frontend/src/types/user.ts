export type UserRole = 'Climber' | 'Routesetter' | 'GymAdmin' | 'Admin';

export interface UserDto {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  city?: string;
  gender?: string;
  height?: number;
  role: UserRole;
  createdAt: string;
}

export interface UserStats {
  kruscore: number;
  totalWorkouts: number;
  followersCount: number;
  followingCount: number;
}

export interface KruskorPoint {
  date: string;
  score: number;
  maxGrade: string;
}

export interface GradePyramidItem {
  grade: string;
  count: number;
}

export interface AscentTypeDistribution {
  type: string;
  count: number;
}

export interface TopRouteItem {
  id: string;
  name: string;
  grade: string;
  holdColor: string;
  ascentType: string;
  gymName: string;
  gymId: string;
  rating: number;
  date: string;
}

export interface TopRoutesResponse {
  routes: TopRouteItem[];
  totalRoutes: number;
  avgGrade: string;
  maxGrade: string;
}

export interface MonthlyActivity {
  year: number;
  month: number;
  days: ActivityDay[];
  totalWorkouts: number;
  totalRoutes: number;
  streak: number;
}

export interface ActivityDay {
  day: number;
  intensity: number; // 0–1
  hasWorkout: boolean;
  routeCount: number;
}

export interface RadarSkill {
  name: string;
  value: number; // 0–100
}

/**
 * Навыки, сгруппированные по категориям.
 * Ключи — идентификаторы категорий (style, relief, hold, type и т.д.).
 */
export interface RadarSkillsResponse {
  categories: Record<string, RadarSkill[]>;
}

export interface UserGoalDto {
  id: string;
  type: 'grade' | 'routes' | 'gyms';
  label: string;
  current: number;
  target: number;
  unit: string;
}
