import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getBrandById, createBrand, updateBrand, deleteBrand } from './api';
import type { BrandRequestDto, BrandDto } from './types';
import { brandsQueryKey, brandsQueryOptions } from './queryOptions';

export function useQueryBrands() {
  return useQuery(brandsQueryOptions());
}

export function useQueryBrand(id: string | null) {
  return useQuery({
    queryKey: [...brandsQueryKey, id],
    queryFn: () => getBrandById(id!),
    enabled: !!id,
  });
}

export function useCreateBrandMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: BrandRequestDto) => createBrand(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: brandsQueryKey });
    },
  });
}

export function useUpdateBrandMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: BrandRequestDto }) =>
      updateBrand(id, body),
    onSuccess: (updatedBrand) => {
      // Cập nhật cache ngay với brand vừa trả về (có logoUrl mới) để ảnh hiển thị ngay, không cần reload
      queryClient.setQueryData<BrandDto[]>(
        brandsQueryKey,
        (old) =>
          old?.map((b) => (b.id === updatedBrand.id ? updatedBrand : b)) ?? old
      );
      void queryClient.invalidateQueries({ queryKey: brandsQueryKey });
    },
  });
}

export function useDeleteBrandMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBrand(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: brandsQueryKey });
    },
  });
}
