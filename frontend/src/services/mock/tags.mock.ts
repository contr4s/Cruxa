import type { TagInfo } from '../tags.service';
import { mockDelay } from './helpers';

export async function mockGetTags(): Promise<TagInfo[]> {
  await mockDelay(200);
  return [
    { name: 'dynamic', category: 'Стиль' },
    { name: 'technical', category: 'Стиль' },
    { name: 'power', category: 'Стиль' },
    { name: 'endurance', category: 'Стиль' },
    { name: 'speed', category: 'Стиль' },
    { name: 'campus', category: 'Стиль' },
    { name: 'slab', category: 'Рельеф' },
    { name: 'overhang', category: 'Рельеф' },
    { name: 'arete', category: 'Рельеф' },
    { name: 'pocket', category: 'Рельеф' },
    { name: 'pinch', category: 'Рельеф' },
    { name: 'sloper', category: 'Рельеф' },
    { name: 'warmup', category: 'Назначение' },
    { name: 'project', category: 'Назначение' },
  ];
}
