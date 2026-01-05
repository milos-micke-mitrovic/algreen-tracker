import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/auth-store';
import { Spinner } from '@/components/ui/spinner';

/**
 * Redirects from root based on auth status and role
 */
export function RootRedirect() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && user) {
      // Redirect based on role
      if (user.role === 'worker') {
        navigate('/tablet', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else {
      // Not logged in - go to login
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  // Show loading while checking auth and redirecting
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
