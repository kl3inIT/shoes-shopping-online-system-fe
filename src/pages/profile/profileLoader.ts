import type { LoaderFunctionArgs } from 'react-router';
import type { QueryClient } from '@tanstack/react-query';
import { getUserDetailQueryOptions } from '@/features/user/queryOptions';
import { isHttpError } from '@/features/apiClient';

export const profileLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const keycloakId = params.keycloakId;

    if (!keycloakId) {
      throw new Response('Keycloak ID is required', {
        status: 400,
        statusText: 'Bad Request',
      });
    }

    try {
      await queryClient.ensureQueryData(getUserDetailQueryOptions(keycloakId));
    } catch (error) {
      if (isHttpError(error)) {
        throw new Response(error.userMessage(), {
          status: error.status,
          statusText: error.status === 401 ? 'Unauthorized' : 'Forbidden',
        });
      }
      throw error;
    }

    return { keycloakId };
  };
