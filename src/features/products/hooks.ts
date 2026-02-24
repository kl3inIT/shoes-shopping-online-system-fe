import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import {
  getAllShoes,
  getAllBrands,
  getAllCategories,
  type ShoeResponse,
  type BrandResponse,
  type CategoryResponse,
} from './api';

export const shoesQueryKey = ['shoes'] as const;
export const brandsQueryKey = ['brands'] as const;
export const categoriesQueryKey = ['categories'] as const;

export function useShoes(): UseQueryResult<ShoeResponse[], Error> {
  return useQuery({
    queryKey: shoesQueryKey,
    queryFn: getAllShoes,
  });
}

export function useBrands(): UseQueryResult<BrandResponse[], Error> {
  return useQuery({
    queryKey: brandsQueryKey,
    queryFn: getAllBrands,
  });
}

export function useCategories(): UseQueryResult<CategoryResponse[], Error> {
  return useQuery({
    queryKey: categoriesQueryKey,
    queryFn: getAllCategories,
  });
}
