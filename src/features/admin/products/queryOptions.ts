import { queryOptions } from '@tanstack/react-query';

import { getAdminShoes } from './api';
import type { ShoeResponse } from '@/features/products';

export const adminShoesQueryKey = ['admin-shoes', 'all'] as const;

export const adminShoesQueryOptions = () =>
  queryOptions<ShoeResponse[], Error>({
    queryKey: adminShoesQueryKey,
    queryFn: getAdminShoes,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
