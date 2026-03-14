import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

import type {
  ShoeResponse,
  ShoeCreateRequestDto,
  ShoeUpdateRequestDto,
  ShoeStockSummaryResponse,
} from '@/features/products';
import { createShoe, updateShoe } from './api';
import {
  adminShoesQueryKey,
  adminShoesQueryOptions,
  adminShoeStockSummaryQueryKey,
  adminShoeStockSummaryQueryOptions,
} from './queryOptions';

export function useAdminShoes(): UseQueryResult<ShoeResponse[], Error> {
  return useQuery(adminShoesQueryOptions());
}

export function useAdminShoeStockSummary(
  threshold = 10,
  enabled = true
): UseQueryResult<ShoeStockSummaryResponse, Error> {
  return useQuery(adminShoeStockSummaryQueryOptions(threshold, enabled));
}

export function useCreateShoeMutation(): UseMutationResult<
  ShoeResponse,
  Error,
  {
    payload: ShoeCreateRequestDto;
    shoeImages?: File[];
    variantImages?: File[][];
  }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload, shoeImages, variantImages }) => {
      const res = await createShoe(payload, shoeImages, variantImages);
      return res.data;
    },
    onSuccess: (createdShoe) => {
      queryClient.setQueryData<ShoeResponse[]>(
        adminShoesQueryKey,
        (current = []) => [createdShoe, ...current]
      );
      void queryClient.invalidateQueries({ queryKey: adminShoesQueryKey });
      void queryClient.invalidateQueries({
        queryKey: adminShoeStockSummaryQueryKey,
      });
    },
  });
}

export function useUpdateShoeMutation(): UseMutationResult<
  ShoeResponse,
  Error,
  {
    id: string;
    payload: ShoeUpdateRequestDto;
    shoeImages?: File[];
    variantImages?: File[][];
  }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload, shoeImages, variantImages }) => {
      const res = await updateShoe(id, payload, shoeImages, variantImages);
      return res.data;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: adminShoesQueryKey });
      const previousShoes =
        queryClient.getQueryData<ShoeResponse[]>(adminShoesQueryKey);

      queryClient.setQueryData<ShoeResponse[]>(
        adminShoesQueryKey,
        (current = []) =>
          current.map((shoe) =>
            shoe.id === variables.id
              ? {
                  ...shoe,
                  status: variables.payload.status,
                }
              : shoe
          )
      );

      return { previousShoes };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousShoes) {
        queryClient.setQueryData(adminShoesQueryKey, context.previousShoes);
      }
    },
    onSuccess: (updatedShoe) => {
      queryClient.setQueryData<ShoeResponse[]>(
        adminShoesQueryKey,
        (current = []) =>
          current.map((shoe) =>
            shoe.id === updatedShoe.id
              ? {
                  ...shoe,
                  ...updatedShoe,
                }
              : shoe
          )
      );
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: adminShoesQueryKey });
      void queryClient.invalidateQueries({
        queryKey: adminShoeStockSummaryQueryKey,
      });
    },
  });
}
