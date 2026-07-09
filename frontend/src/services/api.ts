import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const shouldLog = () => import.meta.env.VITE_DEBUG === 'true' || import.meta.env.DEV;

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (shouldLog()) {
    console.log('[API] ➡ %s %s', config.method?.toUpperCase(), config.url);
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (shouldLog()) {
      const duration = response.config?.headers?.['X-Start-Time']
        ? Date.now() - Number(response.config.headers['X-Start-Time'])
        : 0;
      console.log('[API] ⬅ %d %s (%dms)', response.status, response.config.url, duration);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (shouldLog()) {
      const method = originalRequest?.method?.toUpperCase() ?? '?';
      const url = originalRequest?.url ?? '?';
      if (error.response) {
        console.error('[API] ✗ %d %s %s — %s', error.response.status, method, url, error.response.data?.detail ?? error.message);
      } else {
        console.error('[API] ✗ %s %s — %s', method, url, error.message);
      }
    }

    // Network error or no response — just reject
    if (!error.response) return Promise.reject(error);

    const url = originalRequest.url ?? '';

    // Login/register 401 is expected — don't intercept
    if (url.includes('/auth/login') || url.includes('/auth/register')) {
      return Promise.reject(error);
    }

    // Only handle 401 for other endpoints
    if (error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If this IS the refresh endpoint and it 401d — redirect now
    if (url.includes('/auth/refresh')) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await api.post('/auth/refresh');
      const { token } = response.data;
      localStorage.setItem('auth_token', token);

      processQueue(null, token);

      originalRequest.headers.Authorization = `Bearer ${token}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      console.error('[Auth] Refresh failed — redirecting to /login:', refreshError);
      // Refresh failed — redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
