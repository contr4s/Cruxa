import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';

export function AuthProvider({ children }: { children: ReactNode }) {
  const init = useAuthStore((state) => state.init);

  useEffect(() => {
    init();
  }, [init]);

  return <>{children}</>;
}
