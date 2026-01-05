import { Navigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/auth-store';
import type { UserRole } from '@/types/domain';

interface RequireRoleProps {
  children: React.ReactNode;
  roles: UserRole[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Wrapper component that requires specific role(s)
 * Can redirect or show fallback content if role doesn't match
 */
export function RequireRole({
  children,
  roles,
  fallback,
  redirectTo,
}: RequireRoleProps) {
  const user = useAuthStore((s) => s.user);

  // Check if user has any of the required roles
  const hasRequiredRole = user && roles.includes(user.role);

  if (!hasRequiredRole) {
    // Redirect if specified
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    // Show fallback if specified
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default: show nothing
    return null;
  }

  return <>{children}</>;
}

/**
 * Component that only renders for admin users
 */
export function AdminOnly({ children }: { children: React.ReactNode }) {
  return <RequireRole roles={['admin']}>{children}</RequireRole>;
}

/**
 * Component that only renders for managers and admins
 */
export function ManagerOnly({ children }: { children: React.ReactNode }) {
  return <RequireRole roles={['admin', 'manager']}>{children}</RequireRole>;
}

/**
 * Component that only renders for supervisors and above
 */
export function SupervisorOnly({ children }: { children: React.ReactNode }) {
  return <RequireRole roles={['admin', 'manager', 'supervisor']}>{children}</RequireRole>;
}

/**
 * Component that only renders for workers (tablet users)
 */
export function WorkerOnly({ children }: { children: React.ReactNode }) {
  return <RequireRole roles={['worker']}>{children}</RequireRole>;
}
