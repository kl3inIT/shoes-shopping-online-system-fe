import { createBrowserRouter } from 'react-router';
import { MainLayout } from '@/layouts/main/MainLayout';
import { DashboardLayout } from '@/layouts/admin/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { RootErrorBoundary } from '@/routes/RootErrorBoundary';
import { queryClient } from '@/features/queryClient';

export const router = createBrowserRouter([
  {
    path: '/auth/callback',
    lazy: async () => {
      const { default: Component } = await import('@/pages/auth/AuthCallBack');
      return { Component };
    },
    errorElement: <RootErrorBoundary />,
  },
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: Component } =
            await import('@/pages/main/home/HomePage');
          return { Component };
        },
      },
      {
        path: 'products',
        lazy: async () => {
          const { default: Component } =
            await import('@/pages/main/products/ProductsPage');
          return { Component };
        },
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'profile/:keycloakId',
            lazy: async () => {
              const [{ default: Component }, { profileLoader }] =
                await Promise.all([
                  import('@/pages/main/profile/ProfilePage'),
                  import('@/pages/main/profile/profileLoader'),
                ]);
              return {
                Component,
                loader: profileLoader(queryClient),
              };
            },
            errorElement: <RootErrorBoundary />,
          },
        ],
      },
      {
        path: '*',
        lazy: async () => {
          const { default: Component } = await import('@/pages/error/Page404');
          return { Component };
        },
      },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: Component } =
            await import('@/pages/admin/dashboard/Dashboard');
          return { Component };
        },
      },
    ],
  },
]);
