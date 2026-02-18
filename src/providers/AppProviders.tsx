import { type PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from './AuthProvider';
import { WebSocketProvider } from './WebSocketProvider';

const queryClient = new QueryClient();

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
