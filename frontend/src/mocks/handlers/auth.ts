import { http, HttpResponse } from 'msw';
import type { AuthResponse } from '../../types/auth';
import { mockDelay } from '../helpers';

const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token-for-development';

const roleMap: Record<string, { role: AuthResponse['role']; userId: string; username: string; displayName: string }> = {
  'routesetter@cruxa.ru': { role: 'Routesetter', userId: 's1', username: 'setter', displayName: 'Сеттер Петров' },
  'gymadmin@cruxa.ru': { role: 'GymAdmin', userId: 'g1', username: 'gymadmin', displayName: 'Админ Залова' },
  'admin@cruxa.ru': { role: 'Admin', userId: 'a1', username: 'superadmin', displayName: 'Супер Админ' },
};

const defaultUser = { role: 'Climber' as const, userId: '550e8400-e29b-41d4-a716-446655440001', username: 'alexey', displayName: 'Алексей Кузнецов' };

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    await mockDelay(400);
    const data = (await request.json()) as { email?: string; password?: string };
    if (!data.email || !data.password) {
      return HttpResponse.json({ title: 'Email и пароль обязательны' }, { status: 400 });
    }
    if (data.password.length < 6) {
      return HttpResponse.json({ title: 'Неверный email или пароль' }, { status: 401 });
    }
    const user = roleMap[data.email.toLowerCase()] ?? defaultUser;
    return HttpResponse.json<AuthResponse>({
      token: MOCK_TOKEN,
      userId: user.userId,
      username: user.username,
      displayName: user.displayName,
      email: data.email,
      role: user.role,
    });
  }),

  http.post('/api/auth/register', async ({ request }) => {
    await mockDelay(500);
    const data = (await request.json()) as { email?: string; username?: string; password?: string; firstName?: string; lastName?: string };
    if (!data.email || !data.username || !data.password) {
      return HttpResponse.json({ title: 'Все поля обязательны' }, { status: 400 });
    }
    if (data.password.length < 6) {
      return HttpResponse.json({ title: 'Пароль должен быть не менее 6 символов' }, { status: 400 });
    }
    const user = roleMap[data.email.toLowerCase()] ?? defaultUser;
    return HttpResponse.json<AuthResponse>({
      token: MOCK_TOKEN,
      userId: user.userId,
      username: data.username,
      displayName: user.displayName,
      email: data.email,
      role: user.role,
    });
  }),
];
