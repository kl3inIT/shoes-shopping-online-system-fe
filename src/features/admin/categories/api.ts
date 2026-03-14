import apiClient from '@/features/apiClient';
import type { ApiSuccessResponse } from '@/types';
import type { Category } from './components/CategoryTable';

/**
 * Backend Category entity response.
 */
export interface CategoryResponseDto {
  id: string;
  name: string;
  description: string;
  slug: string;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRequestDto {
  name: string;
  description: string;
}

function toCategory(dto: CategoryResponseDto): Category {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? '',
    slug: dto.slug ?? '',
    imageUrl: '',
    parentCategory: null,
    productCount: dto.productCount ?? 0,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get<
    ApiSuccessResponse<CategoryResponseDto[]>
  >('/api/categories', { skipAuth: true });

  const dtos = response.data.data ?? [];
  return dtos.map(toCategory);
}

export async function createCategory(
  data: CategoryRequestDto
): Promise<Category> {
  const response = await apiClient.post<
    ApiSuccessResponse<CategoryResponseDto>
  >('/api/categories', data, { skipAuth: true });
  const dto = response.data.data;
  if (!dto) throw new Error('No data returned from create category');
  return toCategory(dto);
}

export async function updateCategory(
  id: string,
  data: CategoryRequestDto
): Promise<Category> {
  const response = await apiClient.put<ApiSuccessResponse<CategoryResponseDto>>(
    `/api/categories/${id}`,
    data,
    { skipAuth: true }
  );
  const dto = response.data.data;
  if (!dto) throw new Error('No data returned from update category');
  return toCategory(dto);
}

export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/api/categories/${id}`, { skipAuth: true });
}
