import type { UserGoalDto } from '../types/user';
import { mockGetGoals } from './mock/goals.mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export async function getUserGoals(): Promise<UserGoalDto[]> {
  if (USE_MOCK) return mockGetGoals();
  const { default: api } = await import('./api');
  const response = await api.get<UserGoalDto[]>('/users/me/goals');
  return response.data;
}
