import { delay } from 'msw';

export const MOCK_DELAY = 300;

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateId(): string {
  return crypto.randomUUID();
}

export async function mockDelay(ms = MOCK_DELAY): Promise<void> {
  await delay(ms);
}
