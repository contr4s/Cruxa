import { create } from 'zustand';
import type { AuthResponse } from '../types/auth';
import * as authService from '../services/auth.service';

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
  setDisplayName: (name: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userId: null,
  username: null,
  displayName: null,
  role: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  init: () => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as AuthResponse;
        set({
          token,
          userId: user.userId,
          username: user.username,
          displayName: user.displayName,
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
        userId: response.userId,
        username: response.username,
        displayName: response.displayName,
        role: response.role,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Ошибка входа' });
      throw err;
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
        userId: response.userId,
        username: response.username,
        displayName: response.displayName,
        role: response.role,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Ошибка регистрации' });
      throw err;
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
}));
