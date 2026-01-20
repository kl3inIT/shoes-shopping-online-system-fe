import { Outlet } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';

export function MainLayout() {
  return (
    <div className='min-h-dvh bg-background text-foreground'>
      <Header />
      <main className='mx-auto max-w-6xl px-4 py-6'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
