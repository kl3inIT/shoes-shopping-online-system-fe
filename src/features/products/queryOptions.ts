import { queryOptions } from '@tanstack/react-query';

import {
  getAllBrands,
  getAllCategories,
  getAllShoes,
  getShoeById,
  getBestSellers,
  getShoesList,
} from './api';
import type { ShoeResponse, BrandResponse, CategoryResponse } from './types';

// ===== Query Keys =====

export const shoesQueryKey = ['shoes'] as const;
export const bestSellersQueryKey = ['shoes', 'best-sellers'] as const;
export const newArrivalsQueryKey = ['shoes', 'new-arrivals'] as const;
export const brandsQueryKey = ['brands'] as const;
export const categoriesQueryKey = ['categories'] as const;
export const shoeByIdQueryKey = (id: string | null) =>
  ['shoes', id ?? ''] as const;

export const shoesQueryOptions = () =>
  queryOptions<ShoeResponse[], Error>({
    queryKey: shoesQueryKey,
    queryFn: getAllShoes,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    meta: {
      suppressErrorToast: true,
    },
  });

// ===== Home page queries =====

export const bestSellersQueryOptions = (limit = 5) =>
  queryOptions<ShoeResponse[], Error>({
    queryKey: [...bestSellersQueryKey, limit] as const,
    queryFn: () => getBestSellers(limit),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

export const newArrivalsQueryOptions = (limit = 5) =>
  queryOptions<ShoeResponse[], Error>({
    queryKey: [...newArrivalsQueryKey, limit] as const,
    queryFn: async () => {
      const page = await getShoesList({
        sort: 'createdAt',
        order: 'desc',
        page: 0,
        size: limit,
      });
      return page.content;
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

// ===== Brand & Category Queries =====

export const brandsQueryOptions = () =>
  queryOptions<BrandResponse[], Error>({
    queryKey: brandsQueryKey,
    queryFn: getAllBrands,
    meta: {
      suppressErrorToast: true,
    },
  });

export const categoriesQueryOptions = () =>
  queryOptions<CategoryResponse[], Error>({
    queryKey: categoriesQueryKey,
    queryFn: getAllCategories,
    meta: {
      suppressErrorToast: true,
    },
  });

export const shoeByIdQueryOptions = (id: string | null) =>
  queryOptions<ShoeResponse, Error>({
    queryKey: shoeByIdQueryKey(id),
    queryFn: () => getShoeById(id!),
    enabled: !!id,
  });
