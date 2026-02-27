import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createShoe, type CreateShoePayload } from './api';
import {
  adminShoesAllQueryKey,
  adminShoesDeletedQueryKey,
  adminShoesNotDeletedQueryKey,
} from '@/features/products';

interface CreateShoeArgs {
  payload: CreateShoePayload;
  shoeImages?: File[];
  variantImages?: File[][];
}

export function useCreateShoeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, shoeImages, variantImages }: CreateShoeArgs) =>
      createShoe(payload, shoeImages, variantImages),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminShoesAllQueryKey });
      void queryClient.invalidateQueries({
        queryKey: adminShoesNotDeletedQueryKey,
      });
      void queryClient.invalidateQueries({
        queryKey: adminShoesDeletedQueryKey,
      });
    },
  });
}
