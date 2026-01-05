import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from '@/layouts/auth-layout';
import { TabletLayout } from '@/layouts/tablet-layout';
import { DashboardLayout } from '@/layouts/dashboard-layout';
import { RequireAuth, RequireRole, RootRedirect } from '@/features/auth/components';
import { RouteErrorBoundary } from '@/components/error';
import { LoginPage } from '@/features/auth/pages/login-page';
import { TabletProductionPage } from '@/features/production/pages/tablet-production-page';
import { ProductionOverviewPage } from '@/features/production/pages/production-overview-page';
import { DashboardPage } from '@/features/dashboard/pages/dashboard-page';
import { OrdersPage } from '@/features/orders/pages/orders-page';
import { UsersPage } from '@/features/users/pages/users-page';
import { SettingsPage } from '@/features/settings/pages/settings-page';

export const router = createBrowserRouter([
  // Root - redirect based on auth status
  {
    path: '/',
    element: <RootRedirect />,
    errorElement: <RouteErrorBoundary />,
  },

  // Auth routes
  {
    element: <AuthLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },

  // Tablet routes (for production workers only)
  {
    path: '/tablet',
    element: (
      <RequireAuth>
        <RequireRole roles={['worker']} redirectTo="/dashboard">
          <TabletLayout />
        </RequireRole>
      </RequireAuth>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <TabletProductionPage />,
      },
    ],
  },

  // Dashboard routes (for managers/admins/supervisors - NOT workers)
  {
    path: '/dashboard',
    element: (
      <RequireAuth>
        <RequireRole roles={['admin', 'manager', 'supervisor']} redirectTo="/tablet">
          <DashboardLayout />
        </RequireRole>
      </RequireAuth>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'production',
        element: <ProductionOverviewPage />,
      },
      {
        path: 'orders',
        element: <OrdersPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },

  // Catch-all 404 route
  {
    path: '*',
    element: <RouteErrorBoundary />,
  },
]);
