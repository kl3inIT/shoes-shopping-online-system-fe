import { queryOptions } from '@tanstack/react-query';

import {
  getAllShoes,
  getAllBrands,
  getAllCategories,
  getShoeById,
  getAdminShoesAll,
  getAdminShoesDeleted,
  getAdminShoesNotDeleted,
} from './api';
import type { ShoeResponse, BrandResponse, CategoryResponse } from './types';

// ===== Query Keys =====

export const shoesQueryKey = ['shoes'] as const;
export const adminShoesAllQueryKey = ['admin-shoes', 'all'] as const;
export const adminShoesDeletedQueryKey = ['admin-shoes', 'deleted'] as const;
export const adminShoesNotDeletedQueryKey = [
  'admin-shoes',
  'not-deleted',
] as const;
export const brandsQueryKey = ['brands'] as const;
export const categoriesQueryKey = ['categories'] as const;
export const shoeByIdQueryKey = (id: string | null) =>
  ['shoes', id ?? ''] as const;

// ===== Catalog & Admin Shoe Queries =====

export const shoesQueryOptions = () =>
  queryOptions<ShoeResponse[], Error>({
    queryKey: shoesQueryKey,
    queryFn: getAllShoes,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

export const adminShoesAllQueryOptions = () =>
  queryOptions<ShoeResponse[], Error>({
    queryKey: adminShoesAllQueryKey,
    queryFn: getAdminShoesAll,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

export const adminShoesDeletedQueryOptions = () =>
  queryOptions<ShoeResponse[], Error>({
    queryKey: adminShoesDeletedQueryKey,
    queryFn: getAdminShoesDeleted,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

export const adminShoesNotDeletedQueryOptions = () =>
  queryOptions<ShoeResponse[], Error>({
    queryKey: adminShoesNotDeletedQueryKey,
    queryFn: getAdminShoesNotDeleted,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

// ===== Brand & Category Queries =====

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

// ===== Shoe detail =====

export const shoeByIdQueryOptions = (id: string | null) =>
  queryOptions<ShoeResponse, Error>({
    queryKey: shoeByIdQueryKey(id),
    queryFn: () => getShoeById(id!),
    enabled: !!id,
  });
