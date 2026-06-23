export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

import type { UserRole } from './user';

export interface AuthResponse {
  token: string;
  userId: string;
  username: string;
  email: string;
  role: UserRole;
}
