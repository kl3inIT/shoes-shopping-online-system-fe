import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

import type {
  PageResponse,
  ShoeResponse,
  ShoeCreateRequestDto,
  ShoeUpdateRequestDto,
  ShoeStockSummaryResponse,
  ShoesPageQueryParams,
} from '@/features/products';
import { createShoe, updateShoe } from './api';
import {
  adminShoesQueryKeyPrefix,
  adminShoesQueryOptions,
  adminShoeStockSummaryQueryKey,
  adminShoeStockSummaryQueryOptions,
} from './queryOptions';

export function useAdminShoes(
  params: ShoesPageQueryParams
): UseQueryResult<PageResponse<ShoeResponse>, Error> {
  return useQuery(adminShoesQueryOptions(params));
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
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: adminShoesQueryKeyPrefix,
      });
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
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: adminShoesQueryKeyPrefix,
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: adminShoesQueryKeyPrefix,
      });
      void queryClient.invalidateQueries({
        queryKey: adminShoeStockSummaryQueryKey,
      });
    },
  });
}
