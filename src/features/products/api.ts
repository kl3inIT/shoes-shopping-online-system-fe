import apiClient from '@/features/apiClient';
import {
  type ShoeResponse,
  type ShoeVariantResponse,
  type ResponseGeneral,
  type PageResponse,
  type BrandResponse,
  type CategoryResponse,
} from './types';

const SHOES_ENDPOINT = '/api/shoes';

/**
 * Get all shoes from the backend API (first page) for catalog/admin.
 * Hiện tại FE tự filter & paginate, nên chỉ cần content.
 */
export async function getAllShoes(): Promise<ShoeResponse[]> {
  const response = await apiClient.get<
    ResponseGeneral<PageResponse<ShoeResponse>>
  >(SHOES_ENDPOINT, {
    params: {
      page: 0,
      size: 200,
    },
  });
  return response.data.data.content;
}

/**
 * Get a single shoe by ID
 * @param id - Shoe UUID
 * @returns Promise with ShoeResponse
 */
export async function getShoeById(id: string): Promise<ShoeResponse> {
  const response = await apiClient.get<ResponseGeneral<ShoeResponse>>(
    `${SHOES_ENDPOINT}/${id}`
  );
  return response.data.data;
}

export async function deleteShoe(id: string): Promise<void> {
  await apiClient.delete(`${SHOES_ENDPOINT}/${id}`);
}

// ===== Admin-only shoe APIs =====

export async function getAdminShoesAll(): Promise<ShoeResponse[]> {
  const response = await apiClient.get<ResponseGeneral<ShoeResponse[]>>(
    `${SHOES_ENDPOINT}/admin/all`
  );
  return response.data.data;
}

export async function getAdminShoesDeleted(): Promise<ShoeResponse[]> {
  const response = await apiClient.get<ResponseGeneral<ShoeResponse[]>>(
    `${SHOES_ENDPOINT}/admin/deleted`
  );
  return response.data.data;
}

export async function getAdminShoesNotDeleted(): Promise<ShoeResponse[]> {
  const response = await apiClient.get<ResponseGeneral<ShoeResponse[]>>(
    `${SHOES_ENDPOINT}/admin/not-deleted`
  );
  return response.data.data;
}

export async function getAllBrands(): Promise<BrandResponse[]> {
  const response =
    await apiClient.get<ResponseGeneral<BrandResponse[]>>('/api/brands');
  return response.data.data;
}

export async function getAllCategories(): Promise<CategoryResponse[]> {
  const response =
    await apiClient.get<ResponseGeneral<CategoryResponse[]>>('/api/categories');
  return response.data.data;
}
