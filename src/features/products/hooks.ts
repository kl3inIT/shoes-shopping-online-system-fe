import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import {
  shoesQueryOptions,
  brandsQueryOptions,
  categoriesQueryOptions,
  shoeByIdQueryOptions,
  bestSellersQueryOptions,
  newArrivalsQueryOptions,
} from './queryOptions';
import type { ShoeResponse, BrandResponse, CategoryResponse } from './types';

export * from './queryOptions';

export function useShoes(): UseQueryResult<ShoeResponse[], Error> {
  return useQuery(shoesQueryOptions());
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

export function useBestSellers(
  limit = 5
): UseQueryResult<ShoeResponse[], Error> {
  return useQuery(bestSellersQueryOptions(limit));
}

export function useNewArrivals(
  limit = 5
): UseQueryResult<ShoeResponse[], Error> {
  return useQuery(newArrivalsQueryOptions(limit));
}
