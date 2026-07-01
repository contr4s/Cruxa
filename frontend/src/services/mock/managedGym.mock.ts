import type { ManagedGymResponse } from '../managedGym.service';
import { mockDelay } from './helpers';

export async function mockGetManagedGym(): Promise<ManagedGymResponse> {
  await mockDelay(200);
  return { gymId: 'g1' };
}
