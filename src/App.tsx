import { Suspense } from 'react';
import { RouterProvider } from 'react-router';

import { PageLoader } from '@/components/app';
import { Toaster } from '@/components/ui/sonner';
import { router } from './routes/router';

export default function App() {
  return (
    <Suspense
      fallback={<PageLoader className='min-h-screen rounded-none border-0' />}
    >
      <RouterProvider router={router} />
      <Toaster richColors closeButton position='top-right' />
    </Suspense>
  );
}
