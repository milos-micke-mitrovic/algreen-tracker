import { Navigate, useLocation } from 'react-router-dom';

import { useAuthStore } from '@/stores/auth-store';
import { Spinner } from '@/components/ui/spinner';

interface RequireAuthProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Wrapper component that requires authentication
 * Redirects to login if not authenticated
 */
export function RequireAuth({ children, redirectTo = '/login' }: RequireAuthProps) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted location for redirect after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
