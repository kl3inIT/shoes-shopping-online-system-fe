import { createBrowserRouter } from 'react-router';
import { MainLayout } from '@/layouts/main/MainLayout';
import { AdminLayout } from '@/layouts/admin/AdminLayout';
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
    element: <AdminLayout />,
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
      {
        path: 'orders',
        lazy: async () => {
          const { default: Component } =
            await import('@/pages/admin/orders/OrdersPage');
          return { Component };
        },
      },
      {
        path: 'users',
        lazy: async () => {
          const { default: Component } =
            await import('@/pages/admin/users/UsersPage');
          return { Component };
        },
      },
      {
        path: 'customers',
        lazy: async () => {
          const { default: Component } =
            await import('@/pages/admin/customers/CustomersPage');
          return { Component };
        },
      },
      {
        path: 'brands',
        lazy: async () => {
          const { default: Component } =
            await import('@/pages/admin/brands/BrandsPage');
          return { Component };
        },
      },
      {
        path: 'categories',
        lazy: async () => {
          const { default: Component } =
            await import('@/pages/admin/categories/CategoriesPage');
          return { Component };
        },
      },
      {
        path: 'reviews',
        lazy: async () => {
          const { default: Component } =
            await import('@/pages/admin/reviews/ReviewsPage');
          return { Component };
        },
      },
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
]);
