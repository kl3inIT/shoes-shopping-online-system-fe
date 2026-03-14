import { QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren } from 'react';

import { queryClient } from '@/features/queryClient';

import { AuthProvider } from './AuthProvider';
import { ThemeProvider } from './ThemeProvider';
import { WebSocketProvider } from './WebSocketProvider';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <WebSocketProvider>
      <ThemeProvider defaultTheme='system'>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </WebSocketProvider>
  );
}
