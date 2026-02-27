import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addToCart, updateCartItem, removeCartItem, clearCart } from './api';
import type { AddToCartRequestDto, UpdateCartItemRequestDto } from './types';
import { cartQueryKey, cartQueryOptions } from './queryOptions';

export function useQueryCart() {
  return useQuery(cartQueryOptions());
}

export function useAddToCartMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AddToCartRequestDto) => addToCart(body),
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
