import type { AuthResponse, LoginRequest, RegisterRequest } from '../../types/auth';
import { mockDelay } from './helpers';

const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token-for-development';

export async function mockLogin(data: LoginRequest): Promise<AuthResponse> {
  await mockDelay(400);

  if (!data.email || !data.password) {
    throw new Error('Email и пароль обязательны');
  }

  if (data.password.length < 6) {
    throw new Error('Неверный email или пароль');
  }

  const roleMap: Record<string, { role: 'Climber' | 'Routesetter' | 'GymAdmin' | 'Admin'; userId: string; username: string; displayName: string }> = {
    'routesetter@cruxa.ru': { role: 'Routesetter', userId: 's1', username: 'setter', displayName: 'Сеттер Петров' },
    'gymadmin@cruxa.ru': { role: 'GymAdmin', userId: 'g1', username: 'gymadmin', displayName: 'Админ Залова' },
    'admin@cruxa.ru': { role: 'Admin', userId: 'a1', username: 'superadmin', displayName: 'Супер Админ' },
  };

  const user = roleMap[data.email.toLowerCase()] ?? { role: 'Climber', userId: '550e8400-e29b-41d4-a716-446655440001', username: 'alexey', displayName: 'Алексей Кузнецов' };

  return {
    token: MOCK_TOKEN,
    userId: user.userId,
    username: user.username,
    displayName: user.displayName,
    email: data.email,
    role: user.role,
  };
}

export async function mockRegister(data: RegisterRequest): Promise<AuthResponse> {
  await mockDelay(500);

  if (!data.email || !data.username || !data.password) {
    throw new Error('Все поля обязательны');
  }

  if (data.password.length < 6) {
    throw new Error('Пароль должен быть не менее 6 символов');
  }

  const roleMap: Record<string, { role: 'Climber' | 'Routesetter' | 'GymAdmin' | 'Admin'; userId: string; displayName: string }> = {
    'routesetter@cruxa.ru': { role: 'Routesetter', userId: 's1', displayName: 'Сеттер Петров' },
    'gymadmin@cruxa.ru': { role: 'GymAdmin', userId: 'g1', displayName: 'Админ Залова' },
    'admin@cruxa.ru': { role: 'Admin', userId: 'a1', displayName: 'Супер Админ' },
  };

  const user = roleMap[data.email.toLowerCase()] ?? { role: 'Climber', userId: '550e8400-e29b-41d4-a716-446655440001', displayName: 'Алексей Кузнецов' };

  return {
    token: MOCK_TOKEN,
    userId: user.userId,
    username: data.username,
    displayName: user.displayName,
    email: data.email,
    role: user.role,
  };
}
