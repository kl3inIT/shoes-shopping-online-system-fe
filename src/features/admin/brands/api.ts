import type { ApiSuccessResponse } from '@/types';
import type { BrandDto, BrandRequestDto } from './types';
import apiClient from '@/features/apiClient';

export async function getBrands(): Promise<BrandDto[]> {
  const response =
    await apiClient.get<ApiSuccessResponse<BrandDto[]>>('/api/brands');
  return response.data.data;
}

export async function getBrandById(id: string): Promise<BrandDto> {
  const response = await apiClient.get<ApiSuccessResponse<BrandDto>>(
    `/api/brands/${id}`
  );
  return response.data.data;
}

export async function createBrand(body: BrandRequestDto): Promise<BrandDto> {
  const response = await apiClient.post<ApiSuccessResponse<BrandDto>>(
    '/api/brands',
    body
  );
  return response.data.data;
}

export async function updateBrand(
  id: string,
  body: BrandRequestDto
): Promise<BrandDto> {
  const response = await apiClient.put<ApiSuccessResponse<BrandDto>>(
    `/api/brands/${id}`,
    body
  );
  return response.data.data;
}

export async function deleteBrand(id: string): Promise<void> {
  await apiClient.delete(`/api/brands/${id}`);
}
