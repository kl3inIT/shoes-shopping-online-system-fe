import { Suspense } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes/router';

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
