import api from './api';
import type { UserGoalDto } from '../types/user';

export async function getUserGoals(): Promise<UserGoalDto[]> {
  const response = await api.get<UserGoalDto[]>('/users/me/goals');
  return response.data;
}
