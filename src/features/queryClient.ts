import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { i18n } from '@/i18n';

function shouldSuppressErrorToast(meta: Record<string, unknown> | undefined) {
  return meta?.suppressErrorToast === true;
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (shouldSuppressErrorToast(query.meta)) {
        return;
      }
      const fallback = i18n.t('common.loadError');
      const message = error instanceof Error ? error.message : fallback;
      toast.error(message || fallback);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (shouldSuppressErrorToast(mutation.meta)) {
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
      staleTime: 1000 * 10,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 2,
    },
  },
});
