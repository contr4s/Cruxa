export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  height?: number;
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
  displayName: string;
  email: string;
  role: UserRole;
}
