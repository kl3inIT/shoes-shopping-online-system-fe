import apiClient from '@/features/apiClient';

export interface ShoeVariantResponse {
  id: string;
  shoeId: string;
  size: string;
  color: string;
  quantity: number;
  sku: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ShoeResponse {
  id: string;
  name: string;
  description: string;
  slug: string;
  material: string;
  gender: string;
  status: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  brandId: string;
  brandName: string;
  brandSlug: string;
  price: number;
  imageUrls: string[];
  variants: ShoeVariantResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface ResponseGeneral<T> {
  message: string;
  code: string;
  data: T;
  timestamp: string;
}

const SHOES_ENDPOINT = '/api/shoes';

/**
 * Get all shoes from the backend API
 * @returns Promise with array of ShoeResponse
 */
export async function getAllShoes(): Promise<ShoeResponse[]> {
  const response =
    await apiClient.get<ResponseGeneral<ShoeResponse[]>>(SHOES_ENDPOINT);
  return response.data.data;
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

/**
 * Get variants for a specific shoe
 * @param shoeId - Shoe UUID
 * @returns Promise with array of ShoeVariantResponse
 */
export async function getShoeVariants(
  shoeId: string
): Promise<ShoeVariantResponse[]> {
  const response = await apiClient.get<ResponseGeneral<ShoeVariantResponse[]>>(
    `${SHOES_ENDPOINT}/${shoeId}/variants`
  );
  return response.data.data;
}

export interface BrandResponse {
  id: string;
  name: string;
  description: string;
  slug: string;
  imageUrl?: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
  description: string;
  slug: string;
  parentId?: string;
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
