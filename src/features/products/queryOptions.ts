import { queryOptions } from '@tanstack/react-query';

import {
  getAllBrands,
  getAllCategories,
  getAdminAllShoes,
  getAllShoes,
  getShoeById,
} from './api';
import type { ShoeResponse, BrandResponse, CategoryResponse } from './types';

export const brandsQueryKey = ['brands'] as const;
export const categoriesQueryKey = ['categories'] as const;
export const shoeByIdQueryKey = (id: string | null) =>
  ['shoes', id ?? ''] as const;
export const adminShoesAllQueryKey = ['admin-shoes', 'all'] as const;

export const shoesQueryOptions = () =>
  queryOptions<ShoeResponse[], Error>({
    queryKey: ['shoes'] as const,
    queryFn: getAllShoes,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

export const adminShoesAllQueryOptions = () =>
  queryOptions<ShoeResponse[], Error>({
    queryKey: adminShoesAllQueryKey,
    queryFn: getAdminAllShoes,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

export const brandsQueryOptions = () =>
  queryOptions<BrandResponse[], Error>({
    queryKey: brandsQueryKey,
    queryFn: getAllBrands,
  });

export const categoriesQueryOptions = () =>
  queryOptions<CategoryResponse[], Error>({
    queryKey: categoriesQueryKey,
    queryFn: getAllCategories,
  });

export const shoeByIdQueryOptions = (id: string | null) =>
  queryOptions<ShoeResponse, Error>({
    queryKey: shoeByIdQueryKey(id),
    queryFn: () => getShoeById(id!),
    enabled: !!id,
  });
