import { create } from 'zustand';
import type { AuthResponse } from '../types/auth';
import * as authService from '../services/auth.service';
import api from '../services/api';

interface AuthState {
  token: string | null;
  userId: string | null;
  username: string | null;
  displayName: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, extra?: { firstName?: string; lastName?: string; gender?: string; height?: number }) => Promise<void>;
  logout: () => void;
  init: () => void;
  refreshAuth: () => Promise<void>;
  setDisplayName: (name: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Restore auth state from localStorage synchronously on store creation
  const storedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const storedUser = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_user') : null;
  let initial: Partial<AuthState> = {};

  if (storedToken && storedUser) {
    try {
      const data = JSON.parse(storedUser);
      const user = data.user ?? data;
      initial = {
        token: storedToken,
        userId: user.id ?? user.userId,
        username: user.username,
        displayName: user.displayName ?? user.username,
        role: user.role,
        isAuthenticated: true,
      };
    } catch {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  }

  return {
    token: initial.token ?? null,
    userId: initial.userId ?? null,
    username: initial.username ?? null,
    displayName: initial.displayName ?? null,
    role: initial.role ?? null,
    isAuthenticated: initial.isAuthenticated ?? false,
  isLoading: false,
  error: null,

  init: () => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');
    if (token && userStr) {
      try {
        const data = JSON.parse(userStr);
        const user = data.user ?? data;
        set({
          token,
          userId: user.id ?? user.userId,
          username: user.username,
          displayName: user.displayName ?? user.username,
          role: user.role,
          isAuthenticated: true,
        });
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response));
      set({
        token: response.token,
        userId: response.user.id,
        username: response.user.username,
        displayName: response.user.displayName ?? response.user.username,
        role: response.user.role,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Ошибка входа' });
    }
  },

  register: async (email: string, username: string, password: string, extra?: { firstName?: string; lastName?: string; gender?: string; height?: number }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register({ email, username, password, ...extra });
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response));
      set({
        token: response.token,
        userId: response.user.id,
        username: response.user.username,
        displayName: response.user.displayName ?? response.user.username,
        role: response.user.role,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Ошибка регистрации' });
    }
  },

  refreshAuth: async () => {
    // Refresh token is stored in httpOnly cookie — just call the endpoint
    try {
      const response = await api.post<AuthResponse>('/auth/refresh');
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('auth_user', JSON.stringify(response.data));
      const user = response.data.user;
      set({
        token: response.data.token,
        userId: user.id,
        username: user.username,
        displayName: user.displayName ?? user.username,
        role: user.role,
        isAuthenticated: true,
      });
    } catch {
      get().logout();
      window.location.pathname = '/login';
    }
  },

  setDisplayName: (name: string) => {
    set({ displayName: name });
    const userStr = localStorage.getItem('auth_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        user.displayName = name;
        localStorage.setItem('auth_user', JSON.stringify(user));
      } catch { /* ignore */ }
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({
      token: null,
      userId: null,
      username: null,
      displayName: null,
      role: null,
      isAuthenticated: false,
    });
  },
};
});
