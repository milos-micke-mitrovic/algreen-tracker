import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
      <Toaster position="top-right" />
    </div>
  );
}
