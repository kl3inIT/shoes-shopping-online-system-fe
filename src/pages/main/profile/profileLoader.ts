import type { LoaderFunctionArgs } from 'react-router';
import type { QueryClient } from '@tanstack/react-query';
import { getMeQueryOptions } from '@/features/user/queryOptions';
import { isHttpError } from '@/features/apiClient';

export const profileLoader =
  (queryClient: QueryClient) => async (_args: LoaderFunctionArgs) => {
    try {
      await queryClient.ensureQueryData(getMeQueryOptions());
    } catch (error) {
      if (isHttpError(error)) {
        // React Router requires Response object, not Error
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw new Response(error.userMessage(), {
          status: error.status,
          statusText: error.status === 401 ? 'Unauthorized' : 'Forbidden',
        });
      }
      throw error;
    }

    return {};
  };
