import { type PropsWithChildren } from 'react';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { i18n } from '@/i18n';

import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from './AuthProvider';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query?.meta?.suppressErrorToast) {
        return;
      }
      const fallback = i18n.t('common.loadError');
      const message = error instanceof Error ? error.message : fallback;
      toast.error(message || fallback);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation?.meta?.suppressErrorToast) {
        return;
      }
      const fallback = i18n.t('common.error');
      const message = error instanceof Error ? error.message : fallback;
      toast.error(message || fallback);
    },
  }),
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 2,
    },
  },
});

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
