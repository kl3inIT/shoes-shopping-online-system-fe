import { QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren } from 'react';

import { queryClient } from '@/features/queryClient';

import { AuthProvider } from './AuthProvider';
import { ThemeProvider } from './ThemeProvider';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme='system'>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
