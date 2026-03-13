import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from 'react-oidc-context';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { wishlistQueryOptions } from './queryOptions';
import { addToWishlist, removeFromWishlist } from './api';
import type { WishlistFilterParams } from './types';

export function useQueryWishlist(params?: WishlistFilterParams) {
  const auth = useAuth();

  return useQuery({
    ...wishlistQueryOptions(params),
    enabled: auth.isAuthenticated,
    retry: 2,
  });
}

export function useAddToWishlistMutation() {
  const auth = useAuth();
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (shoeId) => {
      if (!auth.isAuthenticated) {
        const message =
          i18n.language === 'vi'
            ? 'Vui lòng đăng nhập trước khi thêm vào wishlist'
            : 'Please log in before adding to wishlist';
        toast.warning(message);
        return;
      }

      await addToWishlist(shoeId);
    },
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
