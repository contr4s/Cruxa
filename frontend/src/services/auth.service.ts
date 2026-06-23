import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';
import { mockLogin, mockRegister } from './mock/auth.mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export async function login(data: LoginRequest): Promise<AuthResponse> {
  if (USE_MOCK) return mockLogin(data);
  const { default: api } = await import('./api');
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  if (USE_MOCK) return mockRegister(data);
  const { default: api } = await import('./api');
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
}
