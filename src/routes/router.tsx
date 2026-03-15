import { createBrowserRouter } from 'react-router';

import { PERMISSIONS } from '@/features/auth';
import { queryClient } from '@/features/queryClient';
import { AdminLayout } from '@/layouts/admin/AdminLayout';
import { MainLayout } from '@/layouts/main/MainLayout';
import { RootErrorBoundary } from '@/routes/RootErrorBoundary';

import { ProtectedRoute } from './ProtectedRoute';
import { RequirePermission } from './RequirePermission';

export const router = createBrowserRouter([
  {
    path: '/403',
    lazy: async () => {
      const { default: Component } = await import('@/pages/error/Page403');
      return { Component };
    },
    errorElement: <RootErrorBoundary />,
  },
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
        path: 'products/:id',
        lazy: async () => {
          const { ShoeDetailPage: Component } =
            await import('@/pages/main/products/ShoeDetailPage');
          return { Component };
        },
      },
      {
        path: 'about',
        lazy: async () => {
          const { default: Component } =
            await import('@/pages/main/about/AboutPage');
          return { Component };
        },
      },
      {
        path: 'payment/qr/:orderId',
        lazy: async () => {
          const { default: Component } =
            await import('@/pages/main/qr/PaymentQrPage');
          return { Component };
        },
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'cart',
            lazy: async () => {
              const { default: Component } =
                await import('@/pages/main/cart/CartPage');
              return { Component };
            },
          },
          {
            path: 'wishlist',
            lazy: async () => {
              const { default: Component } =
                await import('@/pages/main/wishlist/WishlistPage');
              return { Component };
            },
          },
          {
            path: 'profile',
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
          {
            path: 'checkout',
            lazy: async () => {
              const { default: Component } =
                await import('@/pages/main/checkout/CheckoutPage');
              return { Component };
            },
          },
          {
            path: 'checkout/payment-result',
            lazy: async () => {
              const { PaymentResultPage: Component } =
                await import('@/pages/main/checkout/PaymentResultPage');
              return { Component };
            },
          },
          {
            path: 'orders',
            lazy: async () => {
              const { default: Component } =
                await import('@/pages/main/orders/OrderHistoryPage');
              return { Component };
            },
          },
          {
            path: 'orders/:orderId',
            lazy: async () => {
              const { default: Component } =
                await import('@/pages/main/orders/OrderDetailPage');
              return { Component };
            },
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
    path: '/admin',
    element: (
      <ProtectedRoute>
        <RequirePermission requirement={PERMISSIONS.dashboardView}>
          <AdminLayout />
        </RequirePermission>
      </ProtectedRoute>
    ),
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
      {
        path: 'settings',
        lazy: async () => {
          const { default: Component } =
            await import('@/pages/admin/settings/AdminSettingsPage');
          return { Component };
        },
      },
      {
        path: 'account',
        lazy: async () => {
          const { default: Component } =
            await import('@/pages/admin/account/AdminAccountPage');
          return { Component };
        },
      },
      {
        element: <RequirePermission requirement={PERMISSIONS.productsManage} />,
        children: [
          {
            path: 'products',
            lazy: async () => {
              const { default: Component } =
                await import('@/pages/admin/products/ProductsPage');
              return { Component };
            },
          },
          {
            path: 'products/:id',
            lazy: async () => {
              const { default: Component } =
                await import('@/pages/admin/products/ProductDetailPage');
              return { Component };
            },
          },
          {
            path: 'products/:id/edit',
            lazy: async () => {
              const { default: Component } =
                await import('@/pages/admin/products/EditShoePage');
              return { Component };
            },
          },
          {
            path: 'addshoe',
            lazy: async () => {
              const { default: Component } =
                await import('@/pages/admin/products/AddShoePage');
              return { Component };
            },
          },
        ],
      },
      {
        element: <RequirePermission requirement={PERMISSIONS.ordersManage} />,
        children: [
          {
            path: 'orders',
            lazy: async () => {
              const { default: Component } =
                await import('@/pages/admin/orders/OrdersPage');
              return { Component };
            },
          },
        ],
      },
      {
        element: <RequirePermission requirement={PERMISSIONS.usersManage} />,
        children: [
          {
            path: 'users',
            lazy: async () => {
              const { default: Component } =
                await import('@/pages/admin/users/UsersPage');
              return { Component };
            },
          },
        ],
      },
      {
        element: <RequirePermission requirement={PERMISSIONS.brandsManage} />,
        children: [
          {
            path: 'brands',
            lazy: async () => {
              const { default: Component } =
                await import('@/pages/admin/brands/BrandsPage');
              return { Component };
            },
          },
        ],
      },
      {
        element: (
          <RequirePermission requirement={PERMISSIONS.categoriesManage} />
        ),
        children: [
          {
            path: 'categories',
            lazy: async () => {
              const { default: Component } =
                await import('@/pages/admin/categories/CategoriesPage');
              return { Component };
            },
          },
        ],
      },
      {
        element: (
          <RequirePermission requirement={PERMISSIONS.reviewsModerate} />
        ),
        children: [
          {
            path: 'reviews',
            lazy: async () => {
              const { default: Component } =
                await import('@/pages/admin/reviews/ReviewsPage');
              return { Component };
            },
          },
        ],
      },
      {
        element: (
          <RequirePermission requirement={PERMISSIONS.notificationsManage} />
        ),
        children: [
          {
            path: 'notifications',
            lazy: async () => {
              const { default: Component } =
                await import('@/pages/admin/notifications/AdminNotificationsPage');
              return { Component };
            },
          },
        ],
      },
      {
        element: <RequirePermission requirement={PERMISSIONS.aiManage} />,
        children: [
          {
            path: 'ai',
            lazy: async () => {
              const [{ AiAdminPage: Component }, { aiParametersLoader }] =
                await Promise.all([
                  import('@/pages/admin/ai'),
                  import('@/pages/admin/ai/parameters/aiParametersLoader'),
                ]);

              return {
                Component,
                loader: aiParametersLoader(queryClient),
              };
            },
          },
        ],
      },
    ],
  },
]);
