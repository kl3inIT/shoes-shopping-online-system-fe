import type { LoaderFunctionArgs } from 'react-router';
import type { QueryClient } from '@tanstack/react-query';

import {
  aiParameterDetailQueryOptions,
  aiParametersListQueryOptions,
  type AiTargetType,
} from '@/features/ai/parameters';
import { isHttpError } from '@/features/apiClient';

export const aiParametersLoader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const typeParam = url.searchParams.get('type') as AiTargetType | null;
    const selectedId = url.searchParams.get('id') ?? null;
    const type: AiTargetType = typeParam === 'SEARCH' ? 'SEARCH' : 'CHAT';

    try {
      await queryClient.ensureQueryData(aiParametersListQueryOptions(type));
      if (selectedId) {
        await queryClient.ensureQueryData(
          aiParameterDetailQueryOptions(selectedId)
        );
      }
    } catch (error) {
      if (isHttpError(error)) {
        // React Router expects Response
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw new Response(error.userMessage(), {
          status: error.status,
          statusText: error.status === 401 ? 'Unauthorized' : 'Forbidden',
        });
      }
      throw error;
    }

    return { type, selectedId };
  };
