import { MainLayout } from '@/layouts/MainLayout';
import { HomePage } from '@/pages/home/HomePage';
import { ProductsPage } from '@/pages/products/ProductsPage';
import Page404 from '@/pages/error/Page404';
import { createBrowserRouter } from 'react-router';
import { StaticPage } from '@/pages/static/StaticPage';
import AuthCallback from '@/pages/auth/AuthCallBack';

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
