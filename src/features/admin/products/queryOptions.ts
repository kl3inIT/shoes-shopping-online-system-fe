import { queryOptions } from '@tanstack/react-query';

import { getAdminShoes, getAdminShoeStockSummary } from './api';
import type {
  ShoeResponse,
  ShoeStockSummaryResponse,
} from '@/features/products';

export const adminShoesQueryKey = ['admin-shoes', 'all'] as const;
export const adminShoeStockSummaryQueryKey = [
  'admin-shoes',
  'stock-summary',
] as const;

export const adminShoesQueryOptions = () =>
  queryOptions<ShoeResponse[], Error>({
    queryKey: adminShoesQueryKey,
    queryFn: getAdminShoes,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

export const adminShoeStockSummaryQueryOptions = (
  threshold = 10,
  enabled = true
) =>
  queryOptions<ShoeStockSummaryResponse, Error>({
    queryKey: [...adminShoeStockSummaryQueryKey, threshold],
    queryFn: () => getAdminShoeStockSummary(threshold),
    staleTime: 10_000,
    refetchOnWindowFocus: false,
    enabled,
  });
