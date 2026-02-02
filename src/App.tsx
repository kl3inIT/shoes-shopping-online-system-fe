import { Suspense } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes/router';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
      <Toaster richColors closeButton position='top-right' />
    </Suspense>
  );
}
