import { http, HttpResponse } from 'msw';
import { mockDelay } from '../helpers';

export const tagsHandlers = [
  http.get('/api/routes/tags', async () => {
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

export const gradingSystemHandlers = [
  http.get('/api/grading-systems', async () => {
    await mockDelay(200);
    return HttpResponse.json([
      {
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Фонтенбло (Боулдеринг)',
        gradeMapping: {
          '4a': 400, '4b': 420, '4c': 440,
          '5a': 460, '5b': 480, '5c': 500,
          '6a': 520, '6a+': 540, '6b': 560,
          '6b+': 580, '6c': 600, '6c+': 620,
          '7a': 640, '7a+': 660, '7b': 680,
          '7b+': 700, '7c': 720, '7c+': 740,
          '8a': 760, '8a+': 780, '8b': 800,
        },
      },
    ]);
  }),
];
