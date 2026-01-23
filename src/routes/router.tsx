import { createBrowserRouter } from 'react-router';
import { MainLayout } from '@/layouts/main/MainLayout';
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
          const { default: Component } = await import('@/pages/home/HomePage');
          return { Component };
        },
      },
      {
        path: 'products',
        lazy: async () => {
          const { default: Component } =
            await import('@/pages/products/ProductsPage');
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
                  import('@/pages/profile/ProfilePage'),
                  import('@/pages/profile/profileLoader'),
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
]);
