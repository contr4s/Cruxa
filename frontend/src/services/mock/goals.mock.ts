import type { UserGoalDto } from '../../types/user';
import { mockDelay } from './helpers';

export async function mockGetGoals(): Promise<UserGoalDto[]> {
  await mockDelay(250);
  return [
    { id: 'gl1', type: 'grade', label: 'Целевой грейд', current: 534, target: 580, unit: 'Крускор' },
    { id: 'gl2', type: 'routes', label: 'Всего трасс', current: 47, target: 100, unit: 'шт' },
    { id: 'gl3', type: 'gyms', label: 'Всего залов', current: 12, target: 20, unit: 'шт' },
  ];
}
