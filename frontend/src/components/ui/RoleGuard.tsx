import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import type { UserRole } from '../../types/user';

interface RoleGuardProps {
  role: UserRole;
  children: ReactNode;
}

/**
 * Защита роутов по роли.
 * SuperAdmin (Admin) проходит любую роль.
 */
export function RoleGuard({ role, children }: RoleGuardProps) {
  const userRole = useAuthStore((s) => s.role);

  if (userRole !== role && userRole !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
