import { keepPreviousData, queryOptions } from '@tanstack/react-query';

import { getAdminShoes, getAdminShoeStockSummary } from './api';
import type {
  PageResponse,
  ShoeResponse,
  ShoeStockSummaryResponse,
  ShoesPageQueryParams,
} from '@/features/products';

export const adminShoesQueryKeyPrefix = ['admin-shoes'] as const;
export const adminShoeStockSummaryQueryKey = [
  'admin-shoes',
  'stock-summary',
] as const;

export const adminShoesQueryKey = (params: ShoesPageQueryParams) =>
  [
    ...adminShoesQueryKeyPrefix,
    params.page ?? 0,
    params.size ?? 10,
    params.sort ?? 'createdAt,desc',
    params.search ?? '',
    (params.brandIds ?? []).join(','),
    (params.categoryIds ?? []).join(','),
    (params.statuses ?? []).join(','),
  ] as const;

export const adminShoesQueryOptions = (params: ShoesPageQueryParams) =>
  queryOptions<PageResponse<ShoeResponse>, Error>({
    queryKey: adminShoesQueryKey(params),
    queryFn: () => getAdminShoes(params),
    placeholderData: keepPreviousData,
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
