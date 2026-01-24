import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { queryClient } from '../features/queryClient';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
export function QueryProvider({ children }: Readonly<PropsWithChildren>) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} position='bottom' />
      )}
    </QueryClientProvider>
  );
}
