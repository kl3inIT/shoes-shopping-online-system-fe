import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from 'react-oidc-context';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { addToCart, updateCartItem, removeCartItem, clearCart } from './api';
import type { AddToCartRequestDto, UpdateCartItemRequestDto } from './types';
import { cartQueryKey, cartQueryOptions } from './queryOptions';

export function useQueryCart() {
  const auth = useAuth();

  return useQuery({
    ...cartQueryOptions(),
    enabled: auth.isAuthenticated,
    retry: 2,
  });
}

export function useAddToCartMutation() {
  const auth = useAuth();
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation<void, Error, AddToCartRequestDto>({
    mutationFn: async (body) => {
      if (!auth.isAuthenticated) {
        const message =
          i18n.language === 'vi'
            ? 'Vui lòng đăng nhập trước khi thêm vào giỏ hàng'
            : 'Please log in before adding to cart';
        toast.warning(message);
        return;
      }

      await addToCart(body);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cartQueryKey });
    },
  });
}

export function useUpdateCartItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      cartItemId,
      body,
    }: {
      cartItemId: string;
      body: UpdateCartItemRequestDto;
    }) => updateCartItem(cartItemId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cartQueryKey });
    },
  });
}

export function useRemoveCartItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cartItemId: string) => removeCartItem(cartItemId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cartQueryKey });
    },
  });
}

export function useClearCartMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cartQueryKey });
    },
  });
}
