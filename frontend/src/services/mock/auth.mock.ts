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

  return {
    token: MOCK_TOKEN,
    userId: '550e8400-e29b-41d4-a716-446655440001',
    username: 'alexey',
    email: data.email,
    role: 'Climber',
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

  return {
    token: MOCK_TOKEN,
    userId: '550e8400-e29b-41d4-a716-446655440001',
    username: data.username,
    email: data.email,
    role: 'Climber',
  };
}
