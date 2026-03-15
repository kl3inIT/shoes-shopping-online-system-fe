import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import {
  shoesQueryOptions,
  brandsQueryOptions,
  categoriesQueryOptions,
  shoeByIdQueryOptions,
  bestSellersQueryOptions,
  newArrivalsQueryOptions,
} from './queryOptions';
import type {
  ShoeResponse,
  BrandResponse,
  CategoryResponse,
  PageResponse,
} from './types';
import type { ShoesPageQueryParams } from './queryOptions';

export * from './queryOptions';

export function useShoes(
  params: ShoesPageQueryParams
): UseQueryResult<PageResponse<ShoeResponse>, Error> {
  return useQuery(shoesQueryOptions(params));
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
