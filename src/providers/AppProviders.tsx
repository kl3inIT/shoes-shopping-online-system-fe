import { type PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/features/queryClient';

import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from './AuthProvider';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    // <WebSocketProvider>
    <ThemeProvider defaultTheme='system'>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
    // </WebSocketProvider>
  );
}
