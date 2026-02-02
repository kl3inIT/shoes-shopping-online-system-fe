import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryRequestDto,
} from './api';
import type { Category } from './components/CategoryTable';

export const categoryKeys = {
  all: ['categories'] as const,
};

export function useCategoriesQuery() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: getCategories,
  });
}

export function useCreateCategoryMutation(
  options?: UseMutationOptions<Category, Error, CategoryRequestDto>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

export function useUpdateCategoryMutation(
  options?: UseMutationOptions<
    Category,
    Error,
    { id: string; data: CategoryRequestDto }
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

export function useDeleteCategoryMutation(
  options?: UseMutationOptions<void, Error, string>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
