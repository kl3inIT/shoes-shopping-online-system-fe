import { queryOptions } from '@tanstack/react-query';
import { getCart } from './api';

export const cartQueryKey = ['cart'] as const;

export const cartQueryOptions = () =>
  queryOptions({
    queryKey: cartQueryKey,
    queryFn: getCart,
    refetchOnWindowFocus: false,
  });
