import { http, HttpResponse } from 'msw';
import { mockDelay } from '../helpers';

export const tagsHandlers = [
  http.get('/api/tags', async () => {
    await mockDelay(200);
    return HttpResponse.json([
      { name: 'overhang', category: 'style' },
      { name: 'slab', category: 'style' },
      { name: 'technical', category: 'style' },
      { name: 'power', category: 'style' },
      { name: 'endurance', category: 'style' },
      { name: 'dynamic', category: 'style' },
      { name: 'crimp', category: 'hold' },
      { name: 'sloper', category: 'hold' },
      { name: 'jug', category: 'hold' },
      { name: 'pinch', category: 'hold' },
      { name: 'pocket', category: 'hold' },
      { name: 'lead', category: 'type' },
      { name: 'boulder', category: 'type' },
      { name: 'toprope', category: 'type' },
      { name: 'speed', category: 'type' },
    ]);
  }),
];

export const managedGymHandlers = [
  http.get('/api/users/me/managed-gym', async () => {
    await mockDelay(200);
    return HttpResponse.json({ gymId: 'g1' });
  }),
];

export const mediaHandlers = [
  http.post('/api/media/upload', async () => {
    await mockDelay(300);
    const id = Date.now();
    return HttpResponse.json({ url: `/mock/uploads/${id}.jpg` });
  }),
];
