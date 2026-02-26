import { queryOptions } from '@tanstack/react-query';
import { getWishlist } from './api';
import type { WishlistFilterParams } from './types';

function wishlistQueryKey(params?: WishlistFilterParams) {
  return [
    'wishlist',
    params?.sortBy ?? 'createdAt',
    params?.sortOrder ?? 'desc',
  ] as const;
}

export const wishlistQueryOptions = (params?: WishlistFilterParams) =>
  queryOptions({
    queryKey: wishlistQueryKey(params),
    queryFn: () => getWishlist(params),
    refetchOnWindowFocus: false,
  });
