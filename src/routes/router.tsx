import { MainLayout } from '@/layouts/main/MainLayout';
import { HomePage } from '@/pages/home/HomePage';
import { ProductsPage } from '@/pages/products/ProductsPage';
import Page404 from '@/pages/error/Page404';
import { createBrowserRouter } from 'react-router';
import { StaticPage } from '@/pages/static/StaticPage';
import AuthCallback from '@/pages/auth/AuthCallBack';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <Page404 />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },

      // Protected routes - Yêu cầu đăng nhập
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          // Thêm các protected routes khác ở đây
          // { path: 'orders', element: <OrdersPage /> },
          // { path: 'settings', element: <SettingsPage /> },
        ],
      },

      // Footer links (placeholders)
      { path: 'about', element: <StaticPage title='About Us' /> },
      { path: 'careers', element: <StaticPage title='Careers' /> },
      { path: 'blog', element: <StaticPage title='Blog' /> },
      { path: 'press', element: <StaticPage title='Press' /> },
      { path: 'contact', element: <StaticPage title='Contact' /> },
      { path: 'help', element: <StaticPage title='Help Center' /> },
      { path: 'shipping', element: <StaticPage title='Shipping & Returns' /> },
      { path: 'warranty', element: <StaticPage title='Warranty' /> },
      { path: 'privacy', element: <StaticPage title='Privacy Policy' /> },
      { path: 'terms', element: <StaticPage title='Terms of Service' /> },
      { path: 'cookies', element: <StaticPage title='Cookies' /> },
      { path: 'sitemap', element: <StaticPage title='Sitemap' /> },

      // SPA 404
      { path: '*', element: <Page404 /> },
    ],
  },
]);
