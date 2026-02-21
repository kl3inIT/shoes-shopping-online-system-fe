import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { wishlistQueryOptions } from './queryOptions';
import { addToWishlist, removeFromWishlist } from './api';
import type { WishlistFilterParams } from './types';

export function useQueryWishlist(params?: WishlistFilterParams) {
  return useQuery(wishlistQueryOptions(params));
}

export function useAddToWishlistMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (shoeId: string) => addToWishlist(shoeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

export function useRemoveFromWishlistMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shoeId: string) => removeFromWishlist(shoeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}
