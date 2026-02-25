import { queryOptions } from '@tanstack/react-query';
import { getBrands } from './api';

export const brandsQueryKey = ['brands'] as const;

export const brandsQueryOptions = () =>
  queryOptions({
    queryKey: brandsQueryKey,
    queryFn: getBrands,
  });
