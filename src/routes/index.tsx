import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/layouts/root-layout';
import { AuthLayout } from '@/layouts/auth-layout';
import { HomePage } from '@/features/home/pages/home-page';
import { LoginPage } from '@/features/auth/pages/login-page';
import { NotFoundPage } from '@/features/errors/pages/not-found-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },
]);
