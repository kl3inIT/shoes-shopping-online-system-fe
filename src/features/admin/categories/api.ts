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
  >('/categories', { skipAuth: true });

  const dtos = response.data.data ?? [];
  return dtos.map(toCategory);
}

export async function createCategory(
  data: CategoryRequestDto
): Promise<Category> {
  const response = await apiClient.post<
    ApiSuccessResponse<CategoryResponseDto>
  >('/categories', data);
  return toCategory(response.data.data);
}

export async function updateCategory(
  id: string,
  data: CategoryRequestDto
): Promise<Category> {
  const response = await apiClient.put<ApiSuccessResponse<CategoryResponseDto>>(
    `/categories/${id}`,
    data
  );
  return toCategory(response.data.data);
}

export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/categories/${id}`);
}
