import apiClient from '@/features/apiClient';
import type {
  BrandResponse,
  CategoryResponse,
  PageResponse,
  ResponseGeneral,
  ShoeResponse,
  ShoeStatus,
  ShoeVariantResponse,
} from './types';

const SHOES_ENDPOINT = '/api/shoes';
const MAX_PAGE_SIZE = 100;

type Primitive = string | number | boolean;
type ParamValue = Primitive | Primitive[] | null | undefined;

function serializeParams(params: Record<string, ParamValue>): string {
  const sp = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v === undefined || v === null) return;
        sp.append(key, String(v));
      });
    } else {
      sp.append(key, String(value));
    }
  });

  return sp.toString();
}

export interface ShoeSearchParams {
  search?: string;
  brandIds?: string[];
  sizes?: string[];
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  statuses?: ShoeStatus[];
  genders?: string[];
}

export interface PageableParams {
  page?: number;
  size?: number;
  sort?: string | string[];
}

function normalizePageable<T extends PageableParams>(params: T): T {
  const page = params.page ?? 0;
  const size = params.size ?? MAX_PAGE_SIZE;

  return {
    ...params,
    page: page < 0 ? 0 : page,
    size: size <= 0 ? 1 : size > MAX_PAGE_SIZE ? MAX_PAGE_SIZE : size,
  };
}

export async function searchShoes(
  params: ShoeSearchParams & PageableParams = {}
): Promise<PageResponse<ShoeResponse>> {
  const safeParams = normalizePageable(params);
  const response = await apiClient.get<
    ResponseGeneral<PageResponse<ShoeResponse>>
  >(SHOES_ENDPOINT, {
    params: safeParams,
    paramsSerializer: { serialize: serializeParams },
  });

  return response.data.data;
}

export async function getAllShoes(): Promise<ShoeResponse[]> {
  const page = await searchShoes({
    page: 0,
    size: 100,
    sort: 'createdAt,desc',
    statuses: ['ACTIVE', 'OUT_OF_STOCK'],
  });
  return page.content;
}

export async function getShoeById(id: string): Promise<ShoeResponse> {
  const response = await apiClient.get<ResponseGeneral<ShoeResponse>>(
    `${SHOES_ENDPOINT}/${id}`
  );
  return response.data.data;
}

export async function getShoeVariants(
  id: string
): Promise<ShoeVariantResponse[]> {
  const response = await apiClient.get<ResponseGeneral<ShoeVariantResponse[]>>(
    `${SHOES_ENDPOINT}/${id}/variants`
  );
  return response.data.data;
}

export async function getBestSellers(limit = 5): Promise<ShoeResponse[]> {
  const response = await apiClient.get<ResponseGeneral<ShoeResponse[]>>(
    `${SHOES_ENDPOINT}/best-sellers`,
    { params: { limit } }
  );
  return response.data.data;
}

export async function getNewArrivals(limit = 5): Promise<ShoeResponse[]> {
  const response = await apiClient.get<ResponseGeneral<ShoeResponse[]>>(
    `${SHOES_ENDPOINT}/new-arrivals`,
    { params: { limit } }
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
