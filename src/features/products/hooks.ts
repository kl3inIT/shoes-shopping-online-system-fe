import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import {
  shoesQueryOptions,
  adminShoesAllQueryOptions,
  adminShoesDeletedQueryOptions,
  adminShoesNotDeletedQueryOptions,
  brandsQueryOptions,
  categoriesQueryOptions,
  shoeByIdQueryOptions,
} from './queryOptions';
import type { ShoeResponse, BrandResponse, CategoryResponse } from './types';

export * from './queryOptions';

export function useShoes(): UseQueryResult<ShoeResponse[], Error> {
  return useQuery(shoesQueryOptions());
}

export function useAdminShoesAll(): UseQueryResult<ShoeResponse[], Error> {
  return useQuery(adminShoesAllQueryOptions());
}

export function useAdminShoesDeleted(): UseQueryResult<ShoeResponse[], Error> {
  return useQuery(adminShoesDeletedQueryOptions());
}

export function useAdminShoesNotDeleted(): UseQueryResult<
  ShoeResponse[],
  Error
> {
  return useQuery(adminShoesNotDeletedQueryOptions());
}

export function useBrands(): UseQueryResult<BrandResponse[], Error> {
  return useQuery(brandsQueryOptions());
}

export function useCategories(): UseQueryResult<CategoryResponse[], Error> {
  return useQuery(categoriesQueryOptions());
}

export function useShoeById(id?: string): UseQueryResult<ShoeResponse, Error> {
  return useQuery(shoeByIdQueryOptions(id ?? null));
}
