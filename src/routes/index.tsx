import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/layouts/root-layout';
import { HomePage } from '@/features/home/pages/home-page';
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
      // Add more routes here as your app grows
      // Example:
      // {
      //   path: 'dashboard',
      //   element: <DashboardPage />,
      // },
    ],
  },
]);
